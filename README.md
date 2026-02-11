Cloner le dépôt :

Bash
git clone https://github.com/AmauryRDV/Vinyls-api.git
cd Vinyls-api
Installer les dépendances :

Bash
pnpm install
Configuration :

Créer un fichier .env à la racine (envoyé séparément par mail conformément aux consignes).

Assurez-vous d'y configurer votre MONGODB_URI et votre JWT_SECRET.

Lancer le projet :

Bash
pnpm run dev
L'API sera accessible sur http://localhost:3000.


erDiagram
    GROUP ||--o{ VINYL : "possède"
    
    GROUP {
        ObjectId _id
        String name
        String genre
        String bio
    }

    VINYL {
        ObjectId _id
        ObjectId group_id
        String title
        Number release_date
        String status
        Number price
        Number stock
    }
