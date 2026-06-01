import { useEffect } from 'react';
import { useMindMapStore } from '../store/mindmap';

export function useLocalStorageMindMap() {
  const nodes    = useMindMapStore((s) => s.nodes);
  const links    = useMindMapStore((s) => s.links);
  const isDark   = useMindMapStore((s) => s.isDark);
  const setNodes = useMindMapStore((s) => s.setNodes);
  const setLinks = useMindMapStore((s) => s.setLinks);

  // Charger au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('aurora-mindmap');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { nodes?: unknown; links?: unknown };
        setNodes((parsed.nodes as typeof nodes) ?? []);
        setLinks((parsed.links as typeof links) ?? []);
      } catch { /* données corrompues, on ignore */ }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persister avec debounce pour ne pas bloquer les animations de drag
  useEffect(() => {
    const tid = setTimeout(() => {
      localStorage.setItem('aurora-mindmap', JSON.stringify({ nodes, links }));
    }, 800);
    return () => clearTimeout(tid);
  }, [nodes, links]);

  // Persister le thème immédiatement
  useEffect(() => {
    localStorage.setItem('aurora-theme', isDark ? 'dark' : 'light');
  }, [isDark]);
}
