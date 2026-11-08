<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;

class LivraisonMarchandiseSeeder extends Seeder
{
    public function run(): void
    {
        $departements = [
            ['nom' => 'Logistique Centre-ville', 'type' => 'utilitaire'],
            ['nom' => 'Distribution Régionale', 'type' => 'utilitaire'],
            ['nom' => 'Livraison Express', 'type' => 'utilitaire'],
            ['nom' => 'Transport Marchandises', 'type' => 'utilitaire'],
            ['nom' => 'Service Messagerie', 'type' => 'utilitaire']
        ];

        foreach ($departements as $departement) {
            Departement::create($departement);
        }
    }
}
