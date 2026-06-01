// MCP Service Node.js - API locale pour MCP relay
// Lance ce service avec : node mcp-service/index.js

const express = require('express');
const cors = require('cors');
const { Client } = require('@modelcontextprotocol/sdk/client');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio');

const app = express();
app.use(cors());
app.use(express.json());

const MCP_SERVERS = [
  {
    name: 'chrome-devtools-relay',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-chrome-devtools']
  },
  {
    name: 'vscode-server',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-vscode-edit']
  }
  // Ajoute d'autres serveurs ici si besoin
];

const clients = {};

async function connectAll() {
  for (const config of MCP_SERVERS) {
    if (clients[config.name]) continue;
    const transport = new StdioClientTransport({
      command: config.command,
      args: config.args
    });
    const client = new Client(
      { name: 'aurora-mind-service', version: '1.0.0' },
      { capabilities: {} }
    );
    await client.connect(transport);
    clients[config.name] = client;
    console.log(`[MCP] Connecté à ${config.name}`);
  }
}

app.post('/mcp/:server/tool/:tool', async (req, res) => {
  const { server, tool } = req.params;
  const args = req.body || {};
  const client = clients[server];
  if (!client) return res.status(404).json({ error: 'Serveur MCP non connecté' });
  try {
    const result = await client.callTool({ name: tool, arguments: args });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/mcp/health', (req, res) => {
  res.json({ status: 'ok', servers: Object.keys(clients) });
});

const PORT = 3030;
app.listen(PORT, async () => {
  await connectAll();
  console.log(`[MCP] Service API démarré sur http://localhost:${PORT}`);
});
