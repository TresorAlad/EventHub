# 📘 Prompt 1 — SuperAdmin Web Dashboard (Web App)

## 🎯 Objectif
Créer uniquement le **dashboard SuperAdmin en version Web** pour la plateforme **EventHub**, application de gestion et promotion des événements tech au Togo.

Le SuperAdmin gère toute la plateforme depuis une interface web moderne, sécurisée et responsive.

---

## 🛠 Stack Technique

- **Frontend Web** : Next.js + TypeScript
- **UI** : Shadcn/UI + Tailwind CSS
- **State Management** : TanStack Query
- **Backend API** : Node.js + Express.js / NestJS
- **Base de données** : PostgreSQL (Neon)
- **ORM** : Prisma
- **Authentification** : Firebase Auth + RBAC
- **Charts** : Recharts

---

## 👑 Modules SuperAdmin

### 🔐 Authentification
- Connexion sécurisée
- Gestion des rôles
- Sessions sécurisées

### 📊 Dashboard Global
- Nombre total utilisateurs
- Nombre total communautés
- Nombre total événements
- Nombre d’inscriptions
- Croissance mensuelle
- Activité récente

### 👥 Gestion Utilisateurs
- Liste utilisateurs
- Recherche / filtres
- Suspendre / activer compte
- Modifier rôle

### 🏢 Gestion Communautés
- Liste communautés
- Vérification communauté
- Suspendre communauté
- Voir statistiques

### 📅 Gestion Événements
- Liste événements
- Valider / rejeter événement
- Supprimer événement
- Voir détails

### 📢 Gestion Publicités
- Créer bannière sponsorisée
- Programmer affichage
- Statistiques clics

### 📈 Analytics
- Graphiques croissance
- Engagement utilisateurs
- Événements populaires
- Régions actives

### ⚙️ Paramètres
- Branding plateforme
- Gestion langues
- Configuration emails

---

## 🎨 UI/UX Demandée

- Interface premium SaaS
- Sidebar admin moderne
- Cards analytics
- Tableaux filtrables
- Responsive desktop/tablette
- Dark mode

---

## 📂 Structure

```bash
web-admin/
 ┣ src/
 ┃ ┣ app/
 ┃ ┣ components/
 ┃ ┣ modules/
 ┃ ┣ hooks/
 ┃ ┣ services/
 ┃ ┣ lib/
 ┃ ┗ types/