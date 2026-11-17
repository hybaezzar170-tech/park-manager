# Semaine 9 – Tests et validation de l'application ALBA

## 1. Objectif
Cette semaine a pour objectif de vérifier le bon fonctionnement de l'application ALBA à l'aide de tests automatisés et d'un contrôle d'accessibilité.

## 2. Outils utilisés
- **Playwright** : automatisation des tests.
- **Chromium** : navigateur utilisé pour l'exécution.
- **Axe-core** (`@axe-core/playwright`) : analyse de l'accessibilité.

## 3. Tests réalisés

| N° | Test | Résultat |
|---|---|---|
| 1 | Connexion administrateur | PASSED |
| 2 | Création d'une maintenance | PASSED |
| 3 | Performance – temps de chargement | PASSED |
| 4 | Sécurité – refus d'une connexion incorrecte | PASSED |
| 5 | Accessibilité – page de connexion | PASSED |

## 4. Résultats obtenus
- Nombre total de tests : **5**
- Tests réussis : **5**
- Tests échoués : **0**
- Temps de chargement mesuré : **316 ms**
- Problèmes d'accessibilité détectés : **0**

## 5. Captures d'écran

Les liens ci-dessous sont relatifs au dossier `Captures/`. Placez les fichiers de capture portant exactement ces noms dans ce dossier pour que les liens fonctionnent.

1. [Test de connexion administrateur](Captures/S9_01_Test_Connexion_Administrateur.png)
2. [Test Playwright – connexion et maintenance](Captures/S9_02_Test_Playwright_Connexion_Maintenance.png)
3. [Rapport HTML Playwright](Captures/S9_03_Rapport_HTML_Playwright.png)
4. [Formulaire de maintenance](Captures/S9_04_Formulaire_Maintenance.png)
5. [Test de performance](Captures/S9_05_Test_Performance.png)
6. [Rapport final – 4 tests](Captures/S9_06_Rapport_Final_4_Tests.png)
7. [Test d'accessibilité ALBA](Captures/S9_07_Test_Accessibilite_ALBA.png)
8. [Rapport final Playwright – 5 tests réussis](Captures/S9_08_Rapport_Final_Playwright.png)

## 6. Conclusion
Les cinq tests automatisés exécutés avec Playwright ont réussi. Le temps de chargement mesuré était de 316 ms. L'analyse Axe-core de la page de connexion n'a détecté aucun problème d'accessibilité.

La validation des tests de la Semaine 9 est donc réussie.
