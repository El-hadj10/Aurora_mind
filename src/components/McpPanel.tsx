import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMcpWebSocket } from "../hooks/useMcpWebSocket";
import { useMcpStore } from "../../mcpManager";

const DEFAULT_PAYLOAD = JSON.stringify(
  { server: "github-server", tool: "search_repositories", args: { query: "aurora-mind" } },
  null,
  2
);

export const McpPanel: React.FC = () => {
  const [open,       setOpen]       = useState(false);
  const [payload,    setPayload]    = useState(DEFAULT_PAYLOAD);
  const [jsonError,  setJsonError]  = useState<string | null>(null);

  const { connected, lastPong, error, ping, sendMcpMessage, lastResponse } = useMcpWebSocket();
  const { individualServerStatuses } = useMcpStore();

  const handleChange = (v: string) => {
    setPayload(v);
    try { JSON.parse(v); setJsonError(null); }
    catch (e: unknown) { setJsonError(e instanceof Error ? e.message : "JSON invalide"); }
  };

  const handleSend = () => {
    try { sendMcpMessage(JSON.parse(payload)); setJsonError(null); }
    catch (e: unknown) { setJsonError(e instanceof Error ? e.message : "JSON invalide"); }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* ── Toggle ─────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold",
          "bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md",
          "border border-zinc-200/60 dark:border-zinc-700/60 shadow-lg",
          "transition-all hover:shadow-xl",
        ].join(" ")}
        type="button"
        title="Ouvrir/fermer le panel MCP"
      >
        <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
        <span className="text-zinc-700 dark:text-zinc-200">
          MCP {connected ? "✓" : "✗"}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500">{open ? "▲" : "▼"}</span>
      </button>

      {/* ── Panel ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mcp-panel"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1     }}
            exit={{    opacity: 0, y: -10, scale: 0.97  }}
            transition={{ duration: 0.2 }}
            className="w-80 max-w-[calc(100vw-2rem)]
              bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl
              border border-zinc-200/60 dark:border-zinc-700/60
              rounded-2xl shadow-2xl p-4 flex flex-col gap-3"
          >
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300">MCP Relay</span>
              <div className="flex gap-1.5">
                <button
                  className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs
                    hover:bg-zinc-200 dark:hover:bg-zinc-700 transition disabled:opacity-40"
                  onClick={ping}
                  disabled={!connected}
                  type="button"
                >
                  Ping {lastPong ? "✓" : ""}
                </button>
              </div>
            </div>

            {/* Serveurs MCP */}
            {Object.keys(individualServerStatuses).length > 0 && (
              <div className="flex flex-col gap-1">
                {Object.entries(individualServerStatuses).map(([name, ok]) => (
                  <div key={name} className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-emerald-400" : "bg-rose-400"}`} />
                    {name}
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-xs text-rose-400 bg-rose-50 dark:bg-rose-950/40 rounded-lg px-2 py-1.5 flex flex-col gap-0.5">
                <span className="font-semibold text-rose-500">⚠ Relay déconnecté</span>
                <span className="text-rose-400/80 break-words">{error}</span>
              </div>
            )}

            {/* Payload editor */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Payload JSON</label>
              <textarea
                className={[
                  "w-full h-24 p-2 rounded-xl border text-xs font-mono resize-none",
                  "bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200",
                  jsonError
                    ? "border-rose-400 focus:ring-rose-300"
                    : "border-zinc-200 dark:border-zinc-700 focus:ring-purple-300",
                  "focus:outline-none focus:ring-2 transition",
                ].join(" ")}
                value={payload}
                onChange={(e) => handleChange(e.target.value)}
                spellCheck={false}
              />
              {jsonError && <p className="text-xs text-rose-500">{jsonError}</p>}
            </div>

            <button
              className="px-3 py-1.5 rounded-xl text-xs font-bold
                bg-purple-500 hover:bg-purple-600 text-white
                transition disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!connected || !!jsonError}
              onClick={handleSend}
              type="button"
            >
              Envoyer →
            </button>

            {/* Response */}
            {lastResponse && (
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Réponse</span>
                <pre className="text-xs bg-zinc-100 dark:bg-zinc-800 rounded-xl p-2 max-h-28 overflow-auto whitespace-pre-wrap break-all">
                  {JSON.stringify(lastResponse, null, 2)}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default McpPanel;
