import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMindMapStore, type ToolMode } from "../store/mindmap";

// ─── Icônes SVG inline ────────────────────────────────────────────────────────
const IconSelect = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3l14 9-7 1-3 7z"/>
  </svg>
);
const IconConnect = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="6" cy="6"   r="3"/>
    <circle cx="18" cy="18" r="3"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);
const IconDelete = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const IconUndo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 7v6h6"/>
    <path d="M3 13A9 9 0 1 0 5.7 6.7L3 7"/>
  </svg>
);
const IconSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1"  x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconClear = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <line x1="9"  y1="9"  x2="15" y2="15"/>
    <line x1="15" y1="9"  x2="9"  y2="15"/>
  </svg>
);
const IconAdd = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5"  y1="12" x2="19" y2="12"/>
  </svg>
);

// ─── Tooltip wrapper ──────────────────────────────────────────────────────────
const Tip: React.FC<{ label: string; shortcut?: string; children: React.ReactNode }> = ({ label, shortcut, children }) => (
  <div className="relative group">
    {children}
    <div className="toolbar-tooltip pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 opacity-0 group-hover:opacity-100 flex items-center gap-2 whitespace-nowrap">
      <div className="bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 text-xs font-medium px-2.5 py-1 rounded-lg shadow-xl">
        {label}
        {shortcut && <kbd className="ml-2 text-[10px] opacity-60">{shortcut}</kbd>}
      </div>
    </div>
  </div>
);

// ─── Tool button ──────────────────────────────────────────────────────────────
const ToolBtn: React.FC<{
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  shortcut?: string;
  children: React.ReactNode;
}> = ({ active, danger, disabled, onClick, title, shortcut, children }) => (
  <Tip label={title} shortcut={shortcut}>
    <motion.button
      whileTap={{ scale: 0.88 }}
      className={[
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-purple-400",
        active
          ? "bg-purple-500 text-white shadow-lg shadow-purple-500/40"
          : danger
          ? "text-rose-400 hover:bg-rose-500/10"
          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200/80 dark:hover:bg-zinc-700/80",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
      onClick={disabled ? undefined : onClick}
      tabIndex={0}
      type="button"
    >
      {children}
    </motion.button>
  </Tip>
);

// ─── Props ────────────────────────────────────────────────────────────────────
interface ToolbarProps {
  onAddNode:     () => void;
  connectSource: string | null;
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────
export const Toolbar: React.FC<ToolbarProps> = ({ onAddNode, connectSource }) => {
  const { toolMode, setToolMode, isDark, toggleTheme, undo, clearAll, nodes, history } = useMindMapStore();
  const [confirmClear, setConfirmClear] = React.useState(false);

  const handleClear = () => {
    if (confirmClear) { clearAll(); setConfirmClear(false); }
    else { setConfirmClear(true); setTimeout(() => setConfirmClear(false), 2500); }
  };

  const tools: { mode: ToolMode; Icon: React.FC; label: string; shortcut: string }[] = [
    { mode: "select",  Icon: IconSelect,  label: "Sélection",  shortcut: "V" },
    { mode: "connect", Icon: IconConnect, label: "Connecter",  shortcut: "C" },
    { mode: "delete",  Icon: IconDelete,  label: "Supprimer",  shortcut: "D" },
  ];

  return (
    <>
      {/* ── Barre verticale gauche ─────────────────────────────────────────── */}
      <motion.aside
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0,   opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 28, delay: 0.15 }}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-50
          bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl
          border border-zinc-200/60 dark:border-zinc-700/60
          rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40
          px-2 py-3 flex flex-col gap-1"
      >
        {/* ── Outils ── */}
        {tools.map(({ mode, Icon, label, shortcut }) => (
          <ToolBtn
            key={mode}
            active={toolMode === mode}
            onClick={() => setToolMode(mode)}
            title={label}
            shortcut={shortcut}
          >
            <Icon />
          </ToolBtn>
        ))}

        {/* ── Séparateur ── */}
        <div className="h-px bg-zinc-200 dark:bg-zinc-700 mx-1 my-1" />

        {/* ── Undo ── */}
        <ToolBtn
          disabled={history.length === 0}
          onClick={undo}
          title="Annuler"
          shortcut="Ctrl+Z"
        >
          <IconUndo />
        </ToolBtn>

        {/* ── Séparateur ── */}
        <div className="h-px bg-zinc-200 dark:bg-zinc-700 mx-1 my-1" />

        {/* ── Thème ── */}
        <ToolBtn onClick={toggleTheme} title={isDark ? "Mode clair" : "Mode sombre"}>
          {isDark ? <IconSun /> : <IconMoon />}
        </ToolBtn>

        {/* ── Clear all ── */}
        <Tip label={confirmClear ? "Cliquer à nouveau pour confirmer" : "Tout effacer"}>
          <motion.button
            whileTap={{ scale: 0.88 }}
            className={[
              "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150",
              confirmClear
                ? "bg-rose-500 text-white animate-pulse"
                : "text-rose-400 hover:bg-rose-500/10",
              nodes.length === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
            ].join(" ")}
            onClick={nodes.length > 0 ? handleClear : undefined}
            type="button"
          >
            <IconClear />
          </motion.button>
        </Tip>
      </motion.aside>

      {/* ── Indicateur de mode Connect ─────────────────────────────────────── */}
      <AnimatePresence>
        {toolMode === "connect" && (
          <motion.div
            key="connect-banner"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50
              bg-purple-600/90 backdrop-blur-md text-white text-sm font-medium
              px-5 py-2.5 rounded-full shadow-xl shadow-purple-600/30 pointer-events-none"
          >
            {connectSource
              ? "✓ Source sélectionnée — cliquez sur un autre nœud"
              : "Mode Connexion — cliquez sur un nœud source"}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB Ajouter ────────────────────────────────────────────────────── */}
      <Tip label="Ajouter un nœud" shortcut="A">
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          transition={{ type: "spring", stiffness: 350, damping: 22, delay: 0.25 }}
          className="fixed bottom-8 right-8 z-50
            w-16 h-16 rounded-2xl
            bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500
            text-white shadow-2xl shadow-purple-500/40
            flex items-center justify-center
            border-2 border-white/20"
          onClick={onAddNode}
          type="button"
        >
          <IconAdd />
        </motion.button>
      </Tip>

      {/* ── Compteur de nœuds ─────────────────────────────────────────────── */}
      <div className="fixed bottom-10 right-28 z-40 text-xs text-zinc-500 dark:text-zinc-400 font-mono select-none">
        {nodes.length} nœud{nodes.length !== 1 ? "s" : ""}
      </div>
    </>
  );
};

export default Toolbar;
