# S8 — Rapport de tests de l’API REST ALBA_park manager

| Champ | Valeur |
|---|---|
| Identifiant | S8-API-REST |
| Date d’exécution | 17/11/2026 |
| Réalisé par | Hyba ezzar et emna zaydoun |
| Application | ALBA — Gestion de park manager  |
| Module | API REST — Authentification, Voitures, Clients et Locations |
| Outil de test | Postman |
| Environnement | Laravel 10.50.0, PHP 8.1.2, MySQL |
| URL de base | `http://127.0.0.1:8000` |
| Statut global | **Tests exécutés et validés** |

## 1. Résumé

Cette campagne de tests a pour objectif de vérifier le bon fonctionnement de l’API REST de l’application ALBA. Les requêtes ont été exécutées avec Postman afin de contrôler les opérations d’authentification et les opérations CRUD (Create, Read, Update, Delete) sur les ressources Voitures, Clients et Locations.

Les tests vérifient notamment les codes HTTP, le format JSON des réponses, la présence des données attendues et le rejet des accès ou des données invalides.

La campagne est organisée en cinq dossiers Postman : Authentification, Voitures, Clients, Locations et Negative Tests. Les tests finaux exécutés dans ces dossiers ont été validés.

## 2. Préconditions

- Le serveur Laravel est démarré sur `http://127.0.0.1:8000`.
- La base de données MySQL est accessible.
- Les routes de l’API sont disponibles.
- La collection Postman `ALBA — API REST Tests` est importée.
- Un compte administrateur de test est disponible.
- Pour les routes protégées, le jeton Sanctum est récupéré après la connexion et utilisé comme Bearer Token.
- Les requêtes POST et PUT utilisent le format JSON avec les en-têtes `Accept: application/json` et `Content-Type: application/json`.

## 3. Organisation et exécution des tests

| Dossier Postman | Tests effectués | Vérifications principales |
|---|---|---|
| `01 - Authentication` | Connexion valide, connexion avec mot de passe incorrect, accès sans jeton, accès avec jeton valide | Codes HTTP, réponse JSON, présence du message et du jeton, accès protégé |
| `02 - Voitures` | Liste, consultation par ID, création, modification et suppression | Codes HTTP, structure des réponses, champs d’une voiture et résultat des opérations CRUD |
| `03 - Clients` | Liste, consultation par ID, création, modification et suppression | Codes HTTP, données retournées et résultat des opérations CRUD |
| `04 - Locations` | Liste, consultation par ID, création, modification et suppression | Structure des réponses, champs d’une location et résultat des opérations CRUD |
| `05 - Negative Tests` | Accès sans jeton, accès avec jeton invalide, création avec données invalides et tests de connexion avec identifiants incorrects | Rejet des requêtes non autorisées et validation des données |

## 4. Résultats attendus

- Une connexion valide doit retourner un code HTTP `200` et un jeton d’authentification.
- Une connexion avec des identifiants incorrects doit être refusée.
- Une route protégée appelée sans jeton ou avec un jeton invalide doit retourner `401 Unauthorized`.
- Une lecture réussie doit retourner les données demandées au format JSON.
- Une création réussie doit retourner un code de succès adapté, généralement `201 Created`.
- Une modification ou une suppression réussie doit retourner une réponse de succès.
- Une création avec des données invalides doit être refusée par l’API avec une réponse de validation adaptée, normalement `422 Unprocessable Entity`.

## 5. Résultats observés

Les requêtes de la collection ont été exécutées dans Postman. Après les ajustements effectués sur les scripts Post-response pour tenir compte de la structure réelle des réponses de l’API, les tests finaux des cinq dossiers ont été indiqués comme **Passed**.

Les réponses de l’API ne possèdent pas toutes la même structure : certaines ressources retournent directement un tableau ou un objet JSON, tandis que d’autres utilisent un objet contenant notamment `message` et `data`. Les assertions Postman ont donc été adaptées à la structure réellement retournée par chaque route.

Les tests négatifs vérifient également que l’API refuse les accès non authentifiés ou les données invalides. Le code HTTP et le contenu de la réponse sont contrôlés par les scripts Post-response.

## 6. Preuves

Les captures d’écran sont placées dans le dossier `captures`, situé au même niveau que le dossier contenant ce rapport. Les liens ci-dessous utilisent donc le chemin relatif `../captures/`.

| Fichier | Contenu |
|---|---|
| [`S8_01_Login_Configuration.png`](../captures/S8_01_Login_Configuration.png) | Configuration de la requête de connexion valide |
| [`S8_02_Login_Reponse_JSON.png`](../captures/S8_02_Login_Reponse_JSON.png) | Réponse JSON de la connexion valide |
| [`S8_03_Login_Tests_Passes.png`](../captures/S8_03_Login_Tests_Passes.png) | Tests Post-response de la connexion valide |
| [`S8_04_Login_Echec_Mot_De_Passe_Incorrect.png`](../captures/S8_04_Login_Echec_Mot_De_Passe_Incorrect.png) | Réponse de connexion avec mot de passe incorrect |
| [`S8_05_Login_Echec_Tests_Passes.png`](../captures/S8_05_Login_Echec_Tests_Passes.png) | Tests de rejet du mot de passe incorrect |
| [`S8_06_Access_Sans_Token.png`](../captures/S8_06_Access_Sans_Token.png) | Accès à une route protégée sans jeton |
| [`S8_07_Access_Sans_Token_Tests_Passes.png`](../captures/S8_07_Access_Sans_Token_Tests_Passes.png) | Tests du refus d’accès sans jeton |
| [`S8_08_Access_Avec_Token.png`](../captures/S8_08_Access_Avec_Token.png) | Accès à une route protégée avec jeton valide |
| [`S8_09_Access_Avec_Token_Tests_Passes.png`](../captures/S8_09_Access_Avec_Token_Tests_Passes.png) | Tests de l’accès avec jeton valide |
| [`S8_10_Get_All_Voitures_Reponse.png`](../captures/S8_10_Get_All_Voitures_Reponse.png) | Liste des voitures |
| [`S8_11_Get_All_Voitures_Tests_Passes.png`](../captures/S8_11_Get_All_Voitures_Tests_Passes.png) | Tests de récupération de toutes les voitures |
| [`S8_12_Get_Voiture_By_ID_Reponse.png`](../captures/S8_12_Get_Voiture_By_ID_Reponse.png) | Détail d’une voiture par son identifiant |
| [`S8_13_Get_Voiture_By_ID_Tests_Passes.png`](../captures/S8_13_Get_Voiture_By_ID_Tests_Passes.png) | Tests de récupération d’une voiture par ID |
| [`S8_14_Create_Voiture_Reponse.png`](../captures/S8_14_Create_Voiture_Reponse.png) | Réponse de création d’une voiture |
| [`S8_15_Create_Voiture_Tests_Passes.png`](../captures/S8_15_Create_Voiture_Tests_Passes.png) | Tests de création d’une voiture |
| [`S8_16_Update_Voiture_Reponse.png`](../captures/S8_16_Update_Voiture_Reponse.png) | Réponse de modification d’une voiture |
| [`S8_17_Update_Voiture_Tests_Passes.png`](../captures/S8_17_Update_Voiture_Tests_Passes.png) | Tests de modification d’une voiture |
| [`S8_18_Delete_Voiture_Reponse.png`](../captures/S8_18_Delete_Voiture_Reponse.png) | Réponse de suppression d’une voiture |
| [`S8_19_Delete_Voiture_Tests_Passes.png`](../captures/S8_19_Delete_Voiture_Tests_Passes.png) | Tests de suppression d’une voiture |
| [`S8_20_Get_Voiture_Supprimee_Reponse.png`](../captures/S8_20_Get_Voiture_Supprimee_Reponse.png) | Vérification de la voiture après suppression, si cette capture a été réalisée |
| [`S8_21_Get_All_Clients_Reponse.png`](../captures/S8_21_Get_All_Clients_Reponse.png) | Liste des clients |
| [`S8_22_Get_All_Clients_Tests_Passes.png`](../captures/S8_22_Get_All_Clients_Tests_Passes.png) | Tests de récupération de tous les clients |
| [`S8_23_Get_Client_By_ID_Reponse.png`](../captures/S8_23_Get_Client_By_ID_Reponse.png) | Détail d’un client par son identifiant |
| [`S8_24_Get_Client_By_ID_Tests_Passes.png`](../captures/S8_24_Get_Client_By_ID_Tests_Passes.png) | Tests de récupération d’un client par ID |
| [`S8_25_Create_Client_Reponse.png`](../captures/S8_25_Create_Client_Reponse.png) | Réponse de création d’un client |
| [`S8_26_Create_Client_Tests_Passes.png`](../captures/S8_26_Create_Client_Tests_Passes.png) | Tests de création d’un client |
| [`S8_27_Update_Client_Reponse.png`](../captures/S8_27_Update_Client_Reponse.png) | Réponse de modification d’un client |
| [`S8_28_Update_Client_Tests_Passes.png`](../captures/S8_28_Update_Client_Tests_Passes.png) | Tests de modification d’un client |
| [`S8_29_Delete_Client_Reponse.png`](../captures/S8_29_Delete_Client_Reponse.png) | Réponse de suppression d’un client |
| [`S8_30_Delete_Client_Tests_Passes.png`](../captures/S8_30_Delete_Client_Tests_Passes.png) | Tests de suppression d’un client |
| [`S8_31_Get_All_Locations_Reponse.png`](../captures/S8_31_Get_All_Locations_Reponse.png) | Liste des locations |
| [`S8_32_Get_All_Locations_Tests_Passes.png`](../captures/S8_32_Get_All_Locations_Tests_Passes.png) | Tests de récupération de toutes les locations |
| [`S8_33_Get_Location_By_ID_Reponse.png`](../captures/S8_33_Get_Location_By_ID_Reponse.png) | Détail d’une location par son identifiant |
| [`S8_34_Get_Location_By_ID_Tests_Passes.png`](../captures/S8_34_Get_Location_By_ID_Tests_Passes.png) | Tests de récupération d’une location par ID |
| [`S8_35_Create_Location_Reponse.png`](../captures/S8_35_Create_Location_Reponse.png) | Réponse de création d’une location |
| [`S8_36_Create_Location_Tests_Passes.png`](../captures/S8_36_Create_Location_Tests_Passes.png) | Tests de création d’une location |
| [`S8_37_Update_Location_Reponse.png`](../captures/S8_37_Update_Location_Reponse.png) | Réponse de modification d’une location |
| [`S8_38_Update_Location_Tests_Passes.png`](../captures/S8_38_Update_Location_Tests_Passes.png) | Tests de modification d’une location |
| [`S8_39_Delete_Location_Reponse.png`](../captures/S8_39_Delete_Location_Reponse.png) | Réponse de suppression d’une location |
| [`S8_40_Delete_Location_Tests_Passes.png`](../captures/S8_40_Delete_Location_Tests_Passes.png) | Tests de suppression d’une location |
| [`S8_41_Access_Without_Token_Reponse.png`](../captures/S8_41_Access_Without_Token_Reponse.png) | Réponse d’accès sans jeton dans les tests négatifs |
| [`S8_42_Access_Without_Token_Tests_Passes.png`](../captures/S8_42_Access_Without_Token_Tests_Passes.png) | Tests négatifs d’accès sans jeton |
| [`S8_43_Access_With_Invalid_Token_Reponse.png`](../captures/S8_43_Access_With_Invalid_Token_Reponse.png) | Réponse avec jeton invalide |
| [`S8_44_Access_With_Invalid_Token_Tests_Passes.png`](../captures/S8_44_Access_With_Invalid_Token_Tests_Passes.png) | Tests négatifs avec jeton invalide |
| [`S8_45_Create_Client_Invalid_Data_Reponse.png`](../captures/S8_45_Create_Client_Invalid_Data_Reponse.png) | Réponse de création client avec données invalides |
| [`S8_46_Create_Client_Invalid_Data_Tests_Passes.png`](../captures/S8_46_Create_Client_Invalid_Data_Tests_Passes.png) | Tests de validation des données client |
| [`S8_47_Create_Voiture_Invalid_Data_Reponse.png`](../captures/S8_47_Create_Voiture_Invalid_Data_Reponse.png) | Réponse de création voiture avec données invalides |
| [`S8_48_Create_Voiture_Invalid_Data_Tests_Passes.png`](../captures/S8_48_Create_Voiture_Invalid_Data_Tests_Passes.png) | Tests de validation des données voiture |
| [`S8_49_Login_Email_Inexistant_Reponse.png`](../captures/S8_49_Login_Email_Inexistant_Reponse.png) | Réponse de connexion avec email inexistant |
| [`S8_50_Login_Email_Inexistant_Tests_Passes.png`](../captures/S8_50_Login_Email_Inexistant_Tests_Passes.png) | Tests de rejet d’un email inexistant |

## 7. Bilan

| Critère | Résultat | Commentaire |
|---|---|---|
| Authentification | **Validé** | Connexion et contrôle d’accès testés |
| Gestion des voitures | **Validé** | Opérations CRUD testées |
| Gestion des clients | **Validé** | Opérations CRUD testées |
| Gestion des locations | **Validé** | Opérations CRUD testées |
| Tests négatifs | **Validé** | Requêtes non autorisées et données invalides testées |
| Format des réponses | **Vérifié** | Assertions adaptées aux structures JSON retournées |

## 8. Conclusion

La campagne Postman de la Semaine 8 a permis de vérifier les principales fonctionnalités de l’API REST ALBA : authentification, contrôle d’accès et opérations CRUD sur les voitures, les clients et les locations.

Les tests négatifs ont également permis de contrôler le comportement de l’API face aux identifiants incorrects, aux jetons invalides et aux données non conformes.

Les résultats finaux des tests exécutés sont indiqués comme **Passed** dans Postman. Les captures d’écran associées constituent les preuves de l’exécution et des résultats de cette campagne.
