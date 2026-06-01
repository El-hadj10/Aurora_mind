// Test d'import MCP SDK Node.js depuis la racine
const { Client } = require('@modelcontextprotocol/sdk/client');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio');

console.log('Client:', typeof Client);
console.log('StdioClientTransport:', typeof StdioClientTransport);
