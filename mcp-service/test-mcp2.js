// Test d'import MCP SDK via le mapping package.json
const { Client } = require('@modelcontextprotocol/sdk/client');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio');

console.log('Client:', typeof Client);
console.log('StdioClientTransport:', typeof StdioClientTransport);
