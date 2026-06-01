import React, { useState } from "react";
import { motion } from "framer-motion";
import { type NodeColor, type ToolMode, useMindMapStore } from "../store/mindmap";

// ─── Palette de couleurs ──────────────────────────────────────────────────────
const COLOR_STYLES: Record<NodeColor, { bg: string; border: string; text: string; ring: string; dot: string }> = {
  purple: {
    bg:     "bg-purple-50/90 dark:bg-purple-950/60",
    border: "border-purple-300 dark:border-purple-600",
    text:   "text-purple-900 dark:text-purple-200",
    ring:   "ring-purple-500",
    dot:    "bg-purple-400",
  },
  blue: {
    bg:     "bg-blue-50/90 dark:bg-blue-950/60",
    border: "border-blue-300 dark:border-blue-600",
    text:   "text-blue-900 dark:text-blue-200",
    ring:   "ring-blue-500",
    dot:    "bg-blue-400",
  },
  green: {
    bg:     "bg-emerald-50/90 dark:bg-emerald-950/60",
    border: "border-emerald-300 dark:border-emerald-600",
    text:   "text-emerald-900 dark:text-emerald-200",
    ring:   "ring-emerald-500",
    dot:    "bg-emerald-400",
  },
  rose: {
    bg:     "bg-rose-50/90 dark:bg-rose-950/60",
    border: "border-rose-300 dark:border-rose-600",
    text:   "text-rose-900 dark:text-rose-200",
    ring:   "ring-rose-500",
    dot:    "bg-rose-400",
  },
  amber: {
    bg:     "bg-amber-50/90 dark:bg-amber-950/60",
    border: "border-amber-300 dark:border-amber-600",
    text:   "text-amber-900 dark:text-amber-200",
    ring:   "ring-amber-500",
    dot:    "bg-amber-400",
  },
  cyan: {
    bg:     "bg-cyan-50/90 dark:bg-cyan-950/60",
    border: "border-cyan-300 dark:border-cyan-600",
    text:   "text-cyan-900 dark:text-cyan-200",
    ring:   "ring-cyan-500",
    dot:    "bg-cyan-400",
  },
};

const COLOR_ORDER: NodeColor[] = ["purple", "blue", "green", "rose", "amber", "cyan"];

// ─── Props ────────────────────────────────────────────────────────────────────
export interface NodeProps {
  id: string;
  label: string;
  x: number;
  y: number;
  color: NodeColor;
  onDrag?:           (x: number, y: number) => void;
  onEdit?:           (id: string, label: string) => void;
  onDelete?:         (id: string) => void;
  onClick?:          (id: string) => void;
  isSelected?:       boolean;
  isConnectSource?:  boolean;
  toolMode?:         ToolMode;
}

// ─── Composant ────────────────────────────────────────────────────────────────
export const Node: React.FC<NodeProps> = ({
  id, label, x, y, color,
  onDrag, onEdit, onDelete, onClick,
  isSelected, isConnectSource, toolMode,
}) => {
  const [hover,     setHover]     = useState(false);
  const [editing,   setEditing]   = useState(false);
  const [editValue, setEditValue] = useState(label);
  const [showPalette, setShowPalette] = useState(false);
  const setNodeColor = useMindMapStore((s) => s.setNodeColor);

  const c = COLOR_STYLES[color ?? "purple"];

  const handleDragEnd = (_e: unknown, info: { offset: { x: number; y: number } }) => {
    if (onDrag) onDrag(x + info.offset.x, y + info.offset.y);
  };

  const handleCommitEdit = () => {
    setEditing(false);
    if (onEdit && editValue.trim()) onEdit(id, editValue.trim());
    else setEditValue(label); // rollback si vide
  };

  const cursor =
    toolMode === "connect" ? "cursor-crosshair" :
    toolMode === "delete"  ? "cursor-not-allowed" :
    "cursor-move";

  return (
    <motion.div
      className={[
        "absolute flex flex-col items-center justify-center",
        "rounded-2xl shadow-xl border backdrop-blur-md select-none",
        "px-5 py-3 min-w-[120px] min-h-[52px]",
        "transition-shadow duration-150",
        c.bg, c.border, cursor,
        isSelected       ? `ring-2 ${c.ring} shadow-2xl`         : "",
        isConnectSource  ? "ring-2 ring-purple-500 animate-connect-pulse" : "",
      ].join(" ")}
      style={{ left: x, top: y }}
      drag={toolMode === "select" || toolMode === undefined}
      dragMomentum={false}
      dragElastic={0.08}
      onDragEnd={handleDragEnd}
      layoutId={id}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1,   opacity: 1 }}
      exit={{    scale: 0.5, opacity: 0 }}
      whileHover={{ scale: toolMode === "select" || !toolMode ? 1.04 : 1 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setShowPalette(false); }}
      tabIndex={0}
      onDoubleClick={() => { if (toolMode === "select" || !toolMode) setEditing(true); }}
      onClick={(e) => { e.stopPropagation(); onClick?.(id); }}
    >
      {/* ── Label ─────────────────────────────────────────────────────────── */}
      {editing ? (
        <input
          className={`bg-transparent border-b-2 outline-none text-center text-base font-semibold w-full ${c.border} ${c.text}`}
          value={editValue}
          autoFocus
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleCommitEdit}
          onKeyDown={(e) => { if (e.key === "Enter") handleCommitEdit(); if (e.key === "Escape") { setEditing(false); setEditValue(label); } }}
        />
      ) : (
        <span className={`text-base font-semibold text-center leading-tight drop-shadow-sm ${c.text}`}>
          {label}
        </span>
      )}

      {/* ── Actions (visible au hover) ─────────────────────────────────────── */}
      {hover && !editing && (
        <>
          {/* Supprimer */}
          {onDelete && toolMode !== "connect" && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-3 -right-3 w-6 h-6 rounded-full
                bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600
                flex items-center justify-center shadow
                hover:bg-rose-100 dark:hover:bg-rose-900/50 transition"
              title="Supprimer"
              onClick={(e) => { e.stopPropagation(); onDelete(id); }}
              type="button"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M2 2l8 8M10 2l-8 8" className="text-zinc-500"/>
              </svg>
            </motion.button>
          )}

          {/* Palette de couleurs */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-3 -left-3 w-6 h-6 rounded-full
              bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600
              flex items-center justify-center shadow hover:scale-110 transition"
            title="Couleur"
            onClick={(e) => { e.stopPropagation(); setShowPalette((v) => !v); }}
            type="button"
          >
            <span className={`w-3 h-3 rounded-full ${c.dot}`} />
          </motion.button>
        </>
      )}

      {/* ── Palette dropdown ──────────────────────────────────────────────── */}
      {showPalette && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -left-1 top-full mt-2 z-50
            bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700
            rounded-xl shadow-xl p-2 flex gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {COLOR_ORDER.map((col) => (
            <button
              key={col}
              type="button"
              title={col}
              onClick={() => { setNodeColor(id, col); setShowPalette(false); }}
              className={[
                "w-5 h-5 rounded-full border-2 transition hover:scale-125",
                color === col ? "border-zinc-700 dark:border-zinc-200" : "border-transparent",
                COLOR_STYLES[col].dot,
              ].join(" ")}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Node;

