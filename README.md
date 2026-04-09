# Frontend - GIFT-SQUAD-FRONT

Application mobile de gestion de cadeaux collectifs, developpée avec React Native et Expo

---

## Description

Gift Squad permet à un groupe d’amis ou de famille d’organiser des cadeaux collectifs pour un événement. Chaque participant peut consulter la liste de cadeaux, contribuer financièrement et suivre l’avancement de la collecte.

L’application prend en charge 3 types d’événements :

- Anniversaire : organisation d’un cadeau commun avec contribution financière
- Secret Santa : tirage au sort automatique entre participants
- Liste de Noël : chaque utilisateur peut créer et partager sa propre wishlist

Chaque participant peut consulter les cadeaux, contribuer, réserver un cadeau et suivre l’avancement de la collecte en temps réel.

---

## Fonctionnalités

1. Authentification & profil:

- Inscription et connexion sécurisée
- Modification des informations personnelles

2. Gestion d’événements:

- Création d’événements (Anniversaire, Secret Santa, Liste de Noël)
- Invitation des participants par email
- Suivi du montant total collecté

3. Gestion des cadeaux:

- Ajout, modification et suppression de cadeaux
- Affichage avec photo, prix et lien produit
- Réservation de cadeaux pour éviter les doublons

4. Secret Santa:

- Tirage au sort automatique entre participants
- Attribution anonyme des personnes à qui offrir un cadeau

5. Liste de Noël:

- Création de wishlist personnelle
- Partage avec les autres participants

6. Notifications:
   Réception de notifications push (invitations, mises à jour, etc.)

7. Navigation
   Menu latéral (drawer navigation) pour accéder aux différentes sections

---

## Structure du projet

- `/app` → écrans et navigation (Expo Router)
- `/components` → composants réutilisables
- `/context` → gestion de l’état global (auth, events, etc.)
- `/utils` → fonctions utilitaires (API, helpers)
- `/styles` → styles globaux

---

## Prérequis

Avant d’installer l’application, assurez-vous d’avoir :

- Node.js version 18 ou supérieure → nodejs.org
- npm (inclus avec Node.js)
- Expo Go installé sur le téléphone (iOS ou Android)
- Un accès à l’API backend (URL renseignée dans le fichier .env )

---

## Installation

1.  Cloner le projet
    git clone <https://github.com/Reacteur-Giftsquad/Gift-squad-front>
    cd Gift-squad-front

2.  Installer les dépendances
    npm install

3.  Lancer l'application
    npx expo start -c

---

## Variables d’environnement

1.  Créer un fichier `.env` à la racine du projet avec la variable suivante :

EXPO_PUBLIC_API_URL=https://site--gift-squad-back--r62dpvlsxwvq.code.run

Cette variable permet de configurer l’URL de l’API backend utilisée par l’application.

2.  Lancer l’application :

- npx expo start

- scanner le QR code avec l’application Expo Go sur votre téléphone.

---

## Expo Go vs Dev Build

- **Expo Go** permet de tester rapidement l’application
- Certaines fonctionnalités avancées comme les **notifications push** ne fonctionnent pas avec Expo Go

👉 Pour utiliser les notifications, il est nécessaire d’utiliser un **dev build (EAS)**

### Lancer un dev build

```bash
npx expo run:ios
npx expo run:android
```

## Compatibilité

- iOS 13+
- Android 8+

---

## Stack technique

- React Native / Expo
- Expo Router (navigation)
- Axios (communication avec l’API)

---

## Support

Pour toute question technique, contacter l’équipe de développement.
