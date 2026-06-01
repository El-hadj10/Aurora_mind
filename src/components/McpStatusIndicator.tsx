import { useMcpStore } from '../../mcpManager';
import { useMcpWebSocket } from '../hooks/useMcpWebSocket';

export function McpStatusIndicator() {
  const { individualServerStatuses } = useMcpStore();
  const { connected: wsConnected } = useMcpWebSocket();

  return (
    <div className="p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg">
      <h3 className="font-bold mb-1">MCP Status</h3>
      <div className="flex items-center mb-1">
        <span className={`w-2 h-2 rounded-full mr-2 ${wsConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
        <span>Relay: {wsConnected ? 'Connecté' : 'Déconnecté'}</span>
      </div>
      {Object.keys(individualServerStatuses).length > 0 && (
        <div className="mt-2 border-t border-gray-700 pt-2">
          <h4 className="font-semibold mb-1">Serveurs MCP:</h4>
          {Object.entries(individualServerStatuses).map(([serverName, isConnected]) => (
            <div key={serverName} className="flex items-center mb-0.5">
              <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{serverName}: {isConnected ? 'Connecté' : 'Déconnecté'}</span>
            </div>
          ))}
        </div>
      )}
      {Object.keys(individualServerStatuses).length === 0 && wsConnected && (
        <p className="text-gray-400 mt-2">En attente des statuts des serveurs...</p>
      )}
      {!wsConnected && (
        <p className="text-red-300 mt-2">Le relay WebSocket est déconnecté. Lancez `node mcp-service/ws-relay.js`.</p>
      )}
    </div>
  );
}