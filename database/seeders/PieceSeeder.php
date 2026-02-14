<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Piece;
use App\Models\Fournisseur;

class PieceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer des fournisseurs de type 'Vente pièce auto' s'ils n'existent pas
        $fournisseurs = [
            [
                'nom' => 'AutoParts Pro',
                'prenom' => 'Contact',
                'type' => 'Vente pièce auto',
                'email' => 'contact@autopartspro.com',
                'tel' => '0123456789',
                'fax' => '0123456788',
                'site_web' => 'www.autopartspro.com',
                'adresse' => '123 Rue des Pièces',
                'ville' => 'Paris',
                'code_postal' => '75001',
                'contact' => 'Jean Dupont'
            ],
            [
                'nom' => 'MecaShop',
                'prenom' => 'Service',
                'type' => 'Vente pièce auto',
                'email' => 'service@mecashop.com',
                'tel' => '0234567890',
                'fax' => '0234567891',
                'site_web' => 'www.mecashop.com',
                'adresse' => '456 Avenue Mécanique',
                'ville' => 'Lyon',
                'code_postal' => '69001',
                'contact' => 'Marie Martin'
            ],
            [
                'nom' => 'CarEssential',
                'prenom' => 'Support',
                'type' => 'Vente pièce auto',
                'email' => 'support@caressential.com',
                'tel' => '0345678901',
                'fax' => '0345678902',
                'site_web' => 'www.caressential.com',
                'adresse' => '789 Boulevard Automobile',
                'ville' => 'Marseille',
                'code_postal' => '13001',
                'contact' => 'Pierre Durand'
            ]
        ];

        $createdFournisseurs = [];
        foreach ($fournisseurs as $fournisseurData) {
            $fournisseur = Fournisseur::firstOrCreate(
                ['email' => $fournisseurData['email']],
                $fournisseurData
            );
            $createdFournisseurs[] = $fournisseur;
        }

        // Créer des pièces de test
        $pieces = [
            [
                'nom' => 'Filtre à huile',
                'modele' => 'Renault Clio',
                'quantite' => 25,
                'prix_achat' => 12.50,
                'type_piece' => 'Filtration',
                'fournisseur_id' => $createdFournisseurs[0]->id
            ],
            [
                'nom' => 'Plaquette de frein avant',
                'modele' => 'Peugeot 208',
                'quantite' => 15,
                'prix_achat' => 45.00,
                'type_piece' => 'Freinage',
                'fournisseur_id' => $createdFournisseurs[1]->id
            ],
            [
                'nom' => 'Amortisseur arrière',
                'modele' => 'Citroën C3',
                'quantite' => 8,
                'prix_achat' => 35.75,
                'type_piece' => 'Suspension',
                'fournisseur_id' => $createdFournisseurs[2]->id
            ],
            [
                'nom' => 'Batterie 12V',
                'modele' => 'Volkswagen Golf',
                'quantite' => 12,
                'prix_achat' => 85.00,
                'type_piece' => 'Électricité',
                'fournisseur_id' => $createdFournisseurs[0]->id
            ],
            [
                'nom' => 'Bougie d\'allumage',
                'modele' => 'Ford Fiesta',
                'quantite' => 50,
                'prix_achat' => 8.25,
                'type_piece' => 'Allumage',
                'fournisseur_id' => $createdFournisseurs[1]->id
            ],
            [
                'nom' => 'Courroie de distribution',
                'modele' => 'BMW Série 3',
                'quantite' => 6,
                'prix_achat' => 65.00,
                'type_piece' => 'Moteur',
                'fournisseur_id' => $createdFournisseurs[2]->id
            ],
            [
                'nom' => 'Disque de frein ventilé',
                'modele' => 'Mercedes Classe C',
                'quantite' => 10,
                'prix_achat' => 55.50,
                'type_piece' => 'Freinage',
                'fournisseur_id' => $createdFournisseurs[0]->id
            ],
            [
                'nom' => 'Kit d\'embrayage',
                'modele' => 'Audi A4',
                'quantite' => 4,
                'prix_achat' => 120.00,
                'type_piece' => 'Transmission',
                'fournisseur_id' => $createdFournisseurs[1]->id
            ],
            [
                'nom' => 'Radiateur de refroidissement',
                'modele' => 'Opel Astra',
                'quantite' => 7,
                'prix_achat' => 95.00,
                'type_piece' => 'Refroidissement',
                'fournisseur_id' => $createdFournisseurs[2]->id
            ],
            [
                'nom' => 'Pompe à eau',
                'modele' => 'Toyota Yaris',
                'quantite' => 18,
                'prix_achat' => 42.00,
                'type_piece' => 'Refroidissement',
                'fournisseur_id' => $createdFournisseurs[0]->id
            ],
            [
                'nom' => 'Capteur d\'oxygène',
                'modele' => 'Nissan Qashqai',
                'quantite' => 20,
                'prix_achat' => 75.00,
                'type_piece' => 'Électricité',
                'fournisseur_id' => $createdFournisseurs[1]->id
            ],
            [
                'nom' => 'Silencieux d\'échappement',
                'modele' => 'Hyundai i20',
                'quantite' => 9,
                'prix_achat' => 110.00,
                'type_piece' => 'Échappement',
                'fournisseur_id' => $createdFournisseurs[2]->id
            ],
            [
                'nom' => 'Joint de culasse',
                'modele' => 'Kia Rio',
                'quantite' => 5,
                'prix_achat' => 25.00,
                'type_piece' => 'Moteur',
                'fournisseur_id' => $createdFournisseurs[0]->id
            ],
            [
                'nom' => 'Retroviseur extérieur gauche',
                'modele' => 'Fiat 500',
                'quantite' => 30,
                'prix_achat' => 15.75,
                'type_piece' => 'Carrosserie',
                'fournisseur_id' => $createdFournisseurs[1]->id
            ],
            [
                'nom' => 'Compresseur de climatisation',
                'modele' => 'Mini Cooper',
                'quantite' => 3,
                'prix_achat' => 180.00,
                'type_piece' => 'Climatisation',
                'fournisseur_id' => $createdFournisseurs[2]->id
            ],
            [
                'nom' => 'Pneu été 205/55 R16',
                'modele' => 'Smart ForTwo',
                'quantite' => 40,
                'prix_achat' => 65.00,
                'type_piece' => 'Roues/Pneus',
                'fournisseur_id' => $createdFournisseurs[0]->id
            ],
            [
                'nom' => 'Huile moteur 5W30',
                'modele' => 'Dacia Sandero',
                'quantite' => 100,
                'prix_achat' => 6.50,
                'type_piece' => 'Lubrification',
                'fournisseur_id' => $createdFournisseurs[1]->id
            ],
            [
                'nom' => 'Essuie-glace avant',
                'modele' => 'Dacia Logan',
                'quantite' => 25,
                'prix_achat' => 18.00,
                'type_piece' => 'Accessoires',
                'fournisseur_id' => $createdFournisseurs[2]->id
            ]
        ];

        foreach ($pieces as $pieceData) {
            Piece::firstOrCreate(
                [
                    'nom' => $pieceData['nom'],
                    'modele' => $pieceData['modele']
                ],
                $pieceData
            );
        }

        $this->command->info('Pièces et fournisseurs de test créés avec succès!');
    }
}
