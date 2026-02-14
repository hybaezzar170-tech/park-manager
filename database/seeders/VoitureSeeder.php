<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Voiture;

class VoitureSeeder extends Seeder
{
    public function run(): void
    {
        $voitures = [
            [
                'matricule' => '12345-A-67',
                'modele' => 'Renault Clio 4',
                'num_serie' => 'VF1RE123456789',
                'type_departement' => 'SUV',
                'departement_id' => 2, // Using existing department
                'conducteur_id' => 1, // Using existing conducteur
                'marque' => 'Renault',
                'couleur' => 'Blanc',
                'mise_en_circulation' => '2020-03-15',
                'carburant' => 'Essence',
                'etat' => 'disponible',
                'prix_achat' => 85000.00,
                'date_achat' => '2020-03-10',
                'fournisseur_id' => 1 // Using existing fournisseur
            ],
            [
                'matricule' => '98765-B-89',
                'modele' => 'Dacia Duster',
                'num_serie' => 'U1HA987654321',
                'type_departement' => 'SUV',
                'departement_id' => 3, // Using existing department
                'conducteur_id' => 2, // Using existing conducteur
                'marque' => 'Dacia',
                'couleur' => 'Gris',
                'mise_en_circulation' => '2021-06-20',
                'carburant' => 'Diesel',
                'etat' => 'en_location',
                'prix_achat' => 120000.00,
                'date_achat' => '2021-06-15',
                'fournisseur_id' => 2 // Using existing fournisseur
            ],
            [
                'matricule' => '45678-C-12',
                'modele' => 'Peugeot 208',
                'num_serie' => 'VR3BE456789012',
                'type_departement' => 'S',
                'departement_id' => 2, // Using existing department
                'conducteur_id' => 3, // Using existing conducteur
                'marque' => 'Peugeot',
                'couleur' => 'Rouge',
                'mise_en_circulation' => '2019-11-08',
                'carburant' => 'Essence',
                'etat' => 'disponible',
                'prix_achat' => 95000.00,
                'date_achat' => '2019-11-01',
                'fournisseur_id' => 3 // Using existing fournisseur
            ],
            [
                'matricule' => '78901-D-34',
                'modele' => 'Volkswagen Golf',
                'num_serie' => 'WVWZZZ789012345',
                'type_departement' => 'S',
                'departement_id' => 3, // Using existing department
                'conducteur_id' => 4, // Using existing conducteur
                'marque' => 'Volkswagen',
                'couleur' => 'Noir',
                'mise_en_circulation' => '2022-01-25',
                'carburant' => 'Diesel',
                'etat' => 'en_maintenance',
                'prix_achat' => 145000.00,
                'date_achat' => '2022-01-20',
                'fournisseur_id' => 4 // Using existing fournisseur
            ],
            [
                'matricule' => '23456-E-56',
                'modele' => 'Hyundai Tucson',
                'num_serie' => 'KMHHN812345678',
                'type_departement' => 'SUV',
                'departement_id' => 2, // Using existing department
                'conducteur_id' => 5, // Using existing conducteur
                'marque' => 'Hyundai',
                'couleur' => 'Bleu',
                'mise_en_circulation' => '2023-04-12',
                'carburant' => 'Essence',
                'etat' => 'disponible',
                'prix_achat' => 180000.00,
                'date_achat' => '2023-04-05',
                'fournisseur_id' => 5 // Using existing fournisseur
            ]
        ];

        foreach ($voitures as $voiture) {
            Voiture::create($voiture);
        }
    }
}
