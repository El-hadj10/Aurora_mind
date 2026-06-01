import type { MindNode, NodeLink } from "../store/mindmap";

/** Centre estimé d'un nœud (mi-hauteur/largeur approx) */
export function getNodeCenter(node: MindNode) {
  return { x: node.x + 65, y: node.y + 30 };
}

export function getLinkCoords(nodes: MindNode[], link: NodeLink) {
  const from = nodes.find((n) => n.id === link.from);
  const to   = nodes.find((n) => n.id === link.to);
  if (!from || !to) return null;
  return { from: getNodeCenter(from), to: getNodeCenter(to) };
}
