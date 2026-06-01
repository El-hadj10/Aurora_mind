// Hook React pour dialoguer avec le MCP WebSocket relay
import { useState, useCallback } from "react";
import { useMcpStore } from "../../mcpManager";

export function useMcpWebSocket() {
  const [lastPong, setLastPong] = useState<number | null>(null);
  const [lastResponse, setLastResponse] = useState<any>(null);

  const { relayConnected, callServerTool, error } = useMcpStore();

  const ping = useCallback(() => {
    // Simule un ping local ou peut être étendu pour envoyer un ping réel au relay
    setLastPong(Date.now()); 
  }, []);

  // Envoi générique d'une requête MCP
  const sendMcpMessage = useCallback(async (payload: any) => {
    const targetServer = payload.server || "github-server"; // Par défaut github pour le test
    if (payload.tool) {
      const result = await callServerTool(targetServer, payload.tool, payload.args || {});
      setLastResponse(result);
    }
  }, [callServerTool]);

  return { connected: relayConnected, lastPong, error, ping, sendMcpMessage, lastResponse };
}
