<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Fournisseur;

class FournisseurSeeder extends Seeder
{
    public function run(): void
    {
        $fournisseurs = [
            [
                'nom' => 'Assurance',
                'prenom' => 'Maroc',
                'tel' => '0522123456',
                'fax' => '0522123457',
                'adresse' => '15 Rue d\'Agadir, Casablanca',
                'ville' => 'Casablanca',
                'code_postal' => '20000',
                'email' => 'contact@assurance-maroc.ma',
                'site_web' => 'https://www.assurance-maroc.ma',
                'contact' => 'Service Commercial',
                'type' => 'Assurance'
            ],
            [
                'nom' => 'Wafa',
                'prenom' => 'Assurance',
                'tel' => '0522345678',
                'fax' => '0522345679',
                'adresse' => '8 Boulevard Mohamed V, Rabat',
                'ville' => 'Rabat',
                'code_postal' => '10000',
                'email' => 'info@wafa-assurance.ma',
                'site_web' => 'https://www.wafa-assurance.ma',
                'contact' => 'Direction Client',
                'type' => 'Assurance'
            ],
            [
                'nom' => 'Auto Pièce',
                'prenom' => 'Plus',
                'tel' => '0523456789',
                'fax' => '0523456790',
                'adresse' => '123 Zone Industrielle, Marrakech',
                'ville' => 'Marrakech',
                'code_postal' => '40000',
                'email' => 'vente@auto-piece-plus.ma',
                'site_web' => 'https://www.auto-piece-plus.ma',
                'contact' => 'Magasin',
                'type' => 'Vente pièce auto'
            ],
            [
                'nom' => 'Centre Visite',
                'prenom' => 'Technique',
                'tel' => '0524567890',
                'fax' => '0524567891',
                'adresse' => '45 Route d\'El Jadida, Casablanca',
                'ville' => 'Casablanca',
                'code_postal' => '20000',
                'email' => 'rdv@centre-visite.ma',
                'site_web' => 'https://www.centre-visite.ma',
                'contact' => 'Réception',
                'type' => 'Visite technique'
            ],
            [
                'nom' => 'Garage Auto',
                'prenom' => 'Pro',
                'tel' => '0525678901',
                'fax' => '0525678902',
                'adresse' => '67 Avenue des FAR, Rabat',
                'ville' => 'Rabat',
                'code_postal' => '10000',
                'email' => 'service@garage-autopro.ma',
                'site_web' => 'https://www.garage-autopro.ma',
                'contact' => 'Atelier',
                'type' => 'Réparation'
            ],
            [
                'nom' => 'Mamda',
                'prenom' => 'Assurance',
                'tel' => '0526789012',
                'fax' => '0526789013',
                'adresse' => '34 Rue Moulay Ismail, Fès',
                'ville' => 'Fès',
                'code_postal' => '30000',
                'email' => 'info@mamda.ma',
                'site_web' => 'https://www.mamda.ma',
                'contact' => 'Service Client',
                'type' => 'Assurance'
            ]
        ];

        foreach ($fournisseurs as $fournisseur) {
            Fournisseur::create($fournisseur);
        }
    }
}
