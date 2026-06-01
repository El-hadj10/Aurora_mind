
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { useLocalStorageMindMap } from "./hooks/useLocalStorageMindMap";
import { useMcpAutoInit }         from "./hooks/useMcpAutoInit";
import { useMindMapStore }        from "./store/mindmap";
import type { NodeColor }         from "./store/mindmap";

import Node      from "./components/Node";
import NodeLink  from "./components/NodeLink";
import Toolbar   from "./components/Toolbar";
import McpPanel  from "./components/McpPanel";
import { getLinkCoords } from "./utils/coords";

// ─── Couleurs cycliques pour les nouveaux nœuds ───────────────────────────────
const COLORS: NodeColor[] = ["purple", "blue", "green", "rose", "amber", "cyan"];
let colorIdx = 0;

// ─── App ──────────────────────────────────────────────────────────────────────
const App: React.FC = () => {
  useLocalStorageMindMap();
  useMcpAutoInit();

  const {
    nodes, links,
    addNode, moveNode, removeNode, editNode,
    addLink,
    selectedNodeId, setSelectedNode,
    toolMode, setToolMode,
    isDark,
    undo,
  } = useMindMapStore();

  // Source pour le mode "connect"
  const [connectSource, setConnectSource] = useState<string | null>(null);

  // ── Sync thème → document ────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  // ── Raccourcis clavier ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (!isInput) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (selectedNodeId) { removeNode(selectedNodeId); setSelectedNode(null); }
        }
        if (e.key === "v" || e.key === "V") setToolMode("select");
        if (e.key === "c" || e.key === "C") setToolMode("connect");
        if (e.key === "d" || e.key === "D") setToolMode("delete");
        if (e.key === "a" || e.key === "A") spawnNode();
      }

      if (e.key === "Escape") {
        setConnectSource(null);
        setSelectedNode(null);
        if (toolMode !== "select") setToolMode("select");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // spawnNode est stable via useCallback (ref ci-dessous)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNodeId, toolMode]);

  // ── Spawn nœud aléatoire ─────────────────────────────────────────────────
  const spawnNode = useCallback(() => {
    const margin = 170;
    const id     = Math.random().toString(36).slice(2, 9);
    const x      = margin + Math.random() * (window.innerWidth  - 2 * margin);
    const y      = margin + Math.random() * (window.innerHeight - 2 * margin);
    const color  = COLORS[colorIdx % COLORS.length];
    colorIdx++;
    addNode({ id, label: "Nouvelle idée", x, y, color });
  }, [addNode]);

  // ── Gestion du clic sur un nœud ─────────────────────────────────────────
  const handleNodeClick = useCallback((id: string) => {
    if (toolMode === "delete") {
      removeNode(id);
      return;
    }
    if (toolMode === "connect") {
      if (!connectSource) {
        setConnectSource(id);
      } else if (connectSource !== id) {
        addLink(connectSource, id);
        setConnectSource(null);
        setToolMode("select"); // retour auto en mode select après connexion
      } else {
        setConnectSource(null); // dé-sélection de la source
      }
      return;
    }
    // mode select
    setSelectedNode(id === selectedNodeId ? null : id);
  }, [toolMode, connectSource, addLink, removeNode, setSelectedNode, selectedNodeId, setToolMode]);

  // ── Clic sur le canvas vide ──────────────────────────────────────────────
  const handleCanvasClick = useCallback(() => {
    setSelectedNode(null);
    setConnectSource(null);
  }, [setSelectedNode]);

  // ── Curseur global selon le mode ─────────────────────────────────────────
  const canvasCursor =
    toolMode === "connect" ? "crosshair" :
    toolMode === "delete"  ? "not-allowed" :
    "default";

  return (
    <main
      className="relative w-full h-screen overflow-hidden"
      style={{ cursor: canvasCursor }}
      onClick={handleCanvasClick}
    >
      {/* ── Fond Aurora animé ───────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 -z-10 animate-aurora"
        style={{
          background: isDark
            ? "linear-gradient(135deg, #18181b 0%, #27272a 40%, #3b0764 70%, #18181b 100%)"
            : "linear-gradient(135deg, #e9d5ff 0%, #c7d2fe 40%, #fce7f3 70%, #e9d5ff 100%)",
        }}
      />

      {/* ── Liens ──────────────────────────────────────────────────────────── */}
      {links.map((link, i) => {
        const coords = getLinkCoords(nodes, link);
        return coords ? (
          <NodeLink key={`${link.from}-${link.to}-${i}`} from={coords.from} to={coords.to} />
        ) : null;
      })}

      {/* ── Nœuds ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {nodes.map((node) => (
          <Node
            key={node.id}
            {...node}
            onDrag={(x, y) => moveNode(node.id, x, y)}
            onDelete={removeNode}
            onEdit={editNode}
            onClick={handleNodeClick}
            isSelected={node.id === selectedNodeId}
            isConnectSource={node.id === connectSource}
            toolMode={toolMode}
          />
        ))}
      </AnimatePresence>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <Toolbar onAddNode={spawnNode} connectSource={connectSource} />

      {/* ── Panel MCP (collapsible) ─────────────────────────────────────────── */}
      <McpPanel />
    </main>
  );
};

export default App;

