# Utiliser l'image Node.js comme base
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Construire l'application pour la production
RUN npm run build

# Installer un serveur HTTP pour servir l'application
RUN npm install -g serve

# Exposer le port sur lequel l'application sera servie
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["serve", "-s", "build"]