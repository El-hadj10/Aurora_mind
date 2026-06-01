import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────
export type NodeColor = 'purple' | 'blue' | 'green' | 'rose' | 'amber' | 'cyan';
export type ToolMode  = 'select' | 'connect' | 'delete';

export type MindNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  color: NodeColor;
};

export type NodeLink = {
  from: string;
  to: string;
};

type Snapshot = { nodes: MindNode[]; links: NodeLink[] };

// ─── State ────────────────────────────────────────────────────────────────────
interface MindMapState {
  nodes: MindNode[];
  links: NodeLink[];
  selectedNodeId: string | null;
  toolMode: ToolMode;
  isDark: boolean;
  history: Snapshot[];

  // Node CRUD
  addNode:    (node: MindNode) => void;
  removeNode: (id: string)     => void;
  moveNode:   (id: string, x: number, y: number) => void;
  editNode:   (id: string, label: string)         => void;
  setNodeColor: (id: string, color: NodeColor)    => void;

  // Link CRUD
  addLink:    (from: string, to: string)  => void;
  removeLink: (from: string, to: string)  => void;

  // Bulk
  setNodes:   (nodes: MindNode[])         => void;
  setLinks:   (links: NodeLink[])         => void;
  clearAll:   ()                          => void;

  // UI state
  setSelectedNode: (id: string | null)    => void;
  setToolMode:     (mode: ToolMode)       => void;
  toggleTheme:     ()                     => void;

  // Undo
  undo: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MAX_HISTORY = 30;

function pushHistory(state: MindMapState): Snapshot[] {
  const snap: Snapshot = {
    nodes: state.nodes.map((n) => ({ ...n })),
    links: state.links.map((l) => ({ ...l })),
  };
  return [...state.history, snap].slice(-MAX_HISTORY);
}

// ─── Store ────────────────────────────────────────────────────────────────────
export const useMindMapStore = create<MindMapState>((set) => ({
  nodes:          [],
  links:          [],
  selectedNodeId: null,
  toolMode:       'select',
  isDark:         window.matchMedia('(prefers-color-scheme: dark)').matches,
  history:        [],

  // ── Node CRUD ──────────────────────────────────────────────────────────────
  addNode: (node) => set((s) => ({
    history: pushHistory(s),
    nodes:   [...s.nodes, node],
  })),

  removeNode: (id) => set((s) => ({
    history: pushHistory(s),
    nodes:   s.nodes.filter((n) => n.id !== id),
    links:   s.links.filter((l) => l.from !== id && l.to !== id),
    selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
  })),

  moveNode: (id, x, y) => set((s) => ({
    nodes: s.nodes.map((n) => n.id === id ? { ...n, x, y } : n),
  })),

  editNode: (id, label) => set((s) => ({
    history: pushHistory(s),
    nodes:   s.nodes.map((n) => n.id === id ? { ...n, label } : n),
  })),

  setNodeColor: (id, color) => set((s) => ({
    history: pushHistory(s),
    nodes:   s.nodes.map((n) => n.id === id ? { ...n, color } : n),
  })),

  // ── Link CRUD ──────────────────────────────────────────────────────────────
  addLink: (from, to) => set((s) => {
    const exists = s.links.some((l) =>
      (l.from === from && l.to === to) || (l.from === to && l.to === from)
    );
    if (exists) return {};
    return { history: pushHistory(s), links: [...s.links, { from, to }] };
  }),

  removeLink: (from, to) => set((s) => ({
    history: pushHistory(s),
    links:   s.links.filter((l) => !(l.from === from && l.to === to)),
  })),

  // ── Bulk ───────────────────────────────────────────────────────────────────
  setNodes: (nodes) => set(() => ({ nodes })),
  setLinks: (links) => set(() => ({ links })),

  clearAll: () => set((s) => ({
    history:        pushHistory(s),
    nodes:          [],
    links:          [],
    selectedNodeId: null,
  })),

  // ── UI state ───────────────────────────────────────────────────────────────
  setSelectedNode: (id) => set(() => ({ selectedNodeId: id })),

  setToolMode: (mode) => set(() => ({
    toolMode:       mode,
    selectedNodeId: null,
  })),

  toggleTheme: () => set((s) => ({ isDark: !s.isDark })),

  // ── Undo ───────────────────────────────────────────────────────────────────
  undo: () => set((s) => {
    if (s.history.length === 0) return {};
    const prev = s.history[s.history.length - 1];
    return {
      nodes:   prev.nodes,
      links:   prev.links,
      history: s.history.slice(0, -1),
      selectedNodeId: null,
    };
  }),
}));
