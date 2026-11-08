# Exigences, critères d'acceptation et traçabilité : Park Manager


## 1. Exigences fonctionnelles et critères d'acceptation

Format : **Étant donné** (contexte), **quand** (action), **alors** (résultat observable).
Priorité : **H** = risque de niveau 6 à 9, **M** = 3 à 4, **B** = 1 à 2 (voir l'analyse des risques).

### Véhicules

| ID | Exigence | Critère d'acceptation | Prio. |
|---|---|---|---|
| EX-VEH-01 | Ajouter, modifier, consulter, désactiver un véhicule | Étant donné un administrateur connecté, quand il enregistre un véhicule avec des données valides, alors le véhicule apparaît dans le catalogue avec les valeurs saisies | H |
| EX-VEH-02 | Le matricule est obligatoire et unique | Quand on enregistre un véhicule sans matricule ou avec un matricule existant, alors l'enregistrement est refusé avec un message d'erreur et la base n'est pas modifiée | H |
| EX-VEH-03 | Classer les véhicules par département | Quand on filtre le catalogue par département, alors seuls les véhicules de ce département s'affichent | M |
| EX-VEH-04 | Affecter un conducteur à un véhicule et conserver l'historique | Étant donné un conducteur actif, quand on l'affecte à un véhicule, alors l'affectation est visible dans la fiche du véhicule et une seule affectation active existe | H |
| EX-VEH-05 | Un véhicule vendu ne peut plus être vendu, loué ou affecté | Étant donné un véhicule au statut VENDUE, quand on tente une nouvelle vente ou location, alors l'opération est refusée et le statut reste VENDUE | H |
| EX-VEH-06 | La fiche d'un véhicule affiche son historique (maintenances, réparations, contrats, documents) | Quand on ouvre la fiche, alors les quatre sections affichent les données de ce véhicule seulement | M |

### Conducteurs

| ID | Exigence | Critère d'acceptation | Prio. |
|---|---|---|---|
| EX-CON-01 | Enregistrer et modifier un conducteur | Quand on crée ou modifie un conducteur avec des données valides, alors les changements sont visibles dans la liste après rechargement | M |
| EX-CON-02 | Activer et désactiver un conducteur | Quand on désactive un conducteur, alors son état passe à Inactif et il ne peut plus être affecté à un véhicule | H |
| EX-CON-03 | Consulter les véhicules conduits par un conducteur | Quand on consulte un conducteur, alors l'historique de ses véhicules est affiché | B |

### Contrats

| ID | Exigence | Critère d'acceptation | Prio. |
|---|---|---|---|
| EX-CTR-01 | Créer des contrats de vente, de location et d'achat | Quand on valide un contrat avec un véhicule, un client et des montants valides, alors il apparaît dans l'historique du véhicule | H |
| EX-CTR-02 | Chaque contrat est associé à un véhicule et à un client | Quand on valide un contrat sans client ou sans véhicule, alors la validation est refusée | H |
| EX-CTR-03 | Les montants sont strictement positifs et plausibles | Quand on saisit un prix négatif, nul ou hors de la plage admise, alors le contrat est refusé | H |
| EX-CTR-04 | La vente change le statut du véhicule en VENDUE | Quand une vente est validée, alors le statut du véhicule devient VENDUE | H |
| EX-CTR-05 | La location change le statut du véhicule en EN LOCATION | Quand une location est validée, alors le statut devient EN LOCATION | M |

### Documents administratifs et alertes

| ID | Exigence | Critère d'acceptation | Prio. |
|---|---|---|---|
| EX-DOC-01 | Enregistrer assurance, visite technique et taxe de circulation | Quand on enregistre un document avec une date d'expiration valide, alors il apparaît dans la fiche du véhicule | M |
| EX-DOC-02 | Associer une assurance à un fournisseur | Quand on enregistre une assurance avec un fournisseur, alors le fournisseur est affiché dans le document | B |
| EX-DOC-03 | La date d'expiration est cohérente | Quand on saisit une date impossible ou antérieure à la date de début, alors l'enregistrement est refusé ou signalé | M |
| EX-ALR-01 | Générer une alerte avant l'expiration d'un document | Étant donné un document expirant dans N jours, quand on ouvre la page Alertes, alors une alerte apparaît avec le temps restant | H |
| EX-ALR-02 | Une échéance ne génère qu'une seule alerte | Étant donné un document unique, quand on actualise la page Alertes plusieurs fois, alors une seule alerte existe pour cette échéance | M |
| EX-ALR-03 | Un véhicule vendu ne génère plus d'alerte | Étant donné un véhicule VENDU, alors aucune nouvelle alerte n'est générée pour lui | M |

### Maintenances, réparations et ouvriers

| ID | Exigence | Critère d'acceptation | Prio. |
|---|---|---|---|
| EX-MNT-01 | Planifier une maintenance préventive | Quand on enregistre une maintenance, alors elle apparaît dans l'historique d'entretien avec son coût | M |
| EX-REP-01 | Enregistrer une réparation corrective (dates, coût, mécanicien, pièces) | Quand on enregistre une réparation valide, alors elle apparaît dans l'historique du véhicule | M |
| EX-REP-02 | La date de fin d'une réparation est postérieure ou égale à la date de début | Quand la date de fin précède la date de début, alors l'enregistrement est refusé | M |
| EX-REP-03 | Le coût d'une réparation est renseigné et positif | Quand le coût est vide ou négatif, alors l'enregistrement est refusé ou signalé | M |
| EX-OUV-01 | Gérer les ouvriers (technicien, mécanicien) | Quand on crée un ouvrier avec des données valides, alors il apparaît dans la liste | M |
| EX-OUV-02 | Un ouvrier n'est pas dupliqué | Quand on crée un ouvrier avec l'email d'un ouvrier existant, alors l'enregistrement est refusé | M |
| EX-OUV-03 | La suppression d'un ouvrier lié à une intervention est contrôlée | Quand on supprime un ouvrier lié à une réparation, alors l'opération est refusée ou l'historique reste cohérent | H |

### Stock et fournisseurs

| ID | Exigence | Critère d'acceptation | Prio. |
|---|---|---|---|
| EX-STK-01 | Gérer les pièces (ajout, modification, suppression) | Quand on ajoute une pièce valide, alors elle apparaît avec sa quantité et son prix | M |
| EX-STK-02 | La quantité diminue automatiquement quand une pièce est utilisée | Étant donné une pièce en stock de 25, quand une réparation en utilise 1, alors le stock devient 24 | H |
| EX-STK-03 | La quantité d'une pièce n'est jamais négative | Quand une réparation utilise plus de pièces que le stock, alors elle est refusée ou limitée | H |
| EX-FOU-01 | Gérer les fournisseurs (assurance, pièces, visite technique) | Quand on crée un fournisseur valide, alors il est disponible dans les listes associées | B |

### Sécurité et accès

| ID | Exigence | Critère d'acceptation | Prio. |
|---|---|---|---|
| EX-SEC-01 | Authentifier l'utilisateur | Quand on saisit des identifiants invalides, alors l'accès est refusé avec un message qui ne précise pas le champ erroné | H |
| EX-SEC-02 | Les pages et l'API exigent une connexion | Quand on appelle une route protégée sans jeton, alors la réponse est 401 et aucune donnée n'est renvoyée | H |
| EX-SEC-03 | Les droits dépendent du rôle | Quand un rôle non autorisé appelle une route réservée, alors la réponse est 403 | H |

## 2. Exigences non fonctionnelles

| ID | Exigence | Critère d'acceptation | Statut |
|---|---|---|---|
| ENF-SEC-01 | Protection contre l'injection SQL et XSS | Une chaîne `' OR 1=1 --` ou `<script>alert(1)</script>` saisie dans un champ texte est enregistrée comme texte ou rejetée, sans exécution ni erreur serveur | Testable |
| ENF-SEC-02 | Mots de passe hachés | Dans la base de test, aucun mot de passe n'est stocké en clair | Testable |
| ENF-SEC-03 | Protection CSRF | L'API utilise un jeton `Bearer` : la protection CSRF classique ne s'applique pas à ces appels | À clarifier |
| ENF-SEC-04 | Sauvegardes régulières | Procédure d'exploitation, non vérifiable en local | Hors périmètre |
| ENF-PERF-01 | Temps de chargement optimisés | La liste des véhicules s'affiche en moins de 2 secondes avec 100 véhicules (seuil proposé) | Testable |
| ENF-PERF-02 | Haute disponibilité et montée en charge | Machine unique, hors périmètre | Hors périmètre |
| ENF-UX-01 | Interface responsive | Aucune page ne présente de défilement horizontal à 375 px de large | Testable (priorité faible) |
| ENF-UX-02 | Retour visuel après chaque action | Après un ajout, une modification ou une erreur, un message est visible | Testable |
| ENF-UX-03 | Support du français et de l'arabe | Vérifier que l'arabe est géré par l'interface | À vérifier |

## 3. Ambiguïtés relevées et hypothèses retenues

| N° | Ambiguïté | Exigence concernée | Hypothèse retenue |
|---|---|---|---|
| A1 | Combien de jours avant l'expiration l'alerte est-elle générée ? | EX-ALR-01 | 30 jours, à confirmer par observation |
| A2 | Format du matricule et unicité | EX-VEH-02 | Obligatoire et unique, format libre |
| A3 | Un véhicule vendu peut-il être revendu ou loué ? | EX-VEH-05 | Non : une double vente est un défaut |
| A4 | Plage de prix acceptée pour une vente ou un achat | EX-CTR-03 | Strictement positif, sans maximum précis |
| A5 | Un véhicule vendu génère-t-il encore des alertes ? | EX-ALR-03 | Non |
| A6 | Une échéance peut-elle produire plusieurs alertes identiques ? | EX-ALR-02 | Non, une seule alerte par échéance |
| A7 | Rôles existants et droits associés | EX-SEC-03 | À déterminer en explorant l'application |
| A8 | Suppression d'un ouvrier lié à une réparation | EX-OUV-03 | Refusée, ou historique conservé |
| A9 | Un coût de réparation à 0 DT est-il valide ? | EX-REP-03 | Valide seulement s'il est justifié |
| A10 | La protection CSRF concerne-t-elle une API à jeton ? | ENF-SEC-03 | Hors périmètre si l'API utilise uniquement un jeton |

Chaque hypothèse sera confirmée ou corrigée avant la rédaction finale des cas de test, et la mention de l'hypothèse utilisée figurera dans chaque cas concerné.

## 4. Matrice de traçabilité

Les cas de test (`TC-...`) sont réservés ici et seront rédigés en semaine 4.

| Exigence | Risque(s) | Niveau de test | Cas de test prévus |
|---|---|---|---|
| EX-VEH-01 | R8, R16 | API, interface | TC-VEH-01 |
| EX-VEH-02 | R8 | Unitaire, API | TC-VEH-02, TC-VEH-03 |
| EX-VEH-03 | R17 | API | TC-VEH-04 |
| EX-VEH-04 | R9 | Intégration, API | TC-VEH-05, TC-VEH-06 |
| EX-VEH-05 | R1 | Unitaire, intégration, API | TC-VEH-07, TC-VEH-08 |
| EX-VEH-06 | R12 | Interface | TC-VEH-09 |
| EX-CON-01 | R8 | API | TC-CON-01 |
| EX-CON-02 | R9 | Intégration | TC-CON-02 |
| EX-CON-03 | R12 | Interface | TC-CON-03 |
| EX-CTR-01 | R1, R2 | API, interface | TC-CTR-01 |
| EX-CTR-02 | R1 | API | TC-CTR-02 |
| EX-CTR-03 | R2 | Unitaire, API | TC-CTR-03, TC-CTR-04, TC-CTR-05 |
| EX-CTR-04 | R1 | Intégration | TC-CTR-06 |
| EX-CTR-05 | R1 | Intégration | TC-CTR-07 |
| EX-DOC-01 | R14 | API | TC-DOC-01 |
| EX-DOC-02 | R14 | Intégration | TC-DOC-02 |
| EX-DOC-03 | R14 | Unitaire | TC-DOC-03, TC-DOC-04 |
| EX-ALR-01 | R3 | Unitaire, intégration | TC-ALR-01, TC-ALR-02 |
| EX-ALR-02 | R3 | Intégration | TC-ALR-03 |
| EX-ALR-03 | R3, R1 | Intégration | TC-ALR-04 |
| EX-MNT-01 | R10 | API | TC-MNT-01 |
| EX-REP-01 | R4, R10 | API, interface | TC-REP-01 |
| EX-REP-02 | R10 | Unitaire | TC-REP-02 |
| EX-REP-03 | R10 | Unitaire | TC-REP-03 |
| EX-OUV-01 | R8 | API | TC-OUV-01 |
| EX-OUV-02 | R8 | Intégration | TC-OUV-02 |
| EX-OUV-03 | R11 | Intégration | TC-OUV-03 |
| EX-STK-01 | R4 | API | TC-STK-01 |
| EX-STK-02 | R4 | Unitaire, intégration | TC-STK-02 |
| EX-STK-03 | R4 | Unitaire, intégration | TC-STK-03 |
| EX-FOU-01 | R11 | API | TC-FOU-01 |
| EX-SEC-01 | R5 | API, interface | TC-SEC-01, TC-SEC-02 |
| EX-SEC-02 | R5 | API | TC-SEC-03 |
| EX-SEC-03 | R6 | API | TC-SEC-04 |
| ENF-SEC-01 | R7 | Non fonctionnel | TC-NF-01 |
| ENF-SEC-02 | R5 | Intégration | TC-NF-02 |
| ENF-PERF-01 | R16 | Non fonctionnel | TC-NF-03 |
| ENF-UX-01 | R15 | Interface | TC-NF-04 |

**Couverture des risques** : les risques R1 à R11 et R14 sont couverts par au moins une exigence et un cas prévu. R13 (codes HTTP) est couvert par les tests API de la semaine 8. R12 et R17 sont couverts partiellement.
