# Configuration du token GitHub pour MCP

Pour activer le serveur GitHub MCP avec ton token personnel :

1. **Créer un fichier `.env` dans le dossier `mcp-service/`**

```
GITHUB_PERSONAL_ACCESS_TOKEN=ton_token_github_ici
```

2. **Ou exporter la variable dans ton shell avant de lancer le relay**

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=ton_token_github_ici
node ws-relay.js
```

3. **Redémarre le relay MCP**

Le token sera automatiquement injecté côté backend pour toutes les requêtes GitHub MCP.

---

*Ne partage jamais ce token publiquement. Il doit avoir les scopes nécessaires (repo, read:org, etc.) selon tes besoins.*
