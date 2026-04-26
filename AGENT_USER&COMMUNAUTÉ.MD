

```markdown
# 📱 Prompt 2 — Application Mobile (Communautés + Utilisateurs)

## 🎯 Objectif
Créer uniquement l’application mobile **EventHub** pour :

- **Communautés / Organisateurs**
- **Utilisateurs simples**

Application mobile moderne pour découvrir, créer et gérer les événements tech au Togo.

---

## 🛠 Stack Technique

- **React Native (Expo)**
- **TypeScript**
- **Shadcn/UI mobile style**
- **TanStack Query**
- **React Navigation**
- **Firebase Auth (Google)**
- **Backend API Node.js**
- **Cloudinary images**

---

# 👤 Partie Utilisateur Simple

## Modules

### 🔐 Auth
- Connexion Google

### 🏠 Home
- Feed événements
- Recommandations
- Tendances

### 🔍 Recherche
- Rechercher événement
- Filtres :
  - ville
  - date
  - catégorie

### 📄 Détail événement
- Image
- Description
- Lieu
- Date
- Organisateur
- Bouton participer

### ❤️ Favoris
- Sauvegarder événements

### 👤 Profil
- Infos utilisateur
- Historique participations

---

# 🏢 Partie Communauté / Organisateur

## Modules

### 📅 Gestion événements
- Créer événement
- Modifier événement
- Supprimer événement

### 👥 Participants
- Liste inscrits
- Scanner QR code (future ready)

### 📊 Dashboard
- Nombre participants
- Vues événement
- Taux engagement

### 🏢 Profil communauté
- Logo
- Description
- Réseaux sociaux

---

## 🎨 UI/UX Demandée

- Design moderne startup
- Navigation bottom tabs
- Cards élégantes
- Animations fluides
- Dark mode
- Responsive Android / iPhone

---

## 📂 Structure

```bash
mobile/
 ┣ src/
 ┃ ┣ screens/
 ┃ ┣ navigation/
 ┃ ┣ components/
 ┃ ┣ hooks/
 ┃ ┣ services/
 ┃ ┣ store/
 ┃ ┗ theme/