@echo off
REM Script de test Vercel après déploiement

echo 🚀 Test du Déploiement Vercel
echo =============================

echo.
echo 🟦 Test Frontend Vercel
echo -----------------------
echo URL: https://pharma-app-omp9.vercel.app
echo Le navigateur s'ouvre automatiquement...
timeout /t 3 >nul

echo.
echo 🟩 Test Backend API Vercel  
echo --------------------------
echo Test de l'API medicines...
powershell -Command "Invoke-WebRequest -Uri 'https://pharma-app-uahz.vercel.app/api/medicines' -Method GET -Headers @{Authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczODk0NjgwMCwiZXhwIjoxNzM5MDMzMjAwfQ.YOUR_TOKEN_HERE'}" 2>nul
if %errorlevel% equ 0 (
    echo ✅ API backend accessible
) else (
    echo ⚠️  API backend nécessite authentification
)

echo.
echo 🧪 Tests Manuelles Recommandées
echo -------------------------------
echo 1. Ouvrir https://pharma-app-omp9.vercel.app
echo 2. Se connecter avec: admin / admin123
echo 3. Vérifier affichage des médicaments
echo 4. Tester création de commandes
echo 5. Vérifier synchronisation mobile

echo.
echo 📋 Si des erreurs persistent:
echo -------------------------------
echo 1. Vérifier logs Vercel: vercel.com/dashboard
echo 2. Configurer variables d'environnement backend
echo 3. Vérifier connexion base de données

pause