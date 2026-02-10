FROM node:18-alpine

# Créer le répertoire de l'application
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le reste du code source
COPY . .

# Construire l'application
RUN npm run build

# Exposer le port
EXPOSE 5000

# Commande de démarrage
CMD ["npm", "start"]