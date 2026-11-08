# Plan de test : Park Manager

## 1\. Objectif

Évaluer la qualité de Park Manager, détecter les anomalies, puis prendre une décision argumentée de livraison : **validation**, **validation conditionnelle** ou **refus de livraison**.

La campagne est guidée par le risque : les risques de niveau 6 à 9 identifiés en semaine 1 sont testés en premier et plus profondément.

## 2\. Périmètre

Le périmètre est celui défini dans `S1\_analyse\_risques.md` (section 5) :

* **Inclus** : authentification et rôles, départements, conducteurs, véhicules, contrats, documents, alertes, ouvriers, fournisseurs, pièces, maintenance, réparations, API REST, base de données, un test non fonctionnel.
* **Exclu** : production et hébergement, charge lourde, envoi réel d'emails et de SMS, compatibilité multi-navigateurs, arabe complet.

## 3\. Règles métier de référence

Le sujet fournit des règles pour RéclaGest. Elles sont adaptées à Park Manager ci-dessous. Ce tableau est un **point de départ** : la semaine 3 le confirme ou le corrige à partir du comportement réel de l'application et du rapport de stage.

|ID|Règle (à confirmer en semaine 3)|Origine|
|-|-|-|
|RG1|Un véhicule a un matricule unique et obligatoire|Adaptation de « titre obligatoire »|
|RG2|Statuts d'un véhicule : DISPONIBLE, EN LOCATION, VENDU|Observé dans l'application|
|RG3|Un véhicule vendu ne peut plus être vendu, loué ou affecté|Adaptation de « clôturée non modifiable »|
|RG4|Un contrat est associé à un véhicule et à un client|Rapport, chapitre 2|
|RG5|Les montants (prix, coût) sont strictement positifs et plausibles|Hypothèse issue de R2 et R10|
|RG6|Une alerte est générée avant l'expiration d'une assurance, d'une visite technique ou d'une taxe|Rapport, chapitre 2|
|RG7|La quantité d'une pièce diminue quand elle est utilisée et ne devient jamais négative|Rapport, chapitre 2|
|RG8|Une réparation a une date de fin postérieure ou égale à sa date de début|Hypothèse issue de R10|
|RG9|Seul un utilisateur connecté accède aux fonctions ; les droits dépendent du rôle|Rapport, chapitre 2|

## 4\. Niveaux de test

|Niveau|Objectif|Cible|Outil|Semaine|
|-|-|-|-|-|
|Unitaire|Vérifier une règle ou une validation isolée|Modèles et méthodes de validation Laravel (calcul des échéances, validation des champs, statut)|PHPUnit|6|
|Intégration|Vérifier la collaboration entre le code et la base|Opérations CRUD, persistance, contraintes d'intégrité, cas d'échec|PHPUnit + base MySQL de test|7|
|Système (API)|Vérifier le contrat de l'API REST|Méthodes HTTP, codes de statut, JSON, authentification, erreurs|Postman|8|
|Système (interface)|Vérifier un parcours critique de bout en bout|Connexion → ajout d'un véhicule → vente → vérification|Playwright|9|
|Non fonctionnel|Évaluer un attribut de qualité|Sécurité (accès sans connexion, injection) ou performance|Postman / k6|9|
|Acceptation|Confirmer que les besoins du chapitre 2 sont satisfaits|Exigences fonctionnelles, scénarios de bout en bout|Exécution manuelle guidée par la matrice|10|

## 5\. Techniques de conception

|Technique|Usage dans le projet|Exemple|
|-|-|-|
|Partitions d'équivalence|Regrouper les valeurs valides et invalides d'un champ|Matricule : valide, vide, doublon|
|Valeurs limites|Tester les bornes d'un champ|Prix : -1, 0, 1 ; description à la longueur minimale et maximale|
|Table de décision|Combiner plusieurs conditions|Statut du véhicule × type de contrat (vente, location, achat)|
|Transitions d'état|Vérifier le cycle de vie|DISPONIBLE → EN LOCATION → DISPONIBLE → VENDU ; transitions interdites|
|Tests exploratoires|Chercher des défauts hors scénarios|Sessions de 30 à 45 minutes, notes et captures|

## 6\. Couverture des risques par niveau de test

|Risque|Niveau|Premiers cas à concevoir|
|-|-|-|
|R1 : double vente|Unitaire, intégration, API, interface|Vendre un véhicule déjà VENDU ; louer un véhicule vendu|
|R2 : montants aberrants|Unitaire, API|Prix négatif, nul, très élevé|
|R3 : alertes|Unitaire, intégration, API|Alerte à J-30, J-0 ; doublon ; véhicule vendu|
|R4 : stock|Unitaire, intégration|Réparation avec quantité supérieure au stock|
|R5, R6 : sécurité|API, interface|Appel sans jeton (401) ; rôle non autorisé (403)|
|R7 : injection|Non fonctionnel|Chaînes SQL et script dans les champs texte|
|R8 : saisie|Unitaire, API|Doublon de matricule, téléphone invalide|
|R9 : affectation|Intégration, API|Affecter un conducteur inactif|
|R10 : réparations|Unitaire|Coût à 0, date de fin avant la date de début|
|R11 : suppression|Intégration|Supprimer un ouvrier lié à une réparation|
|R12 à R17|API, interface, exploratoire|Selon le temps disponible|

## 7\. Environnement et données

### Environnement de test

|Élément|Valeur|
|-|-|
|Machine|PC portable MSI, Windows 11, Intel Core i5-1334U, 16 Go|
|Serveur|XAMPP (Apache, PHP, MySQL)|
|Backend|Laravel 10|
|Frontend|React.js, servi en local|



### Données de test

|Jeu|Contenu|Usage|
|-|-|-|
|Valides|Véhicules, conducteurs, clients, fournisseurs, pièces cohérents|Cas nominaux|
|Invalides|Champs vides, doublons, valeurs hors bornes|Cas négatifs|
|Limites|Valeurs aux bornes (0, 1, longueur max)|Valeurs limites|
|Dates|Échéances à J+30, J, J-1, J-1042|Alertes|

Les données sont créées par des *factories* et des *seeders* de test, pour que chaque exécution soit reproductible.

### Comptes de test

Un compte administrateur, un compte d'un autre rôle (si l'application en gère plusieurs) et un compte inactif. Les mots de passe de test restent dans la base de test, jamais dans le dépôt.

## 8\. Outils

|Besoin|Outil|Remarque|
|-|-|-|
|Code et historique|Git + GitHub|Un commit par semaine|
|Tests unitaires et d'intégration|PHPUnit (inclus avec Laravel)|`php artisan test`|
|Couverture de code|PHPUnit avec Xdebug ou PCOV|Disponibilité à vérifier en semaine 2|
|Tests API|Postman|Collection exportée dans le dépôt|
|Tests d'interface|Playwright|Parcours critique, captures de trace|
|Performance (option)|k6|Seulement si choisi en semaine 9|
|Anomalies|GitHub Issues|Étiquettes de sévérité et de priorité|
|Aide à la conception|Agent IA|Voir section 14|

## 9\. Rôles et responsabilités

|Rôle|Responsable|
|-|-|
|Analyse, conception, exécution, rapport|Hyba Ezzar et emna zaydoun|
|Encadrement et revue|Enseignant du module|

## 10\. Critères d'entrée, de sortie, de suspension

### Critères d'entrée (début d'une campagne d'exécution)

* Application démarrée en local, sans erreur au lancement.
* Base de test créée et alimentée.
* Cas de test écrits et revus.
* Outils installés et fonctionnels (preuve : voir captures).

### Critères de sortie (fin de la campagne finale)

|Critère|Seuil|
|-|-|
|Risques de niveau 6 à 9|Au moins un cas de test exécuté par risque : **100 %**|
|Cas de test planifiés|Tous exécutés (réussi, échoué ou bloqué, avec preuve)|
|Taux de réussite après correction|**90 % ou plus** des cas exécutés|
|Anomalies bloquantes ouvertes|**0**|
|Anomalies critiques ouvertes|**0**, ou acceptées avec contournement documenté|
|Test de régression|Suite rejouée après les corrections, résultats archivés|
|Couverture de code|Mesurée et interprétée. Cible indicative : 50 % ou plus des contrôleurs et modèles testés|



### Critères de suspension et de reprise

* **Suspension** : application inutilisable (erreur au démarrage, base inaccessible), ou anomalie bloquante empêchant d'exécuter plus de la moitié des cas d'un niveau.
* **Reprise** : après correction et nouveau test de fumée (connexion, ouverture d'une page, lecture de la base).

## 11\. Classification et suivi des anomalies

### Sévérité

|Niveau|Définition|Exemple Park Manager|
|-|-|-|
|Bloquante|Empêche d'utiliser l'application ou perd des données|Connexion impossible|
|Critique|Donnée financière ou règle métier essentielle violée, ou faille de sécurité|Double vente d'un véhicule|
|Majeure|Fonction dégradée avec contournement|Alerte en double|
|Mineure|Défaut visible sans impact sur la règle métier|Format de téléphone non uniforme|
|Cosmétique|Esthétique ou libellé|Faute de frappe|

### Priorité de correction

|Priorité|Délai visé|
|-|-|
|P1|Avant la campagne finale|
|P2|Avant la décision de livraison|
|P3|Peut être différée et documentée|

### Cycle de vie

Nouvelle → Confirmée → Corrigée → Revérifiée → Fermée (ou Rejetée si non reproductible, ou Différée avec justification).



## 12\. Décision finale : règles fixées avant la campagne

|Décision|Condition|
|-|-|
|**Validation**|Critères de sortie tous satisfaits : aucune anomalie bloquante ou critique ouverte, risques élevés couverts|
|**Validation conditionnelle**|Aucune anomalie bloquante ; anomalies critiques ou majeures résiduelles **acceptables**, avec risques explicités, contournement documenté et conditions de livraison définies|
|**Refus de livraison**|Au moins une anomalie bloquante, une faille de sécurité majeure (accès sans authentification aux données, injection exploitable) ou une règle métier essentielle non satisfaite sans contournement (ex. double vente possible, montant incohérent accepté)|

Ces seuils sont figés avant l'exécution de la campagne finale et ne sont modifiés qu'avec une justification écrite dans le dossier.

## 13\. Stratégie de régression

* Chaque anomalie corrigée donne lieu à un cas de test ajouté à la suite de régression.
* Les cas des risques de niveau 6 à 9 forment la **suite de régression minimale**.
* La suite automatisée (PHPUnit, collection Postman, parcours Playwright) est rejouée en semaine 10, après correction.
* Un résultat non rejoué n'est pas compté comme preuve.

## 14\. Conventions et gestion de configuration

|Objet|Convention|Exemple|
|-|-|-|
|Cas de test|`TC-<MODULE>-<NN>`|`TC-VEH-03`|
|Anomalie|`ANO-<NNN>`|`ANO-004`|
|Capture|`S<semaine>\_<NN>\_<sujet>.png`|`S6\_02\_phpunit\_resultats.png`|
|Commit|`Semaine N - contenu`|`Semaine 2 - plan de test`|

Structure du dépôt :

```
docs-test/
├── 01-risques/
├── 02-plan/              ce document
├── 03-cas-de-test/
├── 04-anomalies/
└── captures/
```

Les scripts automatisés se placent dans les dossiers standards du projet : `tests/` pour PHPUnit, `docs-test/postman/` pour Postman, `e2e/` pour Playwright.

## 

