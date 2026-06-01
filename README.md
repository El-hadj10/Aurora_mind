<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=7c3aed,a855f7,ec4899&height=200&section=header&text=Aurora%20Mind&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Mind%20mapping%20visuel%20×%20IA%20×%20MCP&descAlignY=60&descColor=e9d5ff" width="100%"/>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&pause=1000&color=A855F7&center=true&vCenter=true&width=600&lines=Cartographiez+vos+idées+en+temps+réel;Mode+sombre+Aurora+%2B+gradients+animés;Connexion+MCP+%2F+GitHub+intégrée;React+19+%2B+TypeScript+%2B+Tailwind+v4" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
  <img src="https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white"/>
  <img src="https://img.shields.io/badge/Zustand-5-brown?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/MCP_SDK-1.29-7c3aed?style=for-the-badge"/>
</p>

---

## ✦ Présentation

**Aurora Mind** est une application de mind mapping visuel conçue pour cartographier des idées avec fluidité et élégance.  
Chaque nœud est un point de lumière — chaque lien, un flux d'énergie.

> *"Lumière sur les idées. Ordre dans le chaos."*

---

## ⚡ Fonctionnalités

| Catégorie | Détail |
|-----------|--------|
| 🎨 **Canvas Aurora** | Fond animé dégradé violet→indigo→rose, mode sombre natif |
| 🧩 **Nœuds colorés** | 6 palettes (purple, blue, green, rose, amber, cyan), double-clic pour éditer |
| 🔗 **Connexions animées** | Courbe bézier + gradient + particule de flux en temps réel |
| 🛠️ **Toolbar Figma-style** | Modes Select / Connect / Delete, undo, toggle thème, clear all |
| ⌨️ **Raccourcis clavier** | `V` `C` `D` `A` `Escape` `Ctrl+Z` `Delete` |
| 💾 **Persistance locale** | LocalStorage avec debounce 800ms, thème mémorisé |
| 🤖 **MCP intégré** | Relay WebSocket vers serveurs MCP (GitHub, etc.), panel collapsible |
| ↩️ **Historique / Undo** | Stack de 30 snapshots, `Ctrl+Z` |

---

## 🏗️ Architecture

```
aurora-mind/
├── src/
│   ├── App.tsx                  # Orchestrateur principal, canvas, raccourcis
│   ├── components/
│   │   ├── Node.tsx             # Nœud draggable, coloré, éditable
│   │   ├── NodeLink.tsx         # Lien SVG bézier animé
│   │   ├── Toolbar.tsx          # Toolbar flottante (Figma-style)
│   │   └── McpPanel.tsx         # Panel MCP collapsible
│   ├── store/
│   │   └── mindmap.ts           # Store Zustand (nodes, links, history, theme)
│   ├── hooks/
│   │   ├── useLocalStorageMindMap.ts
│   │   ├── useMcpAutoInit.ts
│   │   └── useMcpWebSocket.ts
│   └── utils/
│       └── coords.ts            # Calcul coordonnées centre des nœuds
├── mcpManager.ts                # Store Zustand MCP + WebSocket relay client
└── mcp-service/
    └── ws-relay.js              # Relay WebSocket → serveurs MCP
```

---

## 🚀 Lancement rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
# → http://localhost:5173

# (Optionnel) Démarrer le relay MCP
cd mcp-service && node ws-relay.js
```

---

## 🤖 Intégration MCP

Aurora Mind se connecte à un relay WebSocket MCP sur `ws://localhost:3031`.  
Le relay peut proxifier n'importe quel serveur MCP (GitHub, filesystem, custom…).

```bash
# Démarrer le relay
cd mcp-service
node ws-relay.js

# Tester la connexion
node test-mcp.js
```

---

## 🛠️ Stack technique

| Outil | Version | Usage |
|-------|---------|-------|
| React | 19 | UI composants |
| TypeScript | 5 | Typage strict |
| Tailwind CSS | v4 | Styles utilitaires |
| Vite | 8 | Bundler + HMR |
| Framer Motion | 12 | Animations drag/drop |
| Zustand | 5 | État global |
| MCP SDK | 1.29 | Protocole IA |
| Zod | 4 | Validation schémas |

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=7c3aed,a855f7,ec4899&height=100&section=footer" width="100%"/>
</p>

<p align="center">
  Fait avec 🔮 par <a href="https://github.com/El-hadj10">El-hadj Ousmane</a>
</p>


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

# Intégration MCP (Model Context Protocol)

Voir le fichier [MCP_INTEGRATION.md](MCP_INTEGRATION.md) pour la documentation complète sur l’architecture, le routage, les exemples de payloads, les limitations et la procédure d’extension MCP.

- Frontend React autonome (mindmap, panneau de test MCP, WebSocket)
- Backend Node.js relay MCP (ws-relay.js) prêt pour le routage réel
- Serveur GitHub MCP fonctionnel (autres serveurs à venir)

*Documenté automatiquement par GitHub Copilot, 24/05/2026.*
