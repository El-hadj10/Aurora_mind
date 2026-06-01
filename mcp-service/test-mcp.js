// Test d'import MCP SDK Node.js
const { Client } = require('@modelcontextprotocol/sdk/dist/cjs/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/dist/cjs/client/stdio.js');

console.log('Client:', typeof Client);
console.log('StdioClientTransport:', typeof StdioClientTransport);
