# Pharmacy Stock Management App

Application de gestion de stock pharmaceutique avec intégration mobile.

## 🏥 Fonctionnalités

- **Gestion du stock** : Ajout, modification, suppression de médicaments et lots
- **Alertes intelligentes** : Stock bas et péremption proche
- **Gestion des ventes** : Historique complet avec synchronisation mobile
- **Commandes fournisseurs** : Suivi des commandes et livraisons
- **Dashboard** : Statistiques en temps réel

## 🚀 Technologies

- **Frontend** : React + TypeScript + Vite
- **Backend** : Node.js + Express + TypeORM
- **Base de données** : MySQL
- **Mobile** : Intégration API (développé par une autre équipe)
- **Déploiement** : Docker

## 📁 Structure du Projet

```
pharmaApp/
├── Pharmacy_Stock_Management_App/  # Frontend React
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   └── types/
│   └── package.json
├── backend/                        # Backend Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── entities/
│   │   ├── routes/
│   │   └── config/
│   └── package.json
├── pharmacy_mobile/                # Application mobile (externe)
└── docker-compose.yml              # Configuration Docker
```

## 🔧 Installation

### Prérequis
- Node.js 16+
- MySQL 8.0+
- Docker (optionnel)

### Développement Local

1. **Cloner le dépôt**
```bash
git clone [URL_DU_DEPOT]
cd pharmaApp
```

2. **Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement
npm run dev
```

3. **Frontend**
```bash
cd ../Pharmacy_Stock_Management_App
npm install
npm run dev
```

### Avec Docker
```bash
docker-compose up --build
```

## 🔐 Comptes de Test

- **Administrateur** : admin / admin@123

## 📱 Intégration Mobile

L'application web peut synchroniser les ventes avec l'application mobile via l'API :
- Endpoint : `POST /api/sales/sync`
- Bouton "Sync Mobile" dans la section Ventes

## 🐳 Déploiement Docker

```bash
# Construction des images
docker-compose build

# Démarrage des services
docker-compose up -d

# Arrêt des services
docker-compose down
```

## 🛠️ Développement

### Scripts Disponibles

**Backend :**
- `npm run dev` - Mode développement avec hot-reload
- `npm run build` - Compilation TypeScript
- `npm start` - Démarrage en production

**Frontend :**
- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build

## 🤝 Contribution

1. Fork du dépôt
2. Création d'une branche feature
3. Commit des changements
4. Pull Request

## 📄 License

MIT License

## 📞 Support

Pour toute question technique, contacter l'équipe de développement.
