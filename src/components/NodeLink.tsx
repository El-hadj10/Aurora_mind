import React, { useId } from "react";
import { motion } from "framer-motion";

export interface NodeLinkProps {
  from: { x: number; y: number };
  to:   { x: number; y: number };
}

export const NodeLink: React.FC<NodeLinkProps> = ({ from, to }) => {
  const uid = useId().replace(/:/g, "");

  const gradId  = `grad-${uid}`;
  const glowId  = `glow-${uid}`;
  const maskId  = `mask-${uid}`;

  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2 - 50;
  const path = `M${from.x},${from.y} Q${mx},${my} ${to.x},${to.y}`;

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Gradient aurora */}
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="45%"  stopColor="#f472b6" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>

        {/* Halo flou */}
        <filter id={glowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Dash flow mask */}
        <mask id={maskId}>
          <motion.path
            d={path}
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeDasharray="8 6"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
          />
        </mask>
      </defs>

      {/* Halo extérieur */}
      <motion.path
        d={path}
        stroke="#c084fc"
        strokeWidth={12}
        fill="none"
        opacity={0.12}
        filter={`url(#${glowId})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Ligne principale avec gradient */}
      <motion.path
        d={path}
        stroke={`url(#${gradId})`}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Particule de flux animée */}
      <circle r="4" fill="#f472b6" opacity={0.7}>
        <animateMotion dur="2s" repeatCount="indefinite" path={path} />
      </circle>
    </svg>
  );
};

export default NodeLink;

