# ANO-002 : Le bouton Désactiver d'une voiture échoue (PUT 404)

| Champ | Valeur |
|---|---|
| Identifiant | ANO-002 |
| Date de détection | 13/11/2026 |
| Détectée par | Hyba Ezzar et emna zaydoun |
| Module | Voiture > Catalogue des voitures |
| Cas de test lié | TC-VEH-10 (nouveau, issu de la session exploratoire ; à ajouter au catalogue S4) |
| Exigence / risque | EX-VEH-01 (désactiver un véhicule) / R13 (codes HTTP et gestion des erreurs de l'API) |
| Environnement | Application locale `localhost:3001` (React) et API `localhost:8000` (Laravel), rôle admin, Chrome |
| Statut | **Nouvelle** (non corrigée) |

## 1. Résumé

Un clic sur **Désactiver** dans le catalogue des voitures affiche « Erreur lors de la désactivation de la voiture ». La console du navigateur montre que la requête `PUT` envoyée par `GestionVoitures.jsx` (ligne 259) vers l'API reçoit un **404 (Not Found)**.

## 2. Préconditions

- Rôle administrateur connecté.
- Une voiture présente dans le catalogue.

## 3. Étapes de reproduction

1. Ouvrir la console du navigateur (F12), onglet Console.
2. Ouvrir **Voiture** pour afficher le catalogue des voitures.
3. Cliquer sur **Désactiver** sur une voiture de la liste.
4. Observer la fenêtre d'alerte et la console.

## 4. Résultat attendu

La voiture est désactivée, le catalogue reflète son nouvel état et un message de confirmation s'affiche (EX-VEH-01).

## 5. Résultat observé

- Alerte « Erreur lors de la désactivation de la voiture ».
- Console : `PUT http://localhost:8000/api/voitures/2/desactiv…` (fin de l'URL tronquée à l'écran) → **404 (Not Found)**, émis par `GestionVoitures.jsx:259`.
- Après l'erreur, la voiture concernée (identifiant 2, ligne `98765-B-89` du catalogue) reste **DISPONIBLE** : aucune désactivation n'a eu lieu.
- Le bouton a produit la même erreur lors de deux essais distincts (captures de deux moments différents de la session).

## 6. Preuves

| Fichier | Contenu |
|---|---|
| [`S5_03_desactiver_erreur.png`](../captures/S5_03_desactiver_erreur.png) | Alerte « Erreur lors de la désactivation de la voiture » |
| [`S5_04_console_404.png`](../captures/S5_04_console_404.png) | Console : `PUT /api/voitures/2/desactiv… 404 (Not Found)`, `GestionVoitures.jsx:259` |
| [`S5_05_voiture_inchangee.png`](../captures/S5_05_voiture_inchangee.png) | Ligne `98765-B-89` toujours DISPONIBLE après l'erreur |

Les captures sont à placer dans `docs-test/captures/`
## 7. Classification

| Critère | Valeur | Justification |
|---|---|---|
| Sévérité | **Majeure** | Une fonction du catalogue est inutilisable, sans perte ni corruption de données ; l'existence d'un contournement n'est pas vérifiée (voir section 8) |
| Priorité | **P2** | À corriger avant la décision de livraison |
| Reproductibilité | 2 essais sur 2 | Même message et même erreur |

## 8. Analyse et suites

- **Hypothèse de cause** (non confirmée) : l'URL appelée commence par `/api/voitures/2/desactiv…`, or `routes/api.php` ne déclare pour `voitures` que `apiResource` et `voitures/{id}/details` (des routes `toggle-etat` existent seulement pour `departements` et `conducteurs`). La route appelée par le frontend n'existe vraisemblablement pas côté serveur.
- **À compléter** : la fin exacte de l'URL (onglet Réseau, F12, colonne Nom).
- **À vérifier** : existe-t-il un autre moyen de désactiver une voiture (formulaire de modification) ? Si oui, noter le contournement et ajuster la sévérité si besoin.
- **API** : rejouer la requête avec Postman en semaine 8 pour confirmer le 404 hors interface.
- **Semaine 6** : cette anomalie n'est couverte par aucun test unitaire. Elle vient d'une route absente et non d'une règle d'un contrôleur ; elle sera vérifiée avec Postman en semaine 8.
- Après correction, ajouter TC-VEH-10 à la suite de régression.
