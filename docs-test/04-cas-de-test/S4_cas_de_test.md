# Catalogue des cas de test et jeux de données : Park Manager

| Élément | Valeur |
|---|---|
| Version | 1.1 |
| Date | 10/11/2026 |
| Auteure | Hyba Ezzar |
| Documents liés | `01-risques/S1_analyse_risques.md`, `02-plan/S2_plan_de_test.md`, `03-exigences/S3_exigences_tracabilite.md` |

## 1. Objet et conventions

Ce document contient **20 cas de test retenus** pour la campagne, choisis parmi 29 cas conçus à partir des exigences de la semaine 3. La sélection suit le risque : tous les risques de niveau 6 à 9 sont couverts, et les cas redondants sont placés dans une liste de cas complémentaires (section 5).

Les cas sont **conçus, pas encore exécutés**. Les résultats seront consignés dans les rapports d'exécution et le registre des anomalies (semaines 5 à 9).

| Convention | Signification |
|---|---|
| Identifiant | `TC-<MODULE>-<NN>`, identique à ceux réservés dans la matrice de traçabilité |
| Type | **P** = positif (cas nominal), **N** = négatif (cas d'erreur), **L** = valeur limite |
| Technique | **PE** = partition d'équivalence, **VL** = valeur limite, **TD** = table de décision, **ET** = transition d'état, **EX** = exploratoire |
| Mention (A3), (A4)... | Hypothèse de la section 3 du document des exigences, utilisée pour le résultat attendu |
| Résultat observé | Non renseigné ici : il figure dans le rapport d'exécution |

## 2. Application des techniques de conception

### 2.1 Partitions d'équivalence

| Donnée | Partition valide | Partitions invalides |
|---|---|---|
| Matricule | Format `12345-A-67`, non utilisé | Vide ; déjà utilisé ; caractères spéciaux ; très long |
| Prix de vente ou d'achat | Montant positif plausible (ex. 25 000 DT) | Négatif ; nul ; texte ; montant démesuré |
| Date d'expiration d'un document | Date future | Date passée ; date impossible ; vide |
| Quantité de pièces utilisées | Entre 1 et le stock disponible | 0 ; négative ; supérieure au stock |
| Dates d'une réparation | Fin postérieure ou égale au début | Fin antérieure au début ; début vide |
| Identifiants de connexion | Email et mot de passe corrects | Email inconnu ; mot de passe faux ; champs vides |

### 2.2 Valeurs limites retenues

| Donnée | Valeurs testées | Cas | Hypothèse |
|---|---|---|---|
| Prix de vente | `0` et `-1` | TC-CTR-03 | Positif strict (A4) |
| Délai de l'alerte (N = 30 jours) | `N+1`, `N`, `N-1` | TC-ALR-01 | N = 30 (A1) |
| Stock d'une pièce | Utilisation de 1 (stock 25), puis de 2 (stock 1) | TC-STK-02, TC-STK-03 | Stock jamais négatif |
| Dates d'une réparation | Fin = début − 1 jour | TC-REP-02 | Fin ≥ début |

Les autres valeurs (prix `10000000`, alerte à J0 et J-1, coût de réparation nul) sont reportées dans les cas complémentaires.

### 2.3 Table de décision : action selon le statut du véhicule

| Statut du véhicule | Vente | Location | Affectation d'un conducteur actif |
|---|---|---|---|
| DISPONIBLE | Acceptée → VENDUE | Acceptée → EN LOCATION | Acceptée |
| EN LOCATION | Refusée *(hypothèse)* | Refusée | Refusée *(hypothèse)* |
| VENDUE | **Refusée** (A3) | **Refusée** (A3) | **Refusée** |

**Cellules exécutées** : la ligne VENDUE (TC-VEH-07, TC-VEH-08) et la vente d'un véhicule DISPONIBLE (TC-CTR-06). Les cellules de la ligne EN LOCATION, la location et l'affectation d'un véhicule disponible sont dans les cas complémentaires (TC-CTR-07, TC-VEH-05).

## 3. Jeux de données de test

Toutes les données de test portent le préfixe `TEST` pour les distinguer des données réelles.

### 3.1 Véhicules

| Code | Matricule | Marque, modèle | Statut initial | Utilisé par |
|---|---|---|---|---|
| DS-V1 | `90001-T-01` | Peugeot 208 | DISPONIBLE | TC-VEH-01, 02, 03, 06 ; TC-CTR-01, 02, 03, 06 ; TC-ALR-01 ; TC-DOC-03 |
| DS-V2 | `90002-T-02` | Renault Clio 4 | VENDUE | TC-VEH-07, 08 ; TC-ALR-04 |
| DS-V4 | `90004-T-04` | Volkswagen Golf | DISPONIBLE | TC-REP-02 ; TC-STK-02, 03 ; TC-OUV-03 |

### 3.2 Conducteurs, clients, ouvriers

| Code | Contenu | Utilisé par |
|---|---|---|
| DS-C2 | Conducteur `TEST Inactif`, état Inactif | TC-VEH-06 |
| DS-CL1 | Client `TEST Client`, téléphone valide | TC-VEH-07, 08 ; TC-CTR-01, 03, 06 |
| DS-O1 | Ouvrier `TEST Meca`, type MECANICIEN, email `meca.test@example.com` | TC-STK-02, 03 ; TC-OUV-03 |

### 3.3 Pièces et documents

| Code | Contenu | Utilisé par |
|---|---|---|
| DS-P1 | Pièce `TEST Filtre à huile`, stock 25, prix 12,50 | TC-STK-02 |
| DS-P2 | Pièce `TEST Bougie`, stock 1 | TC-STK-03 |
| DS-D1 | Assurance de DS-V1 expirant dans 31 jours | TC-ALR-01 |
| DS-D2 | Assurance de DS-V1 expirant dans 30 jours | TC-ALR-01 |
| DS-D3 | Assurance de DS-V1 expirant dans 29 jours | TC-ALR-01 |
| DS-D5 | Document de DS-V1 avec une date d'expiration passée (hier) | TC-DOC-03 |
| DS-D6 | Assurance de DS-V2 (véhicule vendu) expirant dans 10 jours | TC-ALR-04 |

### 3.3 bis Données réservées aux cas complémentaires

DS-V3 (Hyundai Tucson, EN LOCATION), DS-C1 (conducteur actif), DS-O2 (ouvrier avec le même email que DS-O1), DS-D4 (assurance expirant aujourd'hui).

### 3.4 Données de sécurité

| Code | Contenu | Utilisé par |
|---|---|---|
| DS-S2 | Compte d'un rôle non administrateur (si le rôle existe, A7) | TC-SEC-04 |
| DS-S3 | Chaînes d'attaque : `' OR 1=1 --` et `<script>alert(1)</script>` | TC-NF-01 |

## 4. Catalogue des 20 cas de test retenus

### 4.1 Véhicules et conducteurs (6 cas)

| ID | Cas de test | Type | Tech. | Données | Étapes | Résultat attendu | Trace |
|---|---|---|---|---|---|---|---|
| TC-VEH-01 | Ajouter un véhicule valide | P | PE | DS-V1 | Se connecter, ouvrir Voiture, remplir le formulaire, valider | Le véhicule apparaît dans le catalogue avec les valeurs saisies | EX-VEH-01 / R8 |
| TC-VEH-02 | Ajouter un véhicule sans matricule | N | PE | Matricule vide | Remplir le formulaire sans matricule, valider | Refus avec message d'erreur ; aucun véhicule créé (A2) | EX-VEH-02 / R8 |
| TC-VEH-03 | Ajouter un véhicule avec un matricule déjà utilisé | N | PE | `90001-T-01` après TC-VEH-01 | Ajouter un second véhicule avec le même matricule | Refus ; un seul véhicule porte ce matricule (A2) | EX-VEH-02 / R8 |
| TC-VEH-06 | Affecter un conducteur inactif | N | PE | DS-V1, DS-C2 | Affecter le conducteur inactif au véhicule | Refus avec message ; aucune affectation créée | EX-CON-02 / R9 |
| TC-VEH-07 | Revendre un véhicule déjà vendu | N | TD, ET | DS-V2, DS-CL1 | Créer une vente sur DS-V2 | Refus ; une seule vente reste enregistrée (A3) | EX-VEH-05 / R1 |
| TC-VEH-08 | Louer un véhicule vendu | N | TD, ET | DS-V2, DS-CL1 | Créer une location sur DS-V2 | Refus ; statut inchangé (A3) | EX-VEH-05 / R1 |

### 4.2 Contrats (4 cas)

| ID | Cas de test | Type | Tech. | Données | Étapes | Résultat attendu | Trace |
|---|---|---|---|---|---|---|---|
| TC-CTR-01 | Valider une vente valide | P | PE | DS-V1, DS-CL1, prix `25000` | Ouvrir Contrats, onglet Vente, remplir, valider | Contrat enregistré et visible dans l'historique du véhicule | EX-CTR-01 / R1 |
| TC-CTR-02 | Valider une vente sans client | N | PE | DS-V1, client non choisi | Remplir sans client, valider | Refus avec message ; aucun contrat créé | EX-CTR-02 / R1 |
| TC-CTR-03 | Prix de vente nul ou négatif | L | VL | DS-V1, DS-CL1, prix `0` puis `-1` | Valider une vente avec prix `0`, puis une autre avec prix `-1` | Les deux ventes sont refusées (A4) | EX-CTR-03 / R2 |
| TC-CTR-06 | La vente passe le statut à VENDUE | P | ET | DS-V1, DS-CL1 | Valider une vente, ouvrir la fiche du véhicule | Statut VENDUE | EX-CTR-04 / R1 |

### 4.3 Documents et alertes (3 cas)

| ID | Cas de test | Type | Tech. | Données | Étapes | Résultat attendu | Trace |
|---|---|---|---|---|---|---|---|
| TC-DOC-03 | Enregistrer un document avec une date d'expiration passée | N | PE | DS-V1, DS-D5 | Ouvrir Documents, saisir une date d'expiration d'hier, valider | Refus ou avertissement ; le document n'est pas enregistré silencieusement (hypothèse EX-DOC-03) | EX-DOC-03 / R14 |
| TC-ALR-01 | Alerte à l'approche de l'échéance | L | VL | DS-D1, DS-D2, DS-D3 | Ouvrir Alertes après chaque ajout de document | Aucune alerte à 31 jours ; alerte à 30 et 29 jours avec le temps restant correct (A1) | EX-ALR-01 / R3 |
| TC-ALR-04 | Pas d'alerte pour un véhicule vendu | N | TD | DS-D6 (véhicule VENDUE) | Ouvrir Alertes | Aucune alerte pour DS-V2 (A5) | EX-ALR-03 / R3 |

### 4.4 Réparations, stock et ouvriers (4 cas)

| ID | Cas de test | Type | Tech. | Données | Étapes | Résultat attendu | Trace |
|---|---|---|---|---|---|---|---|
| TC-REP-02 | Réparation avec fin avant début | N | VL | DS-V4, DS-O1, début `10/12/2026`, fin `09/12/2026` | Remplir et valider le formulaire de réparation | Refus avec message | EX-REP-02 / R10 |
| TC-STK-02 | La réparation décrémente le stock | P | PE | DS-P1 (stock 25), DS-V4, DS-O1 | Valider une réparation utilisant 1 filtre | Stock de DS-P1 égal à 24 | EX-STK-02 / R4 |
| TC-STK-03 | Réparation avec stock insuffisant | L | VL | DS-P2 (stock 1), utilisation de 2 | Valider une réparation utilisant 2 bougies | Refus ; stock reste à 1 et jamais négatif | EX-STK-03 / R4 |
| TC-OUV-03 | Supprimer un ouvrier lié à une réparation | N | EX | DS-O1 lié à une réparation | Cliquer Supprimer | Refus, ou historique conservé sans erreur d'affichage (A8) | EX-OUV-03 / R11 |

### 4.5 Sécurité et accès (3 cas)

| ID | Cas de test | Type | Tech. | Données | Étapes | Résultat attendu | Trace |
|---|---|---|---|---|---|---|---|
| TC-SEC-03 | Appel de l'API sans jeton | N | PE | Aucune authentification | Appeler une route protégée (ex. liste des véhicules) sans en-tête `Authorization` | Réponse 401, aucune donnée renvoyée | EX-SEC-02 / R5 |
| TC-SEC-04 | Appel d'une route réservée par un rôle non autorisé | N | PE | DS-S2 | Appeler une route d'administration avec ce compte | Réponse 403 (A7) | EX-SEC-03 / R6 |
| TC-NF-01 | Injection SQL et XSS dans un champ texte | N | EX | DS-S3 | Saisir chaque chaîne dans un champ texte (ex. nom de département) et enregistrer | Texte enregistré tel quel ou rejeté ; aucun script exécuté, aucune erreur serveur | ENF-SEC-01 / R7 |

## 5. Cas complémentaires (conçus, non retenus pour la campagne)

Ces cas ont été conçus puis écartés, car ils répètent un cas retenu ou portent sur un risque plus faible. Ils pourront être exécutés si le temps le permet.

| ID | Cas | Raison de l'exclusion |
|---|---|---|
| TC-VEH-05 | Affecter un conducteur actif | Cas nominal couvert indirectement par TC-VEH-06 |
| TC-VEH-09 | Consulter l'historique d'un véhicule | Risque faible (R12) |
| TC-CTR-04 | Prix de vente négatif | **Fusionné** dans TC-CTR-03 (deux jeux de données) |
| TC-CTR-05 | Prix de vente démesuré (`10000000`) | Borne haute non définie (A4) |
| TC-CTR-07 | La location passe le statut à EN LOCATION | Même mécanisme que TC-CTR-06 |
| TC-ALR-02 | Alerte à J0 et après expiration | TC-ALR-01 couvre la limite de déclenchement |
| TC-ALR-03 | Pas de doublon d'alerte | À observer en test exploratoire (semaine 5) |
| TC-REP-03 | Coût de réparation nul ou négatif | Règle incertaine (A9) |
| TC-OUV-02 | Ouvrier avec un email déjà utilisé | Risque R8 déjà couvert par TC-VEH-02 et TC-VEH-03 |
| TC-SEC-01 | Connexion avec un mot de passe faux | Risque R5 déjà couvert par TC-SEC-03 |

## 6. Récapitulatif

| Indicateur | Valeur |
|---|---|
| Cas de test conçus | 29 |
| Cas retenus pour la campagne | **20** |
| Cas positifs, négatifs, limites (retenus) | 4 P, 13 N, 3 L |
| Cas liés à une exigence de priorité H | 16 |
| Risques de niveau 6 à 9 couverts | R1, R2, R3, R4, R5, R6, R8, R9, R10, R11, R14 : **11 sur 11** |
| Risque de niveau inférieur couvert | R7 (TC-NF-01) |

### Lien avec les semaines suivantes

| Semaine | Cas exécutés |
|---|---|
| 5 | Exécution manuelle : TC-VEH-01 à 08, TC-CTR-01, 02, 03, 06, TC-ALR-01, 04, TC-DOC-03 |
| 6 | Automatisation unitaire à partir de TC-CTR-03, TC-REP-02, TC-STK-03, TC-VEH-02, TC-ALR-01 |
| 7 | Automatisation d'intégration à partir de TC-STK-02, TC-OUV-03, TC-VEH-07 |
| 8 | Collection Postman : TC-SEC-03, TC-SEC-04, TC-VEH-07, TC-CTR-03 |
| 9 | Parcours d'interface (TC-VEH-01, TC-CTR-06) et test non fonctionnel TC-NF-01 |
