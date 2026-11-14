# Analyse des risques et périmètre de test : Park Manager

## 1. Méthode

Chaque risque est évalué avec deux notes de 1 à 3.

| Note | Probabilité | Impact |
|---|---|---|
| 1 | Peu probable | Gêne mineure |
| 2 | Possible | Perturbation du service ou coût modéré |
| 3 | Probable | Perte financière, donnée fausse ou faille de sécurité |

**Niveau de risque = Probabilité × Impact.**
Priorité : **6 à 9 = élevée**, **3 à 4 = moyenne**, **1 à 2 = faible**. Les tests sont conçus en premier pour les risques élevés.

## 2. Fonctions critiques

| Fonction | Pourquoi elle est critique |
|---|---|
| Authentification et rôles | Protège l'ensemble du système |
| Contrats (vente, location, achat) | Impact financier direct |
| Statut des véhicules | Un véhicule vendu ne doit plus être loué ni revendu |
| Alertes d'expiration (assurance, visite technique, taxe) | Évite pénalités et immobilisations |
| Stock de pièces et réparations | Un stock faux bloque les interventions |
| Intégrité de la base de données | Toutes les fonctions en dépendent |

## 3. Registre des risques

| ID | Module | Risque | Conséquence | P | I | Niveau |
|---|---|---|---|---|---|---|
| R1 | Contrats | Vendre ou louer un véhicule déjà vendu ou déjà en location | Double transaction, litige client | 3 | 3 | **9** |
| R2 | Contrats | Prix de vente ou d'achat aberrant, nul ou négatif accepté | Données financières fausses | 3 | 3 | **9** |
| R3 | Alertes | Alerte non générée, en double ou maintenue pour un véhicule vendu | Pénalités, alertes inutiles | 3 | 2 | **6** |
| R4 | Stock | Stock négatif ou non décrémenté après une réparation | Quantités fausses, pièces manquantes | 2 | 3 | **6** |
| R5 | Sécurité | Accès aux pages ou à l'API sans connexion | Fuite de données | 2 | 3 | **6** |
| R6 | Sécurité | Un rôle accède aux fonctions d'un autre rôle | Modification non autorisée | 2 | 3 | **6** |
| R7 | Sécurité | Injection SQL ou XSS via les formulaires | Compromission des données | 1 | 3 | 3 |
| R8 | Saisie des données | Doublons, formats invalides ou champs incohérents acceptés (matricule, téléphone, email) | Historique erroné, données de mauvaise qualité | 3 | 2 | **6** |
| R9 | Affectation | Affectation incohérente ou contradictoire entre conducteur et véhicule | Historique incohérent | 3 | 2 | **6** |
| R10 | Maintenance et réparations | Coût à 0 ou date de fin avant la date de début acceptés | Statistiques fausses | 3 | 2 | **6** |
| R11 | Base de données | Suppression d'un conducteur, véhicule, ouvrier ou fournisseur lié sans contrôle | Données orphelines, erreurs d'affichage | 2 | 3 | **6** |
| R12 | Tableaux de bord | Indicateurs différents des données réelles de la base | Mauvaise décision de gestion | 2 | 2 | 4 |
| R13 | API | Codes HTTP incorrects ou messages d'erreur non maîtrisés | Frontend instable | 2 | 2 | 4 |
| R14 | Documents | Date d'expiration dans le passé ou incohérente acceptée | Alertes inutiles ou manquantes | 3 | 2 | **6** |
| R15 | Interface | Affichage cassé sur mobile ou tablette | Utilisation difficile | 2 | 1 | 2 |
| R16 | Performance | Lenteur avec un grand nombre de véhicules | Utilisation pénible | 1 | 2 | 2 |
| R17 | Recherche et PDF | Filtre ou export PDF incomplet ou incorrect | Informations manquantes | 2 | 2 | 4 |

## 4. Périmètre de test

### Inclus

| Domaine | Détail |
|---|---|
| Authentification | Connexion, déconnexion, identifiants invalides, rôles |
| Départements, conducteurs, véhicules | Création, modification, activation, désactivation, recherche |
| Contrats | Vente, location, achat, ajout d'un client |
| Documents | Assurance, visite technique, taxe |
| Alertes | Génération et affichage |
| Ouvriers, fournisseurs | Gestion et association aux interventions |
| Pièces, maintenance, réparations | Stock, coût, durée, pièces utilisées |
| API REST | Méthodes, codes HTTP, authentification, erreurs |
| Base de données | Persistance, contraintes d'intégrité |
| Non fonctionnel | Au moins un test : sécurité (accès, injection) ou performance |

### Exclu

| Exclusion | Justification |
|---|---|
| Hébergement et déploiement en production | Application exécutée uniquement en local |
| Tests de charge lourds | Machine unique, hors objectif du module |
| Envoi réel d'emails et de SMS | Dépend de services externes et de comptes personnels |
| Compatibilité avec tous les navigateurs | Un navigateur de référence suffit pour la campagne |
| Support complet de l'arabe | À signaler comme limite si non testé |

## 5. Synthèse

Les captures confirment que les risques les plus élevés se concentrent sur les **contrats** (double vente, montants aberrants), les **alertes** (doublons, véhicule vendu toujours concerné) et la **qualité des données saisies** (doublons, formats). Les tests des semaines 4 à 9 sont orientés d'abord vers ces domaines.

