\# Rapport de tests et validation — Semaine 10



\*\*Projet :\*\* Park Manager (ALBA)  

\*\*Module :\*\* Atelier Test et Validation des Logiciels  

\*\*Niveau :\*\* Licence 3 — Technologies de l'Information  

\*\*Semaine :\*\* 10  

\*\*Date :\*\* 18/11/2026



\## 1. Objectif de la semaine



La semaine 10 est consacrée à la correction des anomalies détectées pendant les semaines précédentes et à la réalisation des tests de régression.



L'objectif est de vérifier que les corrections apportées n'introduisent pas de nouvelles erreurs et que les fonctionnalités précédemment testées continuent de fonctionner correctement.



\## 2. Corrections réalisées



Les anomalies suivantes ont fait l'objet de corrections et de tests de vérification :



| Anomalie | Problème traité | Vérification |

|---|---|---|

| ANO-001 | Acceptation d'un prix de vente négatif | Test unitaire |

| ANO-003 | Alerte d'assurance pour un véhicule vendu | Test unitaire |

| ANO-004 | Calcul incorrect des jours restants | Test unitaire |

| ANO-005 | Revente d'un véhicule déjà vendu | Test unitaire |

| ANO-006 | Réparation avec une pièce sans stock | Tests unitaires et intégration |

| ANO-007 | Vente d'un véhicule en location | Test unitaire |

| ANO-008 | Absence de contrainte d'unicité sur le matricule | Test d'intégration |

| ANO-009 | Suppression d'un véhicule avec historique de ventes | Test d'intégration |

| ANO-010 | Accès non authentifié aux routes API | Tests Postman |

| ANO-011 | Acceptation d'emails ouvriers en double | Test d'intégration |

| ANO-012 | Restauration incorrecte du stock après suppression d'une réparation | Test d'intégration |





\## 3. Tests de régression exécutés



\### 3.1 Tests PHPUnit



Les tests unitaires et d'intégration ont été relancés après les corrections.



\*\*Résultat :\*\*

\- Tests réussis : 21

\- Tests échoués : 0

\- Assertions : 47



\*\*Statut :\*\* Succès.



\### 3.2 Tests API avec Postman



Les scénarios suivants ont été vérifiés :



\- Accès à l'API sans authentification : refusé avec le code HTTP 401.

\- Connexion avec des identifiants valides : acceptée avec le code HTTP 200.

\- Accès à une route protégée avec un token valide : accepté avec le code HTTP 200.



\*\*Résultat :\*\* 3 scénarios vérifiés avec succès.



\### 3.3 Tests de l'interface avec Playwright



La suite de tests Playwright a été exécutée sur Chromium.



\*\*Résultat :\*\*

\- Tests réussis : 5

\- Tests échoués : 0

\- Temps mesuré pour le test de performance : 316 ms

\- Violations d'accessibilité détectées : 0



\*\*Statut :\*\* Succès.



\## 4. Bilan global



| Outil | Résultat | Statut |

|---|---:|---|

| PHPUnit | 21/21 | Réussi |

| Postman | 3/3 scénarios | Réussi |

| Playwright | 5/5 | Réussi |

| Accessibilité | 0 violation | Réussi |



Les tests exécutés après les corrections présentent des résultats positifs. Les fonctionnalités concernées par les anomalies vérifiées ont été soumises à des tests de régression.



\## 5. Difficultés rencontrées



\- Adaptation de certains tests après la mise en place de l'authentification API.

\- Gestion des données de test et des transactions en base de données.

\- Vérification de la cohérence du stock des pièces pendant les opérations de réparation.

\- Correction et vérification des règles métier concernant les ventes de véhicules.

\- Adaptation des tests d'interface Playwright aux éléments réellement présents dans l'application.



\## 6. Conclusion



La semaine 10 a permis de corriger plusieurs anomalies importantes et de réaliser une nouvelle campagne de tests de régression.



Les résultats obtenus sont satisfaisants : les 21 tests PHPUnit, les 3 scénarios Postman et les 5 tests Playwright ont réussi.



\## 7. Captures d'écran et preuves



Les captures d'écran suivantes constituent les preuves de l'exécution des tests et des corrections réalisées pendant la semaine 10. Elles sont conservées dans le dossier `docs-test/captures/`.



| Référence | Description | Preuve |

|---|---|---|

| S10\_01 | Résultats initiaux des tests unitaires | \[Voir la capture](../captures/S10\_01\_Resultats\_Tests\_Unitaires.png) |

| S10\_02 | Résultats initiaux des tests d'intégration | \[Voir la capture](../captures/S10\_02\_Resultats\_Tests\_Integration.png) |

| S10\_03 | Refus d'accès à l'API sans authentification (401) | \[Voir la capture](../captures/S10\_03\_API\_Acces\_Sans\_Authentification.png) |

| S10\_04 | Refus de revente d'un véhicule déjà vendu | \[Voir la capture](../captures/S10\_04\_API\_Revente\_Vehicule\_Vendu.png) |

| S10\_05 | Résultats des tests unitaires après corrections | \[Voir la capture](../captures/S10\_05\_Regression\_Tests\_Unitaires\_Apres\_Corrections.png) |

| S10\_06 | Résultats des tests d'intégration après corrections | \[Voir la capture](../captures/S10\_06\_Regression\_Tests\_Integration\_Apres\_Corrections.png) |

| S10\_07 | Résultats complets de la régression PHPUnit | \[Voir la capture](../captures/S10\_07\_Regression\_PHPUnit\_Complete.png) |

| S10\_08 | Résultats complets des tests Playwright | \[Voir la capture](../captures/S10\_08\_Regression\_Playwright\_Complete.png) |



Ces preuves permettent de vérifier les résultats annoncés dans le présent rapport et d'assurer la traçabilité des activités de test.

