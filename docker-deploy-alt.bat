@echo off
REM Script de déploiement alternatif pour Pharmacy App
REM Utilise Docker Engine directement sans Docker Desktop GUI

echo 🚀 Déploiement Alternatif de Pharmacy Stock Management App
echo =========================================================

REM Vérifier si Docker est accessible
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker n'est pas accessible
    echo Veuillez démarrer Docker Desktop manuellement
    echo Ou installer Docker Engine si ce n'est pas déjà fait
    pause
    exit /b 1
)

REM Arrêter les containers existants
echo 🛑 Arrêt des containers existants...
docker stop pharmacy_backend pharmacy_frontend pharmacy_db 2>nul
docker rm pharmacy_backend pharmacy_frontend pharmacy_db 2>nul

REM Construire les images
echo 🏗️ Construction des images Docker...

REM Backend
echo Construction du backend...
docker build -t pharmacy_backend ./backend

REM Frontend  
echo Construction du frontend...
docker build -t pharmacy_frontend ./Pharmacy_Stock_Management_App

REM Démarrer la base de données
echo 🗄️ Démarrage de la base de données MySQL...
docker run -d ^
  --name pharmacy_db ^
  -e MYSQL_ROOT_PASSWORD=rootpassword ^
  -e MYSQL_DATABASE=pharmacy_db ^
  -e MYSQL_USER=pharmacy_user ^
  -e MYSQL_PASSWORD=pharmacy_password ^
  -p 3306:3306 ^
  mysql:8.0

REM Attendre que MySQL démarre
echo Attente de la base de données...
timeout /t 30 /nobreak >nul

REM Démarrer le backend
echo 🟢 Démarrage du backend...
docker run -d ^
  --name pharmacy_backend ^
  --link pharmacy_db:database ^
  -e DB_HOST=database ^
  -e DB_PORT=3306 ^
  -e DB_USERNAME=pharmacy_user ^
  -e DB_PASSWORD=pharmacy_password ^
  -e DB_NAME=pharmacy_db ^
  -e JWT_SECRET=your_production_jwt_secret ^
  -e NODE_ENV=production ^
  -p 5000:5000 ^
  pharmacy_backend

REM Démarrer le frontend
echo 🔵 Démarrage du frontend...
docker run -d ^
  --name pharmacy_frontend ^
  --link pharmacy_backend:backend ^
  -p 80:80 ^
  pharmacy_frontend

REM Vérifier le statut
echo 🔍 Vérification du statut des services...
docker ps

echo.
echo ✅ Déploiement terminé!
echo ========================================
echo 🌐 Application : http://localhost
echo 📊 API Backend : http://localhost:5000  
echo 🗄️ Base de données : port 3306
echo ========================================
echo.
echo Pour arrêter : docker-compose-down.bat
echo Pour voir les logs : docker logs pharmacy_backend
pause