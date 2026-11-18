# Registre des anomalies : Park Manager

| Élément | Valeur |
|---|---|
| Version | 1.4 (semaines 6 et 7) |
| Date | 17/11/2026 |
| Auteure | Hyba Ezzar |
| Références | Échelles de sévérité et de priorité : `S2_plan_de_test.md`, section 11 |

## 1. Registre

| ID | Titre | Cas lié | Exigence / risque | Sévérité | Priorité | Statut | Reproductibilité | Fiche | Preuves |
|---|---|---|---|---|---|---|---|---|---|
| ANO-001 | Une vente avec un prix négatif est acceptée | TC-CTR-03 | EX-CTR-03 / R2 | Critique | P1 | Nouvelle | 2 sur 2 | [`ANO-001_prix_vente_negatif.md`](ANO-001_prix_vente_negatif.md) | [S5_01](../captures/S5_01_vente_prix_negatif.png), [S5_02](../captures/S5_02_fiche_vente_negative.png), [S6_03](../captures/S6_03_test_prix_negatif_echec.png) |
| ANO-002 | Le bouton Désactiver d'une voiture échoue (PUT 404) | TC-VEH-10 | EX-VEH-01 / R13 | Majeure | P2 | Nouvelle | 2 sur 2 | [`ANO-002_desactiver_voiture_404.md`](ANO-002_desactiver_voiture_404.md) | [S5_03](../captures/S5_03_desactiver_erreur.png), [S5_04](../captures/S5_04_console_404.png), [S5_05](../captures/S5_05_voiture_inchangee.png) |
| ANO-003 | Une assurance ajoutée à un véhicule vendu génère une alerte | TC-ALR-04 | EX-ALR-03 / R3 | Majeure | P2 | Nouvelle | 3 sur 3 | [`ANO-003_alerte_vehicule_vendu.md`](ANO-003_alerte_vehicule_vendu.md) | [S5_06](../captures/S5_06_assurance_vehicule_vendu.png), [S5_07](../captures/S5_07_alerte_vehicule_vendu.png), [S6_10](../captures/S6_10_tests_alertes.png) |
| ANO-004 | Le temps restant d'une alerte est décalé d'un jour | TC-ALR-01 | EX-ALR-01 / R3 | Mineure | P3 | Nouvelle | 3 sur 3 | [`ANO-004_temps_restant_alerte_decale.md`](ANO-004_temps_restant_alerte_decale.md) | [S5_08](../captures/S5_08_alertes_temps_restant.png), [S5_09](../captures/S5_09_heure_poste.png), [S6_10](../captures/S6_10_tests_alertes.png) |
| ANO-005 | Le serveur accepte la vente d'une voiture déjà vendue | TC-VEH-07 | EX-VEH-05 / R1 | Critique | P1 | Nouvelle | 2 sur 2 | [`ANO-005_revente_voiture_vendue.md`](ANO-005_revente_voiture_vendue.md) | [S6_09](../captures/S6_09_tests_vente_etat.png), [S6_12](../captures/S6_12_suite_complete.png) |
| ANO-006 | Une réparation peut utiliser une pièce dont le stock est à 0 | TC-STK-03 | EX-STK-03 / R4 | Majeure | P2 | Nouvelle | 2 sur 2 | [`ANO-006_piece_sans_stock.md`](ANO-006_piece_sans_stock.md) | [S6_11](../captures/S6_11_tests_stock.png), [S6_12](../captures/S6_12_suite_complete.png) |
| ANO-007 | Le serveur accepte la vente d'une voiture en location | Table de décision S4 (EN LOCATION) | R1 | Critique | P1 | Nouvelle | 1 sur 1 | [`ANO-007_vente_voiture_en_location.md`](ANO-007_vente_voiture_en_location.md) | [S7_03](../captures/S7_03_etats_alba_app.png), [S6_09](../captures/S6_09_tests_vente_etat.png) |
| ANO-008 | La base n'impose pas l'unicité du matricule | TC-VEH-02, TC-VEH-03 | EX-VEH-02 / R8 | Mineure | P3 | Nouvelle | 1 sur 1 | [`ANO-008_index_unique_matricule.md`](ANO-008_index_unique_matricule.md) | [S7_02](../captures/S7_02_index_uniques.png), [S7_06](../captures/S7_06_tests_integrite.png) |
| ANO-009 | Supprimer une voiture laisse des ventes orphelines | Intégrité (IT-04) | R11 | Majeure | P2 | Nouvelle | 1 sur 1 | [`ANO-009_ventes_orphelines.md`](ANO-009_ventes_orphelines.md) | [S7_01](../captures/S7_01_cles_etrangeres.png), [S7_06](../captures/S7_06_tests_integrite.png) |
| ANO-010 | L'API est accessible sans authentification | TC-SEC-03 | EX-SEC-02 / R5 | Critique | P1 | Nouvelle | 3 sur 3 | [`ANO-010_api_sans_authentification.md`](ANO-010_api_sans_authentification.md) | [S7_04](../captures/S7_04_test_crud_voiture.png), [S7_07](../captures/S7_07_tests_ouvriers.png) |
| ANO-011 | Deux ouvriers peuvent partager le même e-mail | TC-OUV-02 | EX-OUV-02 / R8 | Majeure | P2 | Nouvelle | 1 sur 1 | [`ANO-011_email_ouvrier_duplique.md`](ANO-011_email_ouvrier_duplique.md) | [S7_07](../captures/S7_07_tests_ouvriers.png), [S7_02](../captures/S7_02_index_uniques.png) |
| ANO-012 | Supprimer une réparation faite sans stock augmente le stock | TC-STK-03 | EX-STK-02, EX-STK-03 / R4 | Majeure | P2 | Nouvelle | 1 sur 1 | [`ANO-012_stock_gonfle_suppression_reparation.md`](ANO-012_stock_gonfle_suppression_reparation.md) | [S7_08](../captures/S7_08_tests_stock_integration.png), [S7_10](../captures/S7_10_proprete_ouvriers_stock.png) |

## 2. Synthèse

| Sévérité | Nombre |
|---|---|
| Bloquante | 0 |
| Critique | 4 (ANO-001, ANO-005, ANO-007, ANO-010) |
| Majeure | 6 (ANO-002, ANO-003, ANO-006, ANO-009, ANO-011, ANO-012) |
| Mineure | 2 (ANO-004, ANO-008) |
| Cosmétique | 0 |

## 3. Impact provisoire sur la décision de livraison

Le plan de test (`S2`, section 12) classe parmi les motifs de refus de livraison une règle métier essentielle non satisfaite sans contournement, avec pour exemples « double vente possible » et « montant incohérent accepté ». Quatre anomalies correspondent à ces motifs de refus (règle métier essentielle non satisfaite, ou faille de sécurité majeure) :

- **ANO-005** : le serveur accepte la revente d'une voiture déjà vendue ;
- **ANO-010** : l'API est accessible sans authentification (accès aux données sans connexion) ;
- **ANO-007** : le serveur accepte la vente d'une voiture en location ;
- **ANO-001** : le serveur accepte un prix de vente négatif.

Tant qu'elles sont ouvertes, la décision à ce stade serait un **refus de livraison**. Cette appréciation est provisoire et sera réévaluée en semaine 10, après correction et rejeu des tests.

ANO-003 dépend de l'hypothèse A5 (un véhicule vendu ne génère plus d'alerte), à confirmer avec l'encadrant.

## 4. Observations non retenues comme anomalies (semaines 5 et 6)

| Observation | Raison |
|---|---|
| Deux lignes identiques « Assurance a expiré le 21/02/2026 » | Deux assurances distinctes en base ; une alerte par document, conforme |
| Date affichée au format brut `2026-11-29T00:00:00.000000Z` (fiches maintenance et location) | Défaut d'affichage cosmétique récurrent, non encore reproduit de façon contrôlée |
| Prix de 5 856 449 846 894 DT (vente) et 64 646 464 DT (location) acceptés | Aucune borne haute définie (A4) |
| Marque « Renault » avec le modèle « Peugeot 208 » acceptée | Aucune règle de cohérence définie |
| Location datée du futur : voiture EN LOCATION dès la validation | Hypothèse A11 en attente de confirmation |
| Deux assurances de même type qui se chevauchent acceptées | Hypothèse A12 en attente de confirmation |
| Supprimer un ouvrier lié à une réparation conserve la réparation (clé `SET NULL`) ; l'identité du mécanicien est perdue | IT-05 réussi : historique conservé (A8) ; information perdue à documenter |
| `App\Models\Vente` rangée dans `vente.php` (minuscules), `UserControllerSimple.php` qui déclare `UserController`, `ReclamationController` mal rangé | Avertissements de Composer : portabilité Linux et structure, mineur ; traité dans le rapport de la semaine 7 |
| Blocs « taxe de circulation » et « visite technique » de `AlerteController` | Même code que le bloc « assurance », non testé ; défauts probables (ANO-003, ANO-004), à confirmer |

## 5. Étiquettes proposées pour GitHub Issues

Les noms d'étiquette suivent les niveaux de `S2` : `sévérité: bloquante`, `sévérité: critique`, `sévérité: majeure`, `sévérité: mineure`, `sévérité: cosmétique`, `priorité: P1`, `priorité: P2`, `priorité: P3`, ainsi que `semaine-5`, `semaine-6` ou `semaine-7` selon la détection.

| Issue | Titre | Étiquettes |
|---|---|---|
| ANO-001 | [ANO-001] Vente avec prix négatif acceptée | `sévérité: critique`, `priorité: P1`, `semaine-5` |
| ANO-002 | [ANO-002] Désactiver une voiture : PUT 404 | `sévérité: majeure`, `priorité: P2`, `semaine-5` |
| ANO-003 | [ANO-003] Alerte générée pour un véhicule vendu | `sévérité: majeure`, `priorité: P2`, `semaine-5` |
| ANO-004 | [ANO-004] Temps restant des alertes décalé d'un jour | `sévérité: mineure`, `priorité: P3`, `semaine-5` |
| ANO-005 | [ANO-005] Le serveur accepte la revente d'une voiture vendue | `sévérité: critique`, `priorité: P1`, `semaine-6` |
| ANO-006 | [ANO-006] Réparation avec une pièce sans stock acceptée | `sévérité: majeure`, `priorité: P2`, `semaine-6` |
| ANO-007 | [ANO-007] Le serveur accepte la vente d'une voiture en location | `sévérité: critique`, `priorité: P1`, `semaine-7` |
| ANO-008 | [ANO-008] Pas d'index unique sur le matricule des voitures | `sévérité: mineure`, `priorité: P3`, `semaine-7` |
| ANO-009 | [ANO-009] Supprimer une voiture laisse des ventes orphelines | `sévérité: majeure`, `priorité: P2`, `semaine-7` |
| ANO-010 | [ANO-010] L'API est accessible sans authentification | `sévérité: critique`, `priorité: P1`, `semaine-7` |
| ANO-011 | [ANO-011] Deux ouvriers peuvent partager le même e-mail | `sévérité: majeure`, `priorité: P2`, `semaine-7` |
| ANO-012 | [ANO-012] Supprimer une réparation sans stock augmente le stock | `sévérité: majeure`, `priorité: P2`, `semaine-7` |

Le corps de chaque issue peut reprendre les sections « Étapes de reproduction », « Résultat attendu » et « Résultat observé » de la fiche correspondante.
