@echo off
REM Script de déploiement automatisé sur Vercel

echo 🚀 Déploiement Automatisé sur Vercel
echo ====================================

REM Vérifier si Vercel CLI est installé
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ℹ️  Installation de Vercel CLI...
    npm install -g vercel
)

REM Déploiement Frontend
echo 🟦 Déploiement du Frontend...
cd Pharmacy_Stock_Management_App
vercel --prod --confirm
cd ..

REM Déploiement Backend  
echo 🟩 Déploiement du Backend...
cd backend
vercel --prod --confirm
cd ..

echo.
echo ✅ Déploiement terminé!
echo ====================================
echo 🌐 Frontend: https://pharma-app-ivory.vercel.app (mis à jour)
echo 📊 Backend: À configurer sur Vercel
echo ====================================
pause