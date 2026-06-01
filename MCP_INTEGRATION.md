# Aurora-Mind — Intégration MCP (Model Context Protocol)

## Architecture actuelle

- **Frontend React** :
  - Mindmap moderne, autonome, UI/UX avancée (Zustand, Framer Motion, persistance locale).
  - Panneau de test MCP intégré (envoi de requêtes JSON au relay backend, réponse affichée en direct).
  - Communication WebSocket avec le relay MCP backend (ws://localhost:3031).

- **Backend Node.js (mcp-service/ws-relay.js)** :
  - Relay WebSocket MCP : reçoit les requêtes du front, les route vers les serveurs MCP locaux (via SDK MCP).
  - Serveurs MCP configurés :
    - github-server (fonctionnel)
    - chrome-devtools-relay (non publié sur npm, échec)
    - vscode-server (non publié sur npm, échec)
    - mongodb-server (non publié sur npm, échec)
  - Routage prioritaire sur github-server (tous les outils GitHub accessibles).

## Utilisation du panneau de test MCP (front)

- Exemple de payload pour GitHub MCP (recherche de repo) :

```json
{
  "type": "callTool",
  "tool": "search_repositories",
  "args": { "query": "aurora-mind" }
}
```

- Réponse attendue :
  - `{ "ok": true, "result": ... }` si succès
  - `{ "error": ... }` si échec

## Limitations actuelles

- Seul le serveur GitHub MCP fonctionne (les autres serveurs ne sont pas publiés sur npm, erreur 404).
- Le relay WebSocket est prêt à router vers d’autres serveurs dès qu’ils sont disponibles.
- Le transport MCP stdio fonctionne via un chemin d’import explicite (voir ws-relay.js).

## Pour ajouter un serveur MCP custom/local

1. Ajouter la config dans `MCP_SERVERS` dans `mcp-service/ws-relay.js`.
2. S’assurer que le package est installé/localement accessible.
3. Relancer le relay MCP.

## Dépannage

- Si erreur `Cannot find module .../client/stdio` :
  - Vérifier le chemin d’import dans ws-relay.js (utiliser le chemin absolu vers node_modules global du projet).
- Si erreur 404 npm :
  - Le package MCP serveur n’est pas publié sur npm (utiliser un serveur local ou custom).

## Statut

- Front autonome, relay MCP vivant, routage GitHub MCP fonctionnel.
- Prêt pour extension vers d’autres serveurs MCP dès publication/disponibilité.

---

*Documenté automatiquement par GitHub Copilot (GPT-4.1), 24/05/2026.*
