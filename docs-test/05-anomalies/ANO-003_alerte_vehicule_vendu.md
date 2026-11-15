# ANO-003 : Une assurance ajoutée à un véhicule vendu génère une alerte « Urgent »

| Champ | Valeur |
|---|---|
| Identifiant | ANO-003 |
| Date de détection | 13/11/2026 |
| Détectée par | Hyba Ezzar |
| Module | Documents des voitures > Assurance ; page Alertes |
| Cas de test lié | TC-ALR-04 (pas d'alerte pour un véhicule vendu) |
| Exigence / risque | EX-ALR-03 / R3 ; hypothèse A5 (un véhicule vendu ne génère plus d'alerte) |
| Environnement | Application locale `localhost:3001`, rôle admin, Chrome |
| Statut | **Nouvelle** (non corrigée) |

## 1. Résumé

Après l'ajout d'une assurance à un véhicule à l'état VENDUE, la page Alertes affiche immédiatement une alerte « Urgent » pour ce véhicule. Les 11 alertes déjà affichées concernent aussi un véhicule vendu (`12345-A-67`).

## 2. Préconditions

- Rôle administrateur connecté.
- Véhicule `90004-T-04` (Volkswagen Golf) à l'état **VENDUE** (voir ANO-001, vente enregistrée).
- Fournisseur d'assurance `Wafa` existant.

## 3. Étapes de reproduction

1. Ouvrir **Documents des voitures**, onglet **ASSURANCE**.
2. Choisir la voiture `90004-T-04`, le type « Tiers », la date de début `13/11/2026`, la date d'expiration `14/11/2026` et le fournisseur `Wafa`.
3. Cliquer sur **Enregistrer** : message « Enregistrement ajouté avec succès ! ».
4. Ouvrir la page **Alertes**.

## 4. Résultat attendu

Aucune alerte n'est affichée pour `90004-T-04`, car le véhicule est vendu (A5, EX-ALR-03).

## 5. Résultat observé

Une nouvelle ligne apparaît en bas de la liste : type **Urgent**, catégorie Assurance, voiture `90004-T-04 - Volkswagen Golf`, message « Assurance expire le 14/11/2026 », date d'expiration 14/11/2026.

## 6. Preuves

| Fichier | Contenu |
|---|---|
| [`S5_06_assurance_vehicule_vendu.png`](../captures/S5_06_assurance_vehicule_vendu.png) | Formulaire Assurance rempli et message de succès |
| [`S5_07_alerte_vehicule_vendu.png`](../captures/S5_07_alerte_vehicule_vendu.png) | Page Alertes avec la ligne de `90004-T-04` |
| [`S5_08_alertes_temps_restant.png`](../captures/S5_08_alertes_temps_restant.png) | Page Alertes : seconde alerte, pour `12345-A-67` (vendue), expirant le 16/11/2026 |

Les captures sont rangées dans [`docs-test/captures/`](../captures/).

## 7. Classification

| Critère | Valeur | Justification |
|---|---|---|
| Sévérité | **Majeure** | Alerte inutile sur un véhicule sorti du parc ; aucune donnée financière faussée ni perte de données (le plan cite l'alerte en double comme exemple de sévérité majeure) |
| Priorité | **P2** | À corriger avant la décision de livraison |
| Reproductibilité | 3 sur 3 | Deux essais manuels (semaine 5, voitures `90004-T-04` et `12345-A-67`) et le test automatisé UT-06 (semaine 6) |

## 8. Remarques et suites

- **Confirmation par test automatisé** : `tests/Unit/AlerteTest.php` (UT-06) crée une voiture à l'état `vendue` avec une assurance expirant le lendemain : `getExpirationAlerts` renvoie une alerte « Urgent » pour elle. Cause constatée dans le code : aucun filtre sur l'état de la voiture. Les blocs « taxe de circulation » et « visite technique » reprennent le même code et n'ont pas été testés. Preuve : [`S6_10_tests_alertes.png`](../captures/S6_10_tests_alertes.png).
- **Dépendance** : la règle « un véhicule vendu ne génère plus d'alerte » est l'hypothèse A5, pas une règle écrite. À confirmer avec l'encadrant ; sinon l'anomalie devient une question de spécification.
- **Origine des alertes** : la table `expiration_alerts` ne contient aucune ligne pour le 21/02/2026, alors que la page affiche des alertes à cette date. Les alertes sont donc calculées à partir des documents, et non lues dans cette table.
- **Fiche distincte** : l'affichage « Aujourd'hui » pour une échéance du lendemain est traité dans ANO-004.
- **Données de test** : cette alerte reste visible tant que l'assurance de `90004-T-04` existe ; à supprimer après la campagne.
- Après correction, rejouer TC-ALR-04 dans la suite de régression.
