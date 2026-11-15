# Tests unitaires automatisés : Park Manager

| Élément | Valeur |
|---|---|
| Version | 1.0 (semaine 6) |
| Date | 14/11/2026 |
| Auteure | Emna zaydoun & Hyba Ezzar |
| Documents liés | `S4_cas_de_test.md`, `S5_transitions.md`, `registre_anomalies.md`, `S2_plan_de_test.md` (sections 4 et 10) |

## 1. Objet et méthode

Ce rapport présente les tests unitaires automatisés écrits et **exécutés** en semaine 6, avec leurs résultats réels, leurs preuves et leurs limites.

| Principe | Mise en œuvre |
|---|---|
| Structure d'un test | Arrange, Act, Assert (préparer, agir, vérifier), indiquée en commentaire dans chaque test |
| Cible | Méthodes des contrôleurs de l'API : `ReparationController::store`, `VenteController::store`, `AlerteController::getExpirationAlerts` |
| Base de données | Base séparée `alba_test` (forcée dans `phpunit.xml`), jamais `alba_app` |
| Isolation | `DatabaseTransactions` : toutes les écritures d'un test sont annulées à sa fin |
| Double de test | `Carbon::setTestNow()` fige l'horloge au 13/11/2026 à 21:22 pour les tests d'alertes |
| Assertions | `assertSame`, `assertEquals`, `assertNull`, `assertNotNull`, `assertGreaterThanOrEqual`, `assertArrayHasKey`, `assertTrue` |

**Limite de méthode.** Les règles métier de Park Manager sont écrites dans les contrôleurs, couplées à Eloquent (il n'existe pas de dossier `app/Http/Requests`). Un test totalement isolé de la base n'est pas possible sans modifier le code. Ces tests sont donc des **tests unitaires de méthodes de contrôleur**, exécutés sur la base de test. L'intégration complète (CRUD, contraintes) est traitée en semaine 7.

## 2. Environnement

| Élément | Valeur |
|---|---|
| PHP | 8.1.2 (ZTS, 64 bits) |
| PHPUnit | 10.5.60 |
| Framework | Laravel 10 |
| Base de test | `alba_test` (copie de la structure de `alba_app`) |
| Couverture | Xdebug 3.5.3, php-code-coverage 10.1.16 |

### Incidents rencontrés (environnement)

| N° | Constat | Cause | Résolution |
|---|---|---|---|
| 1 | Le premier lancement du test de vente échoue avec `Unknown column 'client_id'` | La base `alba_test` datait de l'ancien dump : la table `ventes` n'avait pas `client_id` | Resynchronisation de la structure |
| 2 | L'import de la structure échoue (erreurs `#1451`, puis `#1005`) | Clés étrangères ; l'import s'arrête au milieu et laisse des tables sans clé primaire ni auto-incrément (`Field 'id' doesn't have a default value`) | Suppression de `alba_test` et recréation par la fonction « Copier la base de données » de phpMyAdmin (structure seule, avec auto-incrément et contraintes) |
| 3 | Erreur `#1030 ... Read page with wrong checksum ... Aria` lors d'un `FLUSH PRIVILEGES` | Table système MariaDB abîmée, sans lien avec les données du projet | `CHECK TABLE` sur les tables système : toutes `OK` |

Enseignement : un test peut échouer à cause de l'environnement et non du code. La précaution adoptée est de ne jamais lancer de commande de migration destructive sur `alba_app`.

Preuves : [`S6_01`](../captures/S6_01_phpunit_etat_initial.png), [`S6_04`](../captures/S6_04_ventes_colonnes_alba_app.png), [`S6_05`](../captures/S6_05_ventes_colonnes_alba_test.png), [`S6_06_a`](../captures/S6_06_import_erreurs_a.png), [`S6_06_b`](../captures/S6_06_import_erreurs_b.png), [`S6_07`](../captures/S6_07_erreur_aria_checksum.png), [`S6_08`](../captures/S6_08_check_table_ok.png).

## 3. Tests écrits

Fichiers dans `tests/Unit/`. Huit tests ont été écrits en semaine 6 (le sujet en demande au moins cinq), s'ajoutant aux trois tests de départ (environnement et exemple).

| ID | Fichier et méthode | Cas S4 | Exigence / risque | Résultat | Anomalie |
|---|---|---|---|---|---|
| UT-01 | `ReparationDatesTest` : réparation avec date de fin avant le début refusée | TC-REP-02 | EX-REP-02 / R10 | **Réussi** | |
| UT-02 | `VentePrixTest` : vente à prix négatif refusée | TC-CTR-03 | EX-CTR-03 / R2 | **Échec** | ANO-001 |
| UT-03 | `VenteEtatTest` : vente sur voiture en location refusée (témoin) | TT-VEH-07 (S5) | EX-VEH-05 / R1 | **Réussi** | |
| UT-04 | `VenteEtatTest` : vente sur voiture déjà vendue refusée | TC-VEH-07 | EX-VEH-05 / R1 | **Échec** | ANO-005 |
| UT-05 | `AlerteTest` : échéance du lendemain, 1 jour restant | TC-ALR-01 | EX-ALR-01 / R3 | **Échec** | ANO-004 |
| UT-06 | `AlerteTest` : véhicule vendu sans alerte | TC-ALR-04 | EX-ALR-03 / R3 | **Échec** | ANO-003 |
| UT-07 | `ReparationStockTest` : le stock diminue de 1 | TC-STK-02 | EX-STK-02 / R4 | **Réussi** | |
| UT-08 | `ReparationStockTest` : pièce sans stock refusée ou limitée | TC-STK-03 (reformulé) | EX-STK-03 / R4 | **Échec** | ANO-006 |

Un test qui échoue parce qu'il a trouvé une vraie anomalie est un résultat valide. Aucun code de l'application n'a été modifié pour faire passer un test.

## 4. Résultats d'exécution

Exécution de la suite unitaire complète le 14/11/2026 :

```
php artisan test --testsuite=Unit
Tests: 5 failed, 6 passed (15 assertions)
Duration: 1.27s
```

| Indicateur | Valeur |
|---|---|
| Tests exécutés | 11 (8 écrits en semaine 6 + 3 de départ) |
| Réussis | 6 |
| Échoués | 5, tous liés à une anomalie |
| Assertions | 15 |
| Durée | 1,27 s |

Les cinq échecs (UT-02, UT-04, UT-05, UT-06, UT-08) correspondent aux anomalies ANO-001, 005, 004, 003 et 006. Chaque test a aussi été lancé seul, avec le même résultat.

Preuves : [`S6_02`](../captures/S6_02_test_reparation_dates.png), [`S6_03`](../captures/S6_03_test_prix_negatif_echec.png), [`S6_09`](../captures/S6_09_tests_vente_etat.png), [`S6_10`](../captures/S6_10_tests_alertes.png), [`S6_11`](../captures/S6_11_tests_stock.png), [`S6_12`](../captures/S6_12_suite_complete.png).

### Messages d'échec retenus

| Test | Message observé |
|---|---|
| UT-02 | La vente à -5555 est acceptée : le test atteint `fail()` |
| UT-04 | `Failed asserting that 201 is equal to 400 or is greater than 400.` |
| UT-05 | `Failed asserting that 0 matches expected 1.` |
| UT-06 | Une alerte « Urgent » est renvoyée pour la voiture vendue (`'voiture' => 'TEST-UT-AL2 - Peugeot 208'`) |
| UT-08 | `Failed asserting that false is true.` |

### Propreté de la base

Après les tests, les tables `voitures`, `assurances`, `pieces`, `reparations` et `reparation_piece` de `alba_test` ne contiennent aucune donnée de test (compteurs à 0) : la transaction annule bien les écritures.

## 5. Anomalies confirmées par les tests

| Anomalie | Sévérité | Priorité | Test | Cause constatée dans le code |
|---|---|---|---|---|
| ANO-001 Vente à prix négatif acceptée | Critique | P1 | UT-02 | `'prix_vente' => 'required|numeric'` sans minimum |
| ANO-005 Revente d'une voiture vendue acceptée | Critique | P1 | UT-04 | Seul l'état `location` est contrôlé |
| ANO-003 Alerte pour un véhicule vendu | Majeure | P2 | UT-06 | Aucun filtre sur l'état de la voiture |
| ANO-006 Pièce sans stock acceptée | Majeure | P2 | UT-08 | La pièce est rattachée même si le stock est à 0 |
| ANO-004 Temps restant décalé d'un jour | Mineure | P3 | UT-05 | `Carbon::now()` avec l'heure et `diffInDays` tronqué |

Détails : [`registre_anomalies.md`](../04-anomalies/registre_anomalies.md).

## 6. Couverture de code

Mesure avec Xdebug (`XDEBUG_MODE=coverage`), sur le dossier `app`, suite unitaire complète.

| Périmètre | Lignes | Méthodes |
|---|---|---|
| Total `app` | **4,23 %** (85 sur 2008) | 6,40 % (13 sur 203) |
| Contrôleurs de l'API (22 fichiers) | 3,51 % (61 sur 1738) | 1,59 % |
| `VenteController` | **92,86 %** (13 sur 14) | 50 % (1 sur 2) |
| `ReparationController` | 35,59 % (21 sur 59) | 20 % |
| `AlerteController` | 21,77 % (27 sur 124) | 0 % |
| Autres contrôleurs | 0 % | 0 % |
| `Models` | 9,09 % | 7,69 % |
| `Providers` | 82,35 % | 71,43 % |

Preuves : [`S6_13`](../captures/S6_13_xdebug_installe.png), [`S6_14`](../captures/S6_14_couverture.png), [`S6_15`](../captures/S6_15_couverture_html.png), [`S6_16`](../captures/S6_16_couverture_vente_controller.png), [`S6_17`](../captures/S6_17_couverture_controllers_api.png).

### Interprétation

- **La couverture est basse parce que les tests sont ciblés** : trois contrôleurs sur vingt-deux ont des tests, choisis pour les risques les plus élevés (R1, R2, R3, R4, R10).
- **Une couverture élevée ne garantit pas l'absence de défauts.** `VenteController::store` est couvert à 100 %, et contient pourtant deux anomalies critiques (ANO-001 et ANO-005). Ce que mesure la couverture, c'est le code exécuté, pas la qualité des vérifications.
- **`AlerteController` n'est testé que pour les assurances.** Les blocs « taxe de circulation » et « visite technique » reprennent le même code copié trois fois et n'ont pas été exécutés ; d'après la lecture du code, ils portent probablement les mêmes défauts (ANO-003 et ANO-004). Cette duplication est aussi un risque de maintenance.
- **Les valeurs élevées de `Providers` et `Exceptions`** viennent du démarrage de Laravel à chaque test ; ce n'est pas du code métier testé.
- **Écart avec le plan.** Le critère de sortie de `S2` (section 10) vise indicativement 50 % ou plus des contrôleurs et modèles testés. À ce stade, ce n'est pas atteint (environ 14 % des contrôleurs). Le critère s'applique à la campagne finale : les tests d'intégration (semaine 7) et d'API (semaine 8) doivent le rattraper, ou l'écart sera documenté en semaine 10.

## 7. Ajustements du catalogue et des hypothèses

| Point | Avant | Après |
|---|---|---|
| A1 : délai d'alerte (`S3`) | 30 jours (hypothèse) | **3 jours** (Warning) et **1 jour** (Urgent), lus dans `AlerteController` ; durée à valider avec l'encadrant |
| TC-ALR-01 (`S4`) | Valeurs à 31, 30, 29 jours | Valeurs à 4, 3, 2 jours |
| TC-STK-03 (`S4`) | « Utiliser 2 pièces, stock de 1 » | « Utiliser 1 pièce, stock de 0 » (l'API ne reçoit pas de quantité) |
| TC-VEH-07 | Cas conçu et exécuté par l'interface | Confirmé au niveau serveur : ANO-005 |

## 8. Limites

- Les tests s'exécutent sur la base de test et appellent directement les méthodes des contrôleurs : ce ne sont pas des tests unitaires purs ; les routes, l'authentification et le format JSON ne sont pas couverts (semaine 8).
- Seuls les blocs « assurance » des alertes sont testés (voir section 6).
- La reformulation de TC-STK-03 résulte d'une limite de l'API (pas de quantité).
- **ANO-002** (bouton Désactiver, route introuvable) n'est couverte par aucun test unitaire : c'est un défaut de routage, à vérifier en semaine 8 avec Postman.
- Les cas TC-VEH-02 (matricule), TC-VEH-03 et TC-ALR-01 aux seuils exacts ne sont pas automatisés à ce stade.
- La couverture mesure les lignes exécutées, pas la pertinence des vérifications.

## 9. Reproduire les résultats

Prérequis : base `alba_test` synchronisée avec la structure de `alba_app` ; Xdebug installé pour la couverture.

```
cd "C:\xampp\htdocs\alba_app (2)\alba_app"
php artisan test --testsuite=Unit

set XDEBUG_MODE=coverage
php vendor\bin\phpunit --testsuite=Unit --coverage-text=docs-test\06-tests-unitaires\couverture_resume.txt
php vendor\bin\phpunit --testsuite=Unit --coverage-html docs-test\06-tests-unitaires\couverture
```

N'exécuter ces commandes que sur `alba_test` : ne jamais lancer `migrate:fresh` ni `migrate:refresh`.

## 10. Index des captures

Toutes les captures sont dans [`docs-test/captures/`](../captures/)