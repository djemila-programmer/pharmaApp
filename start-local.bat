@echo off
REM Démarrage de l'application complète en local

echo 🚀 Démarrage Application Pharmacy Stock Management
echo ==================================================

echo.
echo 🟩 Démarrage Backend (port 5000)
echo --------------------------------
cd backend
start "Backend" cmd /k "npm run dev"
timeout /t 5 >nul

echo.
echo 🟦 Démarrage Frontend (port 3000)  
echo ----------------------------------
cd ../Pharmacy_Stock_Management_App
start "Frontend" cmd /k "npm run dev"

echo.
echo ✅ Applications démarrées !
echo ===========================
echo 🌐 Frontend: http://localhost:3000
echo 📊 Backend: http://localhost:5000
echo 👤 Identifiants: admin / admin123
echo.
echo Appuyez sur une touche pour fermer...
pause >nul