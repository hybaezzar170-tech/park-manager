# ANO-007 : Le serveur accepte la vente d'une voiture en location

| Champ | Valeur |
|---|---|
| Identifiant | ANO-007 |
| Date de détection | 15/11/2026 |
| Détectée par | Hyba Ezzar et emna zaydoun  |
| Module | Contrats > Vente (`VenteController::store`) |
| Cas de test lié | Transition TT-VEH-07 de la semaine 5 ; table de décision de `S4` (ligne EN LOCATION, vente refusée, hypothèse) |
| Exigence / risque | R1 (vendre un véhicule déjà en location) ; règle RG3 par analogie ; l'intention du code est de refuser ce cas (message « Voiture en location ») |
| Environnement | PHP 8.1.2, PHPUnit 10.5.60, Laravel 10, base de test `alba_test` |

## 1. Résumé

`VenteController::store` refuse la vente d'une voiture dont l'état vaut `location`. Or l'application n'écrit jamais cette valeur : une voiture louée porte l'état `en_location` (deux voitures dans `alba_app`, et `VoitureController` utilise cette valeur). Le contrôle ne se déclenche donc jamais et la vente d'une voiture en location est enregistrée (code HTTP 201).

L'interface masque les voitures en location dans le formulaire de vente, ce qui cache le défaut sans le corriger.

## 2. Préconditions

- Base de test `alba_test` synchronisée avec `alba_app`.
- Une voiture à l'état `en_location`, un client existant.

## 3. Étapes de reproduction

Test automatisé : `tests/Unit/VenteEtatTest.php`, méthode `test_vente_sur_voiture_en_location_est_refusee`.

1. Créer une voiture à l'état `en_location` et un client dans `alba_test`.
2. Appeler `VenteController::store` avec cette voiture, ce client, un prix valide (`25000`) et une date.
3. Lire le code HTTP renvoyé.

Commande :
```
php artisan test --filter=VenteEtatTest
```

## 4. Résultat attendu

La vente est refusée (code 400 ou plus) et aucune vente n'est enregistrée.

## 5. Résultat observé

Le contrôleur renvoie le code **201** et enregistre la vente. Message du test :

```
Une voiture en location ne doit pas pouvoir être vendue (ANO-007).
Failed asserting that 201 is equal to 400 or is greater than 400.
```

## 6. Preuves

| Fichier | Contenu |
|---|---|
| [`S7_03_etats_alba_app.png`](../captures/S7_03_etats_alba_app.png) | États réels dans `alba_app` : `disponible` (8), `en_location` (2), `vendue` (5) ; aucune voiture à l'état `location` |
| [`S6_09_tests_vente_etat.png`](../captures/S6_09_tests_vente_etat.png) | `VenteEtatTest` : 2 échecs (en location, déjà vendue), 1 réussite (vente valide) |


## 7. Classification

| Critère | Valeur | Justification |
|---|---|---|
| Sévérité | **Critique** | Risque R1 de niveau 9 : une voiture louée peut être vendue, ce qui crée une double transaction ; règle métier essentielle violée (`S2`, section 11) |
| Priorité | **P1** | À corriger avant la campagne finale (`S2`, section 12 : règle métier essentielle non satisfaite sans contournement serveur) |
| Reproductibilité | 1 exécution sur 1 | Test lancé seul ; à reconfirmer par la suite complète |

