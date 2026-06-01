#!/bin/bash
# Suppression complète de Free Claude Code et de toutes traces locales

set -e

# Dossiers et fichiers principaux
rm -rf ~/Bureau/aurora-mind/free-claude-code
rm -rf ~/.fcc
rm -rf ~/.claude
rm -f ~/Bureau/aurora-mind/test_openrouter.py

# Extensions VS Code
rm -rf ~/.vscode/extensions/anthropic.claude-code-2.1.145-linux-x64

# Nettoyage éventuel dans node_modules
rm -rf ~/Bureau/aurora-mind/node_modules/

# Suppression éventuelle de .env
rm -f ~/Bureau/aurora-mind/free-claude-code/.env
rm -f ~/Bureau/aurora-mind/.env

# Nettoyage VS Code config
rm -rf ~/.config/Code/User/globalStorage/anthropic.claude-code*

# Message de fin
echo "Toutes les traces de Free Claude Code ont été supprimées."
