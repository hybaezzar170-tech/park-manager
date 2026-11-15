# ANO-006 : Une réparation peut utiliser une pièce dont le stock est à 0

| Champ | Valeur |
|---|---|
| Identifiant | ANO-006 |
| Date de détection | 14/11/2026 |
| Détectée par | emna zaydoun et Hyba Ezzar (test automatisé UT-08) |
| Module | Paramétrage > Réparations (`ReparationController::store`) |
| Cas de test lié | TC-STK-03, reformulé (pièce sans stock) |
| Exigence / risque | EX-STK-03 / R4 ; règle RG7 |
| Environnement | PHP 8.1.2, PHPUnit 10.5.60, Laravel 10, base de test `alba_test` |
| Statut | **Nouvelle** (non corrigée) |

## 1. Résumé

Une réparation qui utilise une pièce dont le stock est à 0 est **acceptée** (code 201) et la pièce est rattachée à la réparation, alors qu'aucune quantité n'est décrémentée. Le critère d'acceptation EX-STK-03 attend un refus ou une limitation.

## 2. Préconditions

- Base de test `alba_test` synchronisée avec `alba_app`.
- Une pièce dont la quantité en stock est `0`.

## 3. Étapes de reproduction

Test automatisé : `tests/Unit/ReparationStockTest.php`, méthode `test_reparation_avec_une_piece_sans_stock_est_refusee_ou_limitee`.

1. Créer une pièce avec `quantite = 0` dans `alba_test`.
2. Appeler `ReparationController::store` avec une réparation valide et `pieces_utilisees = [id de la pièce]`.
3. Lire le code HTTP et chercher la pièce dans la table `reparation_piece`.

Commande :
```
php artisan test --filter=ReparationStockTest
```

## 4. Résultat attendu

La réparation est refusée, ou la pièce n'est pas rattachée à la réparation (EX-STK-03 : « refusée ou limitée »).

## 5. Résultat observé

La réparation est acceptée et la pièce est rattachée. Message du test :

```
Une pièce sans stock ne doit pas être utilisée par une réparation (EX-STK-03).
Failed asserting that false is true.
```

Le test témoin réussit : avec un stock de 25, l'utilisation d'une pièce fait passer le stock à 24 (TC-STK-02). Le stock ne devient jamais négatif.

## 6. Preuves

| Fichier | Contenu |
|---|---|
| [`S6_11_tests_stock.png`](../captures/S6_11_tests_stock.png) | `ReparationStockTest` : 1 réussi (décrément), 1 échec (pièce sans stock) |
| [`S6_12_suite_complete.png`](../captures/S6_12_suite_complete.png) | Suite complète : le même échec est reproduit |



## 7. Classification

| Critère | Valeur | Justification |
|---|---|---|
| Sévérité | **Majeure** | Le stock reste cohérent (jamais négatif) mais une pièce absente est enregistrée comme utilisée : historique de réparation faux et risque d'intervention impossible ; pas de donnée financière ni de perte de données |
| Priorité | **P2** | À corriger avant la décision de livraison |
| Reproductibilité | 2 exécutions sur 2 | Test lancé seul, puis dans la suite complète |

## 8. Analyse et suites

- **Cause constatée** dans le code : la pièce n'est décrémentée que si `quantite > 0`, mais elle est rattachée à la réparation (`attach`) dans tous les cas.
- **Reformulation du cas S4** : le cas initial « utiliser 2 pièces avec un stock de 1 » n'est pas réalisable, car l'API ne reçoit aucune quantité (chaque pièce vaut 1 unité). Il devient « utiliser 1 pièce avec un stock de 0 ».
- **Hypothèse à vérifier en semaine 7** (non testée) : à la modification ou à la suppression de cette réparation, le code remet `+1` en stock pour chaque pièce rattachée, y compris celles qui n'avaient pas été décrémentées. Le stock pourrait alors augmenter sans achat réel.
- Après correction, rejouer TC-STK-03 dans la suite de régression.
