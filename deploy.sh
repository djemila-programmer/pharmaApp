#!/bin/bash

# Script de déploiement Docker pour Pharmacy App

echo "🚀 Déploiement de Pharmacy Stock Management App"

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

# Arrêter les services existants
echo "🛑 Arrêt des services existants..."
docker-compose down

# Construire les images
echo "🏗️ Construction des images Docker..."
docker-compose build

# Démarrer les services
echo "🟢 Démarrage des services..."
docker-compose up -d

# Vérifier le statut
echo "🔍 Vérification du statut des services..."
docker-compose ps

echo "✅ Déploiement terminé!"
echo "🌐 Application disponible sur http://localhost"
echo "📊 Backend API sur http://localhost:5000"
echo "🗄️ Base de données sur le port 3306"