@echo off
REM Script de test complet de l'application locale

echo 🧪 Test Complet de l'Application Pharmacy Stock Management
echo ==========================================================

echo.
echo 🟩 Test Backend (localhost:5000)
echo --------------------------------
curl -s http://localhost:5000/api/health
if %errorlevel% equ 0 (
    echo ✅ Backend accessible
) else (
    echo ❌ Backend inaccessible
)

echo.
echo 🟦 Test Frontend Build
echo ----------------------
if exist build\index.html (
    echo ✅ Build frontend réussi
    echo 📁 Fichiers générés :
    dir build /B
) else (
    echo ❌ Build frontend échoué
)

echo.
echo 🟨 Test Structure Projet
echo ---------------------
echo 📂 Dossiers présents :
dir ..\backend\dist /B >nul 2>&1 && echo ✅ Backend compilé
dir build /B >nul 2>&1 && echo ✅ Frontend compilé

echo.
echo 🚀 Solutions pour Vercel
echo ======================
echo 1. Le push GitHub a été effectué
echo 2. Vercel déploiera automatiquement dans quelques minutes
echo 3. Vérifiez les logs sur vercel.com/dashboard
echo 4. Pour le backend, assurez-vous que les variables d'environnement sont configurées

echo.
echo 📋 Variables d'Environnement Requises pour Backend Vercel :
echo ----------------------------------------------------------
echo DB_HOST=votre-serveur-mysql
echo DB_USERNAME=votre-username
echo DB_PASSWORD=votre-password
echo DB_NAME=pharmacy_db
echo JWT_SECRET=votre-secret-long-et-complexe
echo NODE_ENV=production

pause