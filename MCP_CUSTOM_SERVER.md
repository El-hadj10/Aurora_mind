# Intégration d’un serveur MCP custom/local (exemple Chrome DevTools)

## 1. Pré-requis
- Disposer du code source du serveur MCP (ex : `server-chrome-devtools`) sous forme de dossier local ou package privé.
- Node.js ≥ 18 installé.

## 2. Placement du serveur
- Place le dossier du serveur MCP dans `mcp-service/servers/` (ex : `mcp-service/servers/server-chrome-devtools/`).
- Vérifie la présence d’un `package.json` et d’un point d’entrée (ex : `index.js`).

## 3. Configuration du relay MCP
Dans `mcp-service/ws-relay.js`, modifie la config du serveur MCP pour pointer sur le chemin local :

```js
const MCP_SERVERS = [
  {
    name: 'chrome-devtools-relay',
    command: 'node',
    args: ['servers/server-chrome-devtools/index.js'],
    // Optionnel : variables d’environnement
    env: {}
  },
  // ... autres serveurs
];
```

- Le relay lancera alors le serveur local via Node.js (pas besoin de npm install).

## 4. Lancement

```bash
cd mcp-service
node ws-relay.js
```

- Vérifie dans la console : `[MCP] Connecté à chrome-devtools-relay`

## 5. Test depuis le front
- Utilise le panneau de test MCP avec un payload du type :

```json
{
  "type": "callTool",
  "tool": "<nom_de_l_outil>",
  "args": { ... }
}
```

- La réponse du serveur local sera routée et affichée dans l’UI.

## 6. Dépannage
- Si le serveur ne démarre pas :
  - Vérifie le chemin, les droits d’exécution, la présence d’un point d’entrée Node.js.
  - Regarde les logs relay côté backend.
- Si le front ne reçoit rien :
  - Vérifie la connexion WebSocket (bulle verte dans l’UI), les logs relay, et le format du payload.

---

*Exemple prêt à l’emploi pour brancher n’importe quel serveur MCP local, documenté par GitHub Copilot, 24/05/2026.*
