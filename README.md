![logo-dark](https://github.com/user-attachments/assets/df95f96e-1c24-4eaa-b0a7-0c0381d01a34)
 <!-- Remplacez par une bannière réelle si disponible -->

AjsonX est une plateforme intuitive qui permet aux développeurs de générer des API fictives et personnalisées en quelques clics. Que vous ayez besoin de tester une application, de simuler des données ou de prototyper rapidement, AjsonX est là pour vous simplifier la vie.

---

## Fonctionnalités principales ✨

- **API prédéfinies** : Utilisez des API fictives prêtes à l'emploi (ex. posts, voitures, appartements).
- **API personnalisées** : Créez vos propres API en définissant la structure et les types de données.
- **Gestion simplifiée** : Tableau de bord intuitif pour gérer vos API.
- **Endpoints REST** : Accédez à vos API via des endpoints REST en JSON.
- **Plans d'abonnement** : Choisissez entre un plan gratuit et des abonnements premium pour plus de fonctionnalités.

---

## Technologies utilisées 🛠️

- **Frontend** :
  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
  ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
  ![Shadcn](https://img.shields.io/badge/Shadcn-000000?style=for-the-badge&logo=shadcn&logoColor=white) <!-- Remplacez par le logo de Shadcn si disponible -->
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

- **Backend** :
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)

- **Base de données** :
  ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

- **Authentification** :
  ![Clerk](https://img.shields.io/badge/Clerk-000000?style=for-the-badge&logo=clerk&logoColor=white) <!-- Remplacez par le logo de Clerk si disponible -->

- **Validation de formulaire** :
  ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=react-hook-form&logoColor=white)
  ![Zod](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=white) <!-- Remplacez par le logo de Zod si disponible -->

---

## Structure du projet 📂

### Pages principales
1. **Page d'accueil** :
   - Section "Contact Us" avec formulaire.
   - Liens vers Guide, Sponsor, Pricing, Blog, Sign up, et Login.

2. **Tableau de bord (/dashboard)** :
   - Liste des API sous forme de cartes.
   - Filtres pour "Mes API" et "API fictives".
   - Bouton "Create a new API".

3. **Création d'API (/dashboard/create-api)** :
   - Formulaire de création d'API avec visualisation JSON en temps réel.
   - Types de données pris en charge : Texte, Nombre, Email, Tel, Age, Liste, Tableau.

4. **Page de tarification (/dashboard/pricing)** :
   - Affiche les plans disponibles (Free, Premium, Gold).

---

## Structure des données renvoyées 📊

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "createdBy": "userId",
  "fields": [
    {
      "name": "string",
      "type": "string",
      "example": "any"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Endpoints disponibles 🌐


## Comment commencer ? 🚀

1-Clonez le dépôt :

```
git clone https://github.com/votre-utilisateur/ajsonx.git

```

2-Installez les dépendances :

```
cd ajsonx
npm install

```
4-Configurez les variables d'environnement :

Créez un fichier .env et ajoutez vos clés d'API (ex. Clerk, MongoDB).

5-Lancez le projet :

```
npm run dev

```
6-Accédez à l'application :

Ouvrez votre navigateur et allez à ``` http://localhost:3000. ```


## Contribution 🤝

Les contributions sont les bienvenues ! Si vous souhaitez améliorer AjsonX, suivez ces étapes :

Forkez le projet.

Créez une branche pour votre fonctionnalité (``` git checkout -b feature/AmazingFeature ```).

Committez vos changements (``` git commit -m 'Add some AmazingFeature' ```).

Pushez la branche (``` git push origin feature/AmazingFeature ```).

Ouvrez une Pull Request.


