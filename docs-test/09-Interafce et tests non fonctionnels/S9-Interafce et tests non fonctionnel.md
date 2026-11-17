# S9 — Rapport des tests automatisés et de validation de l’application ALBA

| Champ | Valeur |
|---|---|
| Identifiant | S9-TESTS-PLAYWRIGHT |
| Date d’exécution | 17/11/2026 |
| Réalisé par | À compléter |
| Application | ALBA — PARK MANAGER |
| Module | Tests automatisés, performance, sécurité et accessibilité |
| Outil de test | Playwright |
| Navigateur | Chromium |
| Outil d’accessibilité | Axe-core (`@axe-core/playwright`) |
| Environnement | Frontend React, backend Laravel |
| URL du frontend | `http://localhost:3001` |
| URL du backend | `http://127.0.0.1:8000` |
| Statut global | **Tests exécutés et validés — 5/5 Passed** |

## 1. Résumé

Cette campagne de tests a pour objectif de vérifier le bon fonctionnement de l’application ALBA — PARK MANAGER. Les tests automatisés ont été réalisés avec Playwright dans le navigateur Chromium.

La campagne couvre la connexion administrateur, la création d’une maintenance, le temps de chargement de l’application, le refus d’une connexion avec un mot de passe incorrect et l’accessibilité de la page de connexion.

## 2. Préconditions

- Le frontend React est démarré sur `http://localhost:3001`.
- Le backend Laravel est démarré sur `http://127.0.0.1:8000`.
- Les dépendances du projet sont installées avec npm.
- Playwright et le navigateur Chromium sont installés.
- Le package `@axe-core/playwright` est installé.
- Un compte administrateur de test est disponible.
- La base de données contient les données nécessaires au test de création d’une maintenance.

## 3. Organisation et exécution des tests

Les tests sont regroupés dans le fichier `tests/example.spec.js`.

| N° | Test | Vérifications principales |
|---|---|---|
| 1 | Connexion administrateur ALBA | Connexion avec les identifiants de test et affichage de l’espace administrateur |
| 2 | Création d’une maintenance ALBA | Remplissage du formulaire et vérification de l’affichage de la maintenance |
| 3 | Performance — temps de chargement ALBA | Mesure du temps nécessaire à l’affichage du formulaire de connexion |
| 4 | Sécurité — refus connexion incorrecte | Vérification que le formulaire reste accessible après une tentative avec un mot de passe incorrect |
| 5 | Accessibilité — page de connexion ALBA | Analyse de la page avec Axe-core et vérification des violations détectées |

Commande utilisée pour exécuter toute la suite :

```powershell
npx playwright test --project=chromium --workers=1
```

## 4. Résultats attendus

- Une connexion administrateur valide doit permettre d’accéder à l’espace administrateur.
- Le formulaire de maintenance doit pouvoir être rempli et soumis correctement.
- Le temps de chargement doit rester inférieur à la limite définie dans le test automatisé.
- Une connexion avec un mot de passe incorrect ne doit pas donner accès à l’espace administrateur.
- L’analyse Axe-core ne doit détecter aucune violation d’accessibilité sur la page de connexion.

## 5. Résultats observés

La suite complète a été exécutée avec Playwright et Chromium. Le résultat affiché dans le terminal est :

```text
Running 5 tests using 1 worker
Temps de chargement ALBA : 316 ms
Nombre de problèmes d accessibilité : 0
5 passed (10.9s)
```

| Critère | Résultat observé |
|---|---|
| Nombre total de tests | **5** |
| Tests réussis | **5** |
| Tests échoués | **0** |
| Temps de chargement mesuré | **316 ms** |
| Violations d’accessibilité détectées | **0** |
| Statut global | **Passed** |

Une violation d’accessibilité liée à l’absence de repère de région (`region`) avait été détectée lors du premier contrôle. Le contenu de la page de connexion a été placé dans un élément sémantique `<main>`. Après cette correction, l’analyse Axe-core a détecté zéro violation.

## 6. Preuves

Les captures d’écran sont placées dans le dossier `captures`, situé au même niveau que ce rapport. Les liens ci-dessous utilisent le chemin relatif `captures/`.

| Fichier | Contenu |
|---|---|
| [`S9_01_Test_Connexion_Administrateur.png`](captures/S9_01_Test_Connexion_Administrateur.png) | Test de connexion administrateur |
| [`S9_02_Test_Playwright_Connexion_Maintenance.png`](captures/S9_02_Test_Playwright_Connexion_Maintenance.png) | Exécution des tests de connexion et de maintenance |
| [`S9_03_Rapport_HTML_Playwright.png`](captures/S9_03_Rapport_HTML_Playwright.png) | Rapport HTML généré par Playwright |
| [`S9_04_Formulaire_Maintenance.png`](captures/S9_04_Formulaire_Maintenance.png) | Formulaire de création d’une maintenance |
| [`S9_05_Test_Performance.png`](captures/S9_05_Test_Performance.png) | Résultat du test de performance |
| [`S9_06_Rapport_Final_4_Tests.png`](captures/S9_06_Rapport_Final_4_Tests.png) | Rapport intermédiaire affichant les quatre premiers tests |
| [`S9_07_Test_Accessibilite.png`](captures/S9_07_Test_Accessibilite.png) | Résultat du test d’accessibilité |
| [`S9_08_Rapport_Final_Playwright.png`](captures/S9_08_Rapport_Final_Playwright.png) | Rapport final montrant les cinq tests réussis |

## 7. Bilan

| Critère | Résultat | Commentaire |
|---|---|---|
| Connexion administrateur | **Validé** | Le test automatisé a réussi |
| Création d’une maintenance | **Validé** | Le test automatisé a réussi |
| Performance | **Validé** | Temps mesuré : 316 ms |
| Sécurité de connexion | **Validé** | La tentative avec un mot de passe incorrect est refusée |
| Accessibilité | **Validé** | Aucune violation détectée après correction |
| Exécution globale | **Validé** | 5 tests réussis sur 5 |

## 8. Conclusion

La campagne de tests de la Semaine 9 a permis de vérifier plusieurs aspects importants de l’application ALBA — PARK MANAGER : l’authentification, la création d’une maintenance, la performance, la sécurité de connexion et l’accessibilité.

Les cinq tests automatisés ont réussi. Le temps de chargement mesuré était de 316 ms et l’analyse Axe-core n’a détecté aucune violation d’accessibilité après la correction du repère `<main>`.

Les captures d’écran associées constituent les preuves de l’exécution et des résultats de cette campagne.
