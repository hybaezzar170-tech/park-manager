# ANO-004 : Le temps restant d'une alerte est décalé d'un jour pour les échéances futures

| Champ | Valeur |
|---|---|
| Identifiant | ANO-004 |
| Date de détection | 13/11/2026 |
| Détectée par | Hyba Ezzar,Emna zaydoun|
| Module | Alertes |
| Cas de test lié | TC-ALR-01 (alerte à l'approche de l'échéance, temps restant correct) |
| Exigence / risque | EX-ALR-01 / R3 ; hypothèse A1 (alerte à 30 jours) |
| Environnement | Application locale `localhost:3001`, rôle admin, Chrome ; poste daté du 13/11/2026, 21:22 |
| Statut | **Nouvelle** (non corrigée) |

## 1. Résumé

Pour une échéance future, la page Alertes affiche un temps restant inférieur d'un jour à l'écart réel. Une assurance expirant le lendemain est présentée comme expirant « Aujourd'hui ».

## 2. Préconditions

- Rôle administrateur connecté.
- Date du poste : 13/11/2026 (capture de l'horloge à 21:22).

## 3. Étapes de reproduction

1. Ouvrir **Documents des voitures**, onglet **ASSURANCE**.
2. Enregistrer une assurance expirant le `14/11/2026` (voiture `90004-T-04`).
3. Enregistrer une assurance expirant le `16/11/2026` (voiture `12345-A-67`).
4. Ouvrir la page **Alertes**.

## 4. Résultat attendu

- Échéance du 14/11/2026 : 1 jour restant (« Demain » ou « Dans 1 jour(s) »).
- Échéance du 16/11/2026 : « Dans 3 jour(s) ».

## 5. Résultat observé

- Échéance du 14/11/2026 : « **Aujourd'hui** ».
- Échéance du 16/11/2026 : « **Dans 2 jour(s)** » (alerte « Warning »).
- Pour les échéances passées, l'affichage est cohérent : 21/02/2026 est affiché « Expiré depuis 265 jour(s) », ce qui correspond bien à l'écart réel avec le 13/11/2026.

## 6. Preuves



Les captures sont rangées dans [`docs-test/captures/`](../captures/).


## 7. Classification

| Critère | Valeur | Justification |
|---|---|---|
| Sévérité | **Mineure** | Information erronée mais la date d'expiration affichée à côté reste correcte ; aucune donnée n'est faussée. Le code compare ce nombre aux seuils de 3 et 1 jours : le décalage fait déclencher chaque niveau un jour plus tôt, dans le sens prudent (jamais plus tard), d'où le maintien en Mineure |
| Priorité | **P3** | Peut être différée et documentée |
| Reproductibilité | 3 sur 3 | Deux mesures manuelles (semaine 5) et le test automatisé UT-05, horloge figée (semaine 6) |

## 8. Remarques et suites

- **Cause confirmée** : dans `AlerteController::getExpirationAlerts`, `Carbon::now()` conserve l'heure et `diffInDays($expirationDate, false)` tronque le résultat : le 14/11 à minuit moins le 13/11 à 21:22 donne 0 jour. Le test `tests/Unit/AlerteTest.php` (UT-05, horloge figée à cet instant) reçoit `days_remaining = 0` au lieu de 1. Preuve : [`S6_10_tests_alertes.png`](../captures/S6_10_tests_alertes.png).
- **Seuils réels** : le code déclenche l'alerte à 3 jours (Warning) et à 1 jour (Urgent), et non à 30 jours (l'hypothèse A1 est corrigée en semaine 6). Avec le décalage, une échéance à J+1 est présentée comme « Aujourd'hui ». Le même calcul est répété pour les taxes de circulation et les visites techniques, non testées.
- Après correction, rejouer TC-ALR-01 dans la suite de régression.
