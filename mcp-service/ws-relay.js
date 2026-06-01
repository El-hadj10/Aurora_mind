// MCP WebSocket relay server for Aurora-Mind
// Usage: node mcp-service/ws-relay.js

const WebSocket = require('ws');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/dist/cjs/client/stdio.js');
const { Client } = require('@modelcontextprotocol/sdk/dist/cjs/client/index.js');

const MCP_SERVERS = [
  { // Chrome DevTools Relay
    name: 'chrome-devtools-relay',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-chrome-devtools']
  },
  { 
    name: 'playwright-relay',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-playwright']
  },
  { // GitHub Server
    name: 'github-server',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github'],
    env: { GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_TOKEN || process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '' }
  },
  { // MongoDB Server
    name: 'mongodb-server',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-mongodb', 'mongodb://localhost:27017']
  }
];

const backendMcpClients = {}; // Stores the actual MCP Client instances for backend servers
const backendMcpClientStatus = {}; // Stores the connection status of each backend MCP server

// Function to broadcast status updates to all connected WebSocket clients
function broadcastServerStatuses() {
  wss.clients.forEach(wsClient => {
    if (wsClient.readyState === WebSocket.OPEN) {
      wsClient.send(JSON.stringify({ 
        jsonrpc: "2.0", 
        method: "notifications/mcp_status_update", 
        params: { statuses: backendMcpClientStatus } 
      }));
    }
  });
}

async function connectAllBackendMcpServers() {
  for (const config of MCP_SERVERS) {
    try {
      if (backendMcpClients[config.name]) continue; // Already connected

      const transport = new StdioClientTransport({
        command: config.command,
        args: config.args,
        env: { ...process.env, ...config.env }
      });
      const client = new Client({ name: `aurora-relay-${config.name}`, version: "1.0.0" }, { capabilities: {} });

      client.onConnect(() => {
        backendMcpClientStatus[config.name] = true;
        console.log(`[MCP-Relay] Backend server ${config.name} connected.`);
        broadcastServerStatuses(); // Notify frontends
      });

      client.onClose(() => {
        backendMcpClientStatus[config.name] = false;
        console.log(`[MCP-Relay] Backend server ${config.name} disconnected.`);
        broadcastServerStatuses(); // Notify frontends
      });

      await client.connect(transport);
      backendMcpClients[config.name] = client;
      backendMcpClientStatus[config.name] = true; // Initial status
      console.log(`[MCP-Relay] Attempting to connect to backend server: ${config.name}`);
    } catch (e) {
      console.error(`[MCP-Relay] Failed to connect to backend server ${config.name}:`, e.message);
      backendMcpClientStatus[config.name] = false; // Mark as failed
    }
  }
  broadcastServerStatuses(); // Send initial statuses after all attempts
}

const wss = new WebSocket.Server({ port: 3031 });

wss.on('connection', ws => {
  console.log('[MCP-Relay] Frontend connected.');
  // Send current status of all backend MCP servers to the newly connected frontend
  ws.send(JSON.stringify({ type: 'mcp_status_update', statuses: backendMcpClientStatus }));

  ws.on('message', async msg => {
    let req;
    try {
      req = JSON.parse(msg);
    } catch (e) {
      ws.send(JSON.stringify({ error: 'Invalid JSON' }));
      return;
    }

    if (req.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong', time: Date.now() }));
      return;
    }

    // Gestion du routage JSON-RPC (SDK MCP)
    if (req.method === 'tools/call' && req.params && req.params.arguments) {
      const serverName = req.params.arguments.__mcp_server__;
      const toolName = req.params.name;
      const toolArgs = { ...req.params.arguments };
      delete toolArgs.__mcp_server__; // Nettoyage de la clé de routage

      const client = backendMcpClients[serverName];
      if (client) {
        try {
          const result = await client.callTool({ name: toolName, arguments: toolArgs });
          ws.send(JSON.stringify({ jsonrpc: "2.0", id: req.id, result }));
        } catch (e) {
          ws.send(JSON.stringify({ jsonrpc: "2.0", id: req.id, error: { message: e.message } }));
        }
      } else {
        ws.send(JSON.stringify({ jsonrpc: "2.0", id: req.id, error: { message: `Server ${serverName} not found` } }));
      }
      return;
    }

    // Support pour les anciennes requêtes manuelles du panneau de test
    const targetServer = req.server || (req.arguments && req.arguments.__mcp_server__);
    const client = backendMcpClients[targetServer];
    if (client && req.tool) {
      const result = await client.callTool({ name: req.tool, arguments: req.args || {} });
      ws.send(JSON.stringify({ type: 'tool_result', server: targetServer, result }));
    } else {
      ws.send(JSON.stringify({ error: `Serveur non trouvé ou format de requête inconnu`, req }));
    }
  });
});

wss.on('listening', () => {
  connectAllBackendMcpServers().then(() => {
    console.log('[MCP-Relay] WebSocket relay démarré sur ws://localhost:3031');
  });
});
