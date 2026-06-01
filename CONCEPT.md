
# Concept Aurora-Mind

Aurora-Mind est une application web de "tableau de visualisation mentale" moderne, minimaliste et animée, conçue pour aider à organiser, explorer et manipuler des idées, tâches ou inspirations sous forme de cartes connectées.

## Objectif

- Offrir un espace visuel pour créer, relier et animer des "nodes" (idées, tâches, concepts) façon mindmap, mais avec une UX ultra-fluide, responsive et élégante.
- Mettre en avant l’animation (Framer Motion), la gestion d’état (Zustand), et la personnalisation (thème Aurora, dark/light, drag & drop, etc.).

## Fonctionnalités principales

- Création, édition, suppression de cartes/idées (nodes)
- Connexion visuelle entre les nodes (liens animés)
- Drag & drop des nodes sur le canvas
- Animation fluide des déplacements et transitions
- Mode clair/sombre Aurora
- Sauvegarde locale (localStorage)
- Responsive mobile/desktop

## Stack

- Vite + React + TypeScript
- Tailwind CSS (UI)
- Zustand (état global)
- Framer Motion (animations)

## Structure initiale

- src/
  - components/ (Node, NodeLink, Toolbar, ThemeToggle, etc.)
  - store/ (zustand store)
  - hooks/ (custom hooks)
  - utils/ (helpers)
  - App.tsx
  - main.tsx
  - index.css

## Roadmap

1. Canvas interactif et gestion des nodes (ajout, déplacement, suppression)
2. Connexions visuelles entre nodes
3. Animations Framer Motion
4. Thème Aurora (clair/sombre)
5. Sauvegarde locale
6. UI raffinée (Toolbar, modales, etc.)

---

Prochaine étape : création de la structure de dossiers et des premiers composants React.
