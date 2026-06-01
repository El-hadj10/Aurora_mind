import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { WebSocketClientTransport } from "@modelcontextprotocol/sdk/client/websocket.js";
import { create } from 'zustand';
import { z } from 'zod';

/**
 * Interface pour les variables d'environnement Vite
 */
// Env Vite (inutilisé pour l'instant, conservé pour extensions futures)
// const viteEnv = (import.meta as any).env;

interface IndividualMcpServerStatus {
  [serverName: string]: boolean;
}

interface McpState {
  relayClient: Client | null;
  relayConnected: boolean;
  individualServerStatuses: IndividualMcpServerStatus;
  isConnecting: boolean;
  error: string | null;
  connectToRelay: () => Promise<void>;
  disconnectFromRelay: () => Promise<void>;
  callServerTool: (serverName: string, toolName: string, args?: Record<string, any>) => Promise<any>;
  updateIndividualServerStatus: (statuses: IndividualMcpServerStatus) => void;
  setRelayConnected: (connected: boolean) => void;
}

/**
 * Store Zustand pour gérer l'état global des extensions MCP
 */
export const useMcpStore = create<McpState>((set, get) => ({
  relayClient: null,
  relayConnected: false,
  individualServerStatuses: {},
  isConnecting: false,
  error: null,

  connectToRelay: async () => {
    set({ isConnecting: true, error: null });
    if (get().relayConnected) return;

    try {
      const transport = new WebSocketClientTransport(new URL("ws://localhost:3031"));
      const client = new Client(
        { name: "aurora-mind-client", version: "1.0.0" },
        { capabilities: {} }
      );

      // Écouter les mises à jour de statut envoyées par le relay
      // Schéma Zod requis par le SDK MCP (method literal obligatoire)
      const McpStatusSchema = z.object({
        method: z.literal("notifications/mcp_status_update"),
        params: z.object({ statuses: z.record(z.string(), z.boolean()) }).optional(),
      });
      client.setNotificationHandler(McpStatusSchema, (notification) => {
        if (notification.params?.statuses) {
          get().updateIndividualServerStatus(notification.params.statuses);
        }
      });

      await client.connect(transport);
      set({ relayClient: client, relayConnected: true, isConnecting: false });
      console.log(`[MCP] Connecté au relay WebSocket`);
    } catch (err) {
      // err peut être un Event WebSocket (isTrusted:true) ou une vraie Error
      let msg: string;
      if (err instanceof Error) {
        msg = err.message || "Erreur inconnue";
      } else if (err && typeof err === "object" && "type" in err) {
        msg = "Relay MCP inaccessible (ws://localhost:3031) — lancez : cd mcp-service && node ws-relay.js";
      } else {
        msg = String(err) || "Erreur de connexion WebSocket";
      }
      set({ error: msg, isConnecting: false });
      console.error("[MCP] Erreur de connexion:", err);
    }
  },

  disconnectFromRelay: async () => {
    const { relayClient } = get();
    if (relayClient) await relayClient.close();
    set({ relayClient: null, relayConnected: false, error: null });
  },

  updateIndividualServerStatus: (statuses) => set({ individualServerStatuses: statuses }),
  setRelayConnected: (connected) => set({ relayConnected: connected }),

  // Utilitaire pour appeler un outil via le relay
  callServerTool: async (serverName: string, toolName: string, args: Record<string, any> = {}) => {
    const { relayClient, relayConnected } = get();
    if (!relayClient || !relayConnected) throw new Error(`Non connecté au relay MCP`);
    
    return await relayClient.callTool({ 
      name: toolName, 
      arguments: { ...args, __mcp_server__: serverName } 
    });
  }
}));

/**
 * Initialise la connexion globale au relay MCP
 */
export async function initializeExtensions() {
  try {
    await useMcpStore.getState().connectToRelay();
  } catch (err) {
    console.error("[MCP] Échec de l'initialisation:", err);
  }
}

/**
 * Fonction de test pour vérifier le fonctionnement des serveurs
 */
export async function testExtensions() {
  const store = useMcpStore.getState();
  
  console.log("--- Test des serveurs MCP ---");

  // Test VSCode : Lister les fichiers ouverts
  try {
    const vscodeFiles = await store.callServerTool("vscode-server", "list_open_files");
    console.log("VSCode - Fichiers ouverts:", vscodeFiles);
  } catch (e) {
    console.warn("VSCode Server non testé ou erreur");
  }

  // Test GitHub : Rechercher un repo (si token configuré)
  try {
    const repos = await store.callServerTool("github-server", "search_repositories", { query: "aurora-mind" });
    console.log("GitHub - Recherche:", repos);
  } catch (e) {
    console.warn("GitHub Server non testé (vérifie ton VITE_GITHUB_TOKEN)");
  }

  // Test MongoDB : Lister les bases de données
  try {
    const dbs = await store.callServerTool("mongodb-server", "list_databases");
    console.log("MongoDB - Bases de données:", dbs);
  } catch (e) {
    console.warn("MongoDB Server non testé (vérifie si MongoDB tourne en local)");
  }
}