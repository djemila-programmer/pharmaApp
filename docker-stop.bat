@echo off
REM Script pour arrêter tous les services Docker de Pharmacy App

echo 🛑 Arrêt des services Pharmacy App...

REM Arrêter les containers
docker stop pharmacy_backend pharmacy_frontend pharmacy_db 2>nul

REM Supprimer les containers
docker rm pharmacy_backend pharmacy_frontend pharmacy_db 2>nul

echo ✅ Tous les services ont été arrêtés
pause