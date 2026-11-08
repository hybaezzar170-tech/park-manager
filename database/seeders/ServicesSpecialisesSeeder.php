<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;

class ServicesSpecialisesSeeder extends Seeder
{
    public function run(): void
    {
        $departements = [
            ['nom' => 'Service Client VIP', 'type' => 'voiture_5_places'],
            ['nom' => 'Transport Urgent', 'type' => 'voiture_5_places'],
            ['nom' => 'Navette Aéroport', 'type' => 'minibus'],
            ['nom' => 'Transport Médicalisé', 'type' => 'minibus'],
            ['nom' => 'Livraison Réfrigérée', 'type' => 'utilitaire'],
            ['nom' => 'Transport Déchets', 'type' => 'camion'],
            ['nom' => 'Déménagement', 'type' => 'camion'],
            ['nom' => 'Transport Animaux', 'type' => 'utilitaire']
        ];

        foreach ($departements as $departement) {
            Departement::create($departement);
        }
    }
}
