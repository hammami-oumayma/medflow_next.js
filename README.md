#techApp
nextjs 14 
React
TypeScript
MongoDb(Mongoose)
TailwindCSS
Api Routes
JWT Auth


#Installer les dépendances
npm install

#.env
MONGODB_URI=

#Démarrer le projet
npm run dev 

#Importe TailwindCSS globalement et configuration 
npm install -D tailwindcss postcss autoprefixer
@import "tailwindcss";
@tailwind base;
@tailwind components;
@tailwind utilities;


#Fonctionnement middleware 
Lit le cookie token (JWT)
Si aucun token → redirection automatique vers /login





Autorise l’accès si le token existe.
 
