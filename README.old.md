# NASA Image Explorer

Application web progressive (PWA) permettant d'explorer les images et données de la NASA.

## Technologies utilisées

- React.js avec TypeScript
- Three.js pour la visualisation 3D
- API NASA
- PWA pour une expérience mobile optimale

## Fonctionnalités principales

- Exploration des images NASA
- Visualisation 3D des corps célestes
- Mode hors ligne
- Interface responsive
- Système de favoris
- Téléchargement d'images HD

## Installation

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm start

# Construction pour la production
npm run build
```

## Structure du projet

```
nasa-image/
├── src/
│   ├── components/     # Composants React
│   ├── services/      # Services (API, etc.)
│   ├── hooks/         # Custom hooks
│   ├── models/        # Types et interfaces
│   └── assets/        # Images, styles, etc.
├── public/
└── package.json
```

## Configuration requise

- Node.js >= 14.0.0
- npm >= 6.14.0
- Navigateur moderne avec support WebGL

## Développement

1. Cloner le repository
2. Installer les dépendances avec `npm install`
3. Créer un fichier `.env` avec votre clé API NASA
4. Lancer le serveur de développement avec `npm start`
