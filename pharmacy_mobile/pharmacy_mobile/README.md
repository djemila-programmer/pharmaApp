# 💊 Pharmacy Stock & Sales Management - Mobile App

Une application mobile Flutter complète pour la gestion des stocks et des ventes en pharmacie.

## 🎯 Objectif Principal

**Suivre les médicaments et éviter les pertes dues aux expirations** tout en facilitant la gestion quotidienne de la pharmacie.

## ✨ Fonctionnalités Principales

### 📦 Gestion des Stocks (Stock Management)
- **Vue d'ensemble du stock** avec recherche et filtrage par catégorie
- **Suivi des lots (Batch Tracking)** avec codes QR
- **Informations détaillées** : quantité, date d'expiration, prix, fournisseur
- **Alertes de stock bas** avec badges colorés
- **Ajout/Modification/Suppression** de médicaments
- **Scanner de codes-barres/QR** pour identification rapide

### 📋 Gestion des Prescriptions
- **Liste des ordonnances** avec filtres par statut (Pending, In Progress, Completed)
- **Détails complets** : patient, médecin, médicaments prescrits
- **Gestion des statuts** avec workflow de traitement
- **Marquage d'urgence** pour les prescriptions prioritaires
- **Validation et traitement** des prescriptions médicales

### ⚠️ Alertes d'Expiration
- **Surveillance automatique** des dates d'expiration
- **Classification par sévérité** : Critical (< 30 jours), Warning (< 60 jours), Info
- **Statistiques visuelles** avec compteurs par catégorie
- **Actions recommandées** : promotions, échanges fournisseurs
- **Notifications push** configurables
- **Paramètres personnalisables** pour les seuils d'alerte

### 💰 Gestion des Ventes
- **Enregistrement rapide** des transactions
- **Historique complet** avec détails (client, articles, montant)
- **Rapports de ventes** : jour, semaine, mois
- **Statistiques en temps réel** avec graphiques
- **Support multiple** : Cash, Card
- **Impression de reçus** (fonction à connecter)
- **Suivi du chiffre d'affaires**

### 🚚 Commandes Fournisseurs
- **Création de commandes** directement depuis l'app
- **Suivi de statut** : Pending, In Transit, Delivered
- **Liste des fournisseurs** avec coordonnées
- **Historique des commandes** avec montants
- **Confirmation de réception** des livraisons
- **Annulation/Modification** des commandes en attente

### 🏠 Dashboard
- **Vue d'ensemble** avec statistiques clés
- **Quick Actions** pour accès rapide aux fonctions
- **Activité récente** en temps réel
- **Indicateurs de performance** visuels
- **Navigation rapide** vers toutes les sections

## 🏗️ Architecture de l'Application

```
pharmacy_mobile/
├── lib/
│   ├── main.dart                          # Point d'entrée avec navigation
│   └── screens/
│       ├── home_screen.dart               # Dashboard principal
│       ├── stock_screen.dart              # Gestion des stocks
│       ├── prescriptions_screen.dart      # Gestion des prescriptions
│       ├── expiry_alerts_screen.dart      # Alertes d'expiration
│       ├── sales_screen.dart              # Gestion des ventes
│       └── supplier_orders_screen.dart    # Commandes fournisseurs
├── pubspec.yaml                           # Dépendances Flutter
├── preview.html                           # Preview interactive
└── README.md                              # Documentation
```

## 🎨 Design & UI/UX

### Palette de Couleurs
- **Primary Color**: `#00796B` (Teal 700) - Professionnel et médical
- **Dark Primary**: `#004D40` (Teal 900)
- **Background**: `#F5F5F5` (Grey 100)
- **Cards**: White avec ombres subtiles

### Principes de Design
- **Material Design 3** avec composants modernes
- **Navigation intuitive** avec Bottom Navigation Bar
- **Cartes interactives** pour chaque élément
- **Badges colorés** pour statuts et alertes
- **Modals et Bottom Sheets** pour détails et actions
- **Animations fluides** pour transitions
- **Responsive design** pour différentes tailles d'écran

## 📱 Écrans Principaux

### 1. Home Dashboard
- Carte de bienvenue avec date
- 4 statistiques clés (Stock, Expiring, Sales, Prescriptions)
- 6 Quick Actions en grille
- Activité récente avec timeline
- Navigation rapide

### 2. Stock Management
- Barre de recherche avec scanner
- Filtres par catégorie (Analgesic, Antibiotic, etc.)
- Liste des médicaments avec:
  - Nom et dosage
  - Numéro de lot
  - Quantité avec badge coloré
  - Date d'expiration
  - Prix
- Bottom Sheet avec détails complets
- Bouton FAB pour ajouter du stock

### 3. Prescriptions
- Filtres par statut (All, Pending, In Progress, Completed)
- Cartes de prescriptions avec:
  - ID et patient
  - Médecin prescripteur
  - Statut avec badge
  - Badge "URGENT" si nécessaire
  - Nombre de médicaments
- Détails avec liste des médicaments
- Actions selon statut (Process, Mark Complete)

### 4. Expiry Alerts
- Résumé avec compteurs Critical/Warning
- Liste triée par date d'expiration
- Indicateur visuel (bordure colorée)
- Nombre de jours restants
- Actions recommandées
- Paramètres d'alertes

### 5. Sales
- Carte résumé des ventes du jour
- Historique des transactions
- Détails de chaque vente
- Rapports (jour, semaine, mois)
- Bouton FAB pour nouvelle vente

### 6. Supplier Orders
- Filtres par statut
- Liste des commandes
- Détails avec articles
- Annulation/Suivi selon statut
- Liste des fournisseurs
- Création de nouvelles commandes

## 🚀 Installation et Configuration

### Prérequis
```bash
Flutter SDK >= 3.0.0
Dart SDK >= 3.0.0
```

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd pharmacy_mobile

# Installer les dépendances
flutter pub get

# Lancer l'application
flutter run
```

### Configuration
1. Connecter l'API backend (à définir)
2. Configurer les notifications push
3. Intégrer le scanner de codes QR
4. Paramétrer la connexion fournisseurs

## 🔌 Intégrations Futures

### À Implémenter
- [ ] **API REST** pour synchronisation backend
- [ ] **QR Code Scanner** (flutter_barcode_scanner)
- [ ] **Notifications Push** (firebase_messaging)
- [ ] **Impression de reçus** (bluetooth_print)
- [ ] **Export de rapports** (PDF, Excel)
- [ ] **Authentification** (login pharmacien)
- [ ] **Base de données locale** (SQLite/Hive)
- [ ] **Synchronisation offline** avec cloud
- [ ] **Graphiques avancés** (fl_chart)
- [ ] **Multi-langue** (i18n)

### Packages Recommandés
```yaml
dependencies:
  # État
  provider: ^6.0.0
  
  # Réseau
  http: ^1.1.0
  dio: ^5.0.0
  
  # Base de données
  sqflite: ^2.3.0
  hive: ^2.2.3
  
  # Scanner
  qr_code_scanner: ^1.0.1
  flutter_barcode_scanner: ^2.0.0
  
  # Notifications
  flutter_local_notifications: ^16.0.0
  
  # Charts
  fl_chart: ^0.65.0
  
  # PDF
  pdf: ^3.10.0
  printing: ^5.11.0
```

## 📊 Modèles de Données

### Medicine (Médicament)
```dart
{
  'name': String,           // Nom du médicament
  'batch': String,          // Numéro de lot
  'quantity': int,          // Quantité en stock
  'expiry': String,         // Date d'expiration (YYYY-MM-DD)
  'category': String,       // Catégorie
  'price': double,          // Prix unitaire
  'supplier': String        // Fournisseur
}
```

### Prescription
```dart
{
  'id': String,             // ID unique (RX-YYYY-NNN)
  'patientName': String,    // Nom du patient
  'doctorName': String,     // Nom du médecin
  'medicines': List<String>,// Liste des médicaments
  'date': String,           // Date (YYYY-MM-DD)
  'status': String,         // Pending/In Progress/Completed
  'urgency': String         // Normal/Urgent
}
```

### Sale
```dart
{
  'id': String,             // ID unique (SALE-NNN)
  'date': String,           // Date et heure
  'customer': String,       // Nom du client
  'items': List<Item>,      // Articles vendus
  'total': double,          // Montant total
  'paymentMethod': String   // Cash/Card
}
```

### Order
```dart
{
  'id': String,             // ID unique (PO-YYYY-NNN)
  'supplier': String,       // Fournisseur
  'date': String,           // Date de commande
  'items': List<String>,    // Articles commandés
  'total': double,          // Montant total
  'status': String          // Pending/In Transit/Delivered
}
```

## 🎯 Cas d'Usage Principaux

### 1. Scan et Ajout de Stock
```
Pharmacien ouvre Stock > Scanner QR
↓
App scanne le code-barres
↓
Affiche les infos du médicament
↓
Pharmacien confirme et ajoute au stock
```

### 2. Traitement d'Ordonnance
```
Pharmacien ouvre Prescriptions > Sélectionne ordonnance
↓
Vérifie les médicaments disponibles
↓
Prépare les médicaments
↓
Marque comme "In Progress" puis "Completed"
```

### 3. Gestion des Expirations
```
App vérifie automatiquement les dates
↓
Génère des alertes selon seuils
↓
Pharmacien voit les alertes Critical/Warning
↓
Prend actions : promotions, retours, etc.
```

### 4. Enregistrement de Vente
```
Pharmacien ouvre Sales > New Sale
↓
Scanne ou sélectionne les médicaments
↓
Entre les quantités
↓
Confirme le paiement (Cash/Card)
↓
Génère le reçu
```

## 🔐 Sécurité et Bonnes Pratiques

- **Validation des données** à chaque saisie
- **Gestion des erreurs** avec try-catch
- **Messages utilisateur** clairs et informatifs
- **Confirmation** pour actions critiques (suppression)
- **Logs** pour traçabilité
- **Backup** régulier des données

## 📈 Métriques de Performance

### Objectifs
- **Temps de démarrage** < 2 secondes
- **Navigation fluide** 60 FPS
- **Réponse UI** < 100ms
- **Chargement des listes** < 500ms
- **Scan QR** < 1 seconde

## 🤝 Contribution

Ce projet est un template complet pour une application de gestion de pharmacie. Pour l'adapter à vos besoins:

1. Modifier les modèles de données
2. Connecter à votre API
3. Personnaliser les couleurs et le branding
4. Ajouter les fonctionnalités spécifiques

## 📝 Licence

MIT License - Libre d'utilisation et modification

## 📧 Support

Pour toute question ou suggestion, créez une issue sur le repository.

---

**Développé avec ❤️ en Flutter**
