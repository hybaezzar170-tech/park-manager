# Fiche projet : Test et validation de Park Manager

## 1. Identification

| Élément | Valeur |
|---|---|
| Module | Atelier Test et validation des logiciels, Licence 3 |
| Établissement | ISET Mahdia |
| Étudiante | Hyba Ezzar et emna zaydoun |

## 2. Système testé

**Park Manager** est une plateforme web de gestion de parc automobile (nom de code dans le dépôt : *alba*). Elle centralise les véhicules, conducteurs, contrats, documents administratifs, maintenances, réparations, stock de pièces et alertes d'expiration.

### Technologies

| Couche | Technologie |
|---|---|
| Backend | Laravel 10 (PHP), architecture MVC, API RESTful (JSON) |
| Frontend | React.js, appels HTTP via Axios / Fetch |
| Base de données | MySQL, administrée avec phpMyAdmin |
| Serveur local | XAMPP (Apache, PHP, MySQL) |
| Outils existants | Visual Studio Code, Postman |

### Environnement de test

| Élément | Valeur |
|---|---|
| Machine | PC portable MSI |
| Système | Windows 11 |
| Processeur | Intel Core i5-1334U (13e génération) |
| Mémoire | 16 Go |
| Mode d'exécution | Local (XAMPP), aucune mise en production |

## 3. Correspondance avec le sujet du mini-projet

Le sujet propose l'application « RéclaGest ». Park Manager la remplace comme application support, ce qui est autorisé si les règles métier sont adaptées et documentées.

| RéclaGest | Park Manager |
|---|---|
| Authentification | Connexion, jeton d'accès, rôles |
| Réclamations | Véhicules (création, modification, désactivation) |
| Affectation à un agent | Affectation conducteur ↔ véhicule |
| Statuts NOUVELLE → EN_COURS → RESOLUE → CLOTUREE | Statuts véhicule : DISPONIBLE, EN LOCATION, VENDUE |
| Suivi et historique | Historique des maintenances, réparations, contrats |
| Recherche et filtres | Recherche par matricule, nom, état |
| Gestion des utilisateurs | Conducteurs, ouvriers, fournisseurs |
| API REST | API Laravel (JSON, codes HTTP) |
| Persistance | Base MySQL |

> Le dépôt contient aussi des composants de réclamation (`Reclamation.jsx`, `UserReclamation.jsx`). À vérifier en semaine 3 : s'ils sont dans le périmètre fonctionnel réel.

## 4. Outils prévus

| Besoin | Outil |
|---|---|
| Gestion du code | Git + GitHub |
| Tests unitaires | PHPUnit |
| Tests d'intégration | PHPUnit + base MySQL de test |
| Tests API | Postman |
| Tests d'interface | Playwright |
| Performance | k6 |
| Suivi des anomalies | GitHub Issues |
| Aide à la rédaction et à la génération de tests | Agent IA (voir section 5) |

#

## 5. Organisation du dépôt

```
docs-test/
├── 01-risques/          fiche projet, analyse des risques
├── 02-plan/             plan de test
├── 03-cas-de-test/      cas de test, jeux de données
├── 04-anomalies/        registre des anomalies
└── captures/            preuves (S1_01_login.png, ...)
```

Un commit est réalisé à la fin de chaque semaine, ce qui rend la progression visible dans l'historique.

## 6. Calendrier

| Semaine | Thème | Livrable |
|---|---|---|
| 1 | Compréhension et analyse des risques | Fiche projet, risques, périmètre |
| 2 | Stratégie et plan de test | Plan de test |
| 3 | Exigences et traçabilité | Matrice de traçabilité |
| 4 | Conception des cas de test | 15 cas de test ou plus |
| 5 | Transitions d'état, tests exploratoires | Diagramme d'états, premières anomalies |
| 6 | Tests unitaires | 5 tests ou plus |
| 7 | Tests d'intégration | 3 tests ou plus |
| 8 | Tests API REST | Collection Postman |
| 9 | Interface et non fonctionnel | Parcours automatisé, rapport |
| 10 | Campagne finale et décision | Dossier final, décision |
