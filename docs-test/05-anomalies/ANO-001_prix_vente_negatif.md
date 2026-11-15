# ANO-001 : Une vente avec un prix négatif est acceptée

| Champ | Valeur |
|---|---|
| Identifiant | ANO-001 |
| Date de détection | 13/11/2026 |
| Détectée par | Hyba Ezzar et emna zaydoun|
| Module | Contrats > Vente |
| Cas de test lié | TC-CTR-03 (valeurs limites du prix de vente) |
| Exigence / risque | EX-CTR-03 / R2 ; hypothèse A4 (prix de vente strictement positif) |
| Environnement | Application locale `localhost:3001`, rôle admin, navigateur Chrome |
| Statut | **Nouvelle** (non corrigée ; cycle de vie de `S2_plan_de_test.md`, section 11) |

## 1. Résumé

Le formulaire de vente enregistre une vente dont le prix est **négatif** (-5555 DT). Aucun message d'erreur n'est affiché, la vente est enregistrée et la voiture passe à l'état VENDUE.

## 2. Préconditions

- Rôle administrateur connecté.
- Une voiture à l'état DISPONIBLE : `90004-T-04` (Volkswagen Golf, département Navette Aéroport).
- Un client existant : `ayed ahmed`.

## 3. Étapes de reproduction

1. Ouvrir **Contrats**, puis l'onglet **VENTE**.
2. Choisir le département « Navette Aéroport », puis la voiture `90004-T-04`.
3. Choisir le client `ayed ahmed`.
4. Saisir le prix de vente `-5555` et la date `06/11/2026`.
5. Cliquer sur **Valider**.

## 4. Résultat attendu

La vente est refusée avec un message d'erreur (prix strictement positif, A4). Aucune vente n'est créée et la voiture reste DISPONIBLE.

## 5. Résultat observé

- Message « Vente enregistrée ».
- La fiche de la voiture affiche l'état **VENDUE** et, dans la section Ventes, une transaction à **-5555.00 DT** datée du 06/11/2026.

## 6. Preuves

| Preuve | Contenu |
|---|---|
| [`S5_01_vente_prix_negatif.png`](../captures/S5_01_vente_prix_negatif.png) | Formulaire rempli avec le prix -5555 et message « Vente enregistrée » |
| [`S5_02_fiche_vente_negative.png`](../captures/S5_02_fiche_vente_negative.png) | Fiche de `90004-T-04` : état VENDUE, vente à -5555.00 DT |

Les captures sont rangées dans [`docs-test/captures/`](../captures/),## 7. Classification

| Critère | Valeur | Justification |
|---|---|---|
| Sévérité | **Critique** | Définition du plan (`S2`, section 11) : donnée financière ou règle métier essentielle violée. Une vente à prix négatif est enregistrée et la voiture passe dans un état final (VENDUE) sans retour possible depuis l'interface |
| Priorité | **P1** | À corriger avant la campagne finale : le plan (`S2`, section 12) classe un montant incohérent accepté sans contournement parmi les motifs de refus de livraison |
| Reproductibilité | 2 sur 2 | Reproduite manuellement (semaine 5), puis par le test automatisé UT-02 (semaine 6) ; les prix `0` et `-1` restent à tester |

Les échelles de sévérité et de priorité sont celles de `S2_plan_de_test.md`, section 11.

## 8. Remarques et suites

- **Confirmation par test automatisé** : `tests/Unit/VentePrixTest.php` (UT-02) appelle `VenteController::store` avec un prix de -5555 : la vente est acceptée. Cause constatée dans le code : la règle de validation est `'prix_vente' => 'required|numeric'`, sans valeur minimale. Preuve : [`S6_03_test_prix_negatif_echec.png`](../captures/S6_03_test_prix_negatif_echec.png).
- Le prix vide est bloqué, mais seulement par la validation du navigateur ; le contrôle côté serveur n'est pas vérifié.
- Les prix `0` et `-1` n'ont pas été testés : à exécuter sur une nouvelle voiture de test.
- À rejouer en semaine 8 avec Postman (`POST /api/ventes`, prix négatif) pour savoir si le serveur refuse la valeur.
- Tant que cette anomalie est ouverte sans contournement, la décision de livraison est un **refus** (`S2`, section 12).
- Après correction, rejouer TC-CTR-03 dans la suite de régression.
