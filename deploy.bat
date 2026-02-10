@echo off
REM Script de déploiement Docker pour Pharmacy App (Windows)

echo 🚀 Déploiement de Pharmacy Stock Management App

REM Vérifier si Docker est installé
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker n'est pas installé
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose n'est pas installé
    exit /b 1
)

REM Arrêter les services existants
echo 🛑 Arrêt des services existants...
docker-compose down

REM Construire les images
echo 🏗️ Construction des images Docker...
docker-compose build

REM Démarrer les services
echo 🟢 Démarrage des services...
docker-compose up -d

REM Vérifier le statut
echo 🔍 Vérification du statut des services...
docker-compose ps

echo ✅ Déploiement terminé!
echo 🌐 Application disponible sur http://localhost
echo 📊 Backend API sur http://localhost:5000
echo 🗄️ Base de données sur le port 3306