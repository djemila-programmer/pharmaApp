# 🚀 Guide de Déploiement Pharmacy App

## 📋 Prérequis

- Node.js 16+
- MySQL 8.0+
- Docker (optionnel)

## 🔧 Déploiement Local (Recommandé)

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd Pharmacy_Stock_Management_App
npm install
npm run dev
```

Application disponible sur: http://localhost:3000

## 🐳 Déploiement Docker (Quand Docker fonctionne)

### Méthode 1: Script automatique
```bash
# Windows
.\docker-deploy-alt.bat

# Linux/Mac
./docker-deploy-alt.sh
```

### Méthode 2: Docker Compose
```bash
docker-compose up --build
```

### Méthode 3: Commandes manuelles
```bash
# Construire les images
docker build -t pharmacy_backend ./backend
docker build -t pharmacy_frontend ./Pharmacy_Stock_Management_App

# Démarrer les services
docker run -d --name pharmacy_db -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=pharmacy_db -e MYSQL_USER=pharmacy_user -e MYSQL_PASSWORD=pharmacy_password -p 3306:3306 mysql:8.0
docker run -d --name pharmacy_backend --link pharmacy_db:database -e DB_HOST=database -e DB_PORT=3306 -e DB_USERNAME=pharmacy_user -e DB_PASSWORD=pharmacy_password -e DB_NAME=pharmacy_db -e JWT_SECRET=your_secret -p 5000:5000 pharmacy_backend
docker run -d --name pharmacy_frontend --link pharmacy_backend:backend -p 80:80 pharmacy_frontend
```

## 🛑 Arrêter les Services

```bash
# Docker
.\docker-stop.bat

# Ou manuellement
docker stop pharmacy_backend pharmacy_frontend pharmacy_db
docker rm pharmacy_backend pharmacy_frontend pharmacy_db
```

## 🔐 Identifiants de Test

- **Administrateur**: admin / admin123
- **Pharmacien**: pharmacist / pharma123

## 📱 Intégration Mobile

Le bouton "Sync Mobile" dans la section Ventes permet de synchroniser avec l'application mobile externe via l'API.

## 🐛 Problèmes Fréquents

### Docker Desktop ne démarre pas
- Redémarrer l'ordinateur
- Désinstaller/réinstaller Docker Desktop
- Utiliser Docker Engine en ligne de commande

### Connexion à la base de données échoue
- Vérifier que MySQL tourne sur le port 3306
- Vérifier les identifiants dans .env
- S'assurer que les containers peuvent communiquer

## 📞 Support

Pour toute question technique, contacter l'équipe de développement.