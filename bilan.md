# BILAN DU PROJET : AURORA MIND (CARTOGRAPHIE MENTALE & RELAY MCP)

---

## 1. Vue d'Ensemble & Architecture
Le projet **aurora-mind** est une application web moderne de cartographie mentale interactive (Mind Mapping). L’architecture repose sur un écosystème performant et typé :
- **Framework & Build :** React, Vite, TypeScript.
- **Gestion d'État :** Zustand (centralisation des nœuds, des liens et de la logique métier).
- **Interface Graphique :** Tailwind CSS (animations fluides d'arrière-plan type aurore boréale).
- **Animation & Drag :** Framer Motion (gestion dynamique des déplacements de nœuds).
- **Connectivité IA :** Protocole MCP (*Model Context Protocol*) via un client WebSocket personnalisé (`useMcpWebSocket`), permettant d'interroger à la volée des serveurs d'outils (comme `github-server`).

---

## 2. Analyse Globale des Fichiers Source

### A. Fichiers Applicatifs Directs (Code Source)
1. **`App.tsx` & `main.tsx` :** Point d'entrée de l'application. `App.tsx` assemble l'interface utilisateur, intègre les hooks de persistance, gère le panneau de debug du Relay MCP et effectue le rendu du canvas.
2. **`store/mindmap.ts` :** Store Zustand robuste gérant l'état atomique des nœuds (`Node`) et des liaisons (`NodeLink`) avec fonctions d'édition, de déplacement et de suppression.
3. **`components/Node.tsx` :** Composant gérant le cycle de vie visuel d'une idée (affichage, double-clic pour renommer, survol pour suppression).
4. **`components/NodeLink.tsx` :** Composant SVG dynamique dessinant des courbes de Béziers quadratiques colorées par un dégradé Aurora entre les centres des nœuds connectés.
5. **`utils/coords.ts` :** Calculateur géométrique pur calculant les points d'ancrage exacts (`getNodeCenter`) pour relier les nœuds de manière fluide.
6. **`hooks/useLocalStorage.ts` :** Hook utilitaire synchronisant l'état du Mind Map avec le stockage local du navigateur.

### B. Contextes Externes Transmis (Dépendances Node / npm)
Le dossier comprend également des fichiers de dépendances de bas niveau. Ces fichiers servent exclusivement de contexte pour le moteur d'IA et ne doivent pas être édités :
- **`node-ignore` (v5.3.2) :** Utilitaire de parsing et de filtrage respectant les syntaxes des fichiers `.gitignore`.
- **`imurmurhash` :** Algorithme incrémental de hachage non cryptographique MurmurHash3 en 32-bit (optimisé pour la performance).
- **`ipaddr.js` & `inherits` :** Outils de manipulation d'adresses IP (IPv4/IPv6) et d'héritage de prototypes JavaScript.

---

## 3. Synthèse des Bugs Détectés & Actions de Nettoyage

Voici les quatre axes prioritaires identifiés pour stabiliser et parfaire l'application :

### 1. Correction des Coordonnées de Drag (`Node.tsx`)
- **Problème :** `onDragEnd` exploite actuellement `info.point.x` et `info.point.y`. Ces valeurs correspondent aux positions absolues de l'écran entier (viewport) et non du canvas parent, provoquant un saut ou la disparition du nœud au relâché.
- **Action :** Calculer la position relative corrigée via le delta (`info.offset`) pour garantir un positionnement stable.

### 2. Unification des Définitions SVG (`NodeLink.tsx`)
- **Problème :** Présence de deux balises `<defs>` distinctes dans le même SVG (l'une pour le dégradé linéaire dynamique, l'autre pour le filtre de flou `#aurora-halo`).
- **Action :** Fusionner les deux blocs dans une balise `<defs>` unique en tête de composant pour un code conforme aux standards SVG.

### 3. Nettoyage du Code Mort CSS (`App.css`)
- **Problème :** Présence de styles obsolètes du template par défaut de Vite (`.hero`, `.counter`, `#center`, etc.) inutilisés à cause de l'adoption de Tailwind CSS. Duplication des directives `@tailwind` avec `index.css`.
- **Action :** Vider les classes inutilisées de `App.css` et conserver uniquement la cinématique `@keyframes gradient-move` liée à l'ambiance Aurora.

### 4. Sécurisation du Payload MCP (`App.tsx`)
- **Problème :** L'action du bouton de test exécute un `JSON.parse(mcpPayload)` au sein d'un `try/catch` silencieux. Une erreur de syntaxe JSON de l'utilisateur bloque l'interface sans retour visuel.
- **Action :** Ajouter un état d'erreur graphique (ex: bordure rouge ou texte d'alerte) pour guider l'utilisateur en cas de JSON malformé.

---
*Bilan technique réalisé par votre assistant personnel IA pour Nour.*
