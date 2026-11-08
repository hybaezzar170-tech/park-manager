<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;

class TransportPersonnelSeeder extends Seeder
{
    public function run(): void
    {
        $departements = [
            ['nom' => 'Transport Direction', 'type' => 'voiture_5_places'],
            ['nom' => 'Transport Commercial', 'type' => 'voiture_5_places'],
            ['nom' => 'Transport Technique', 'type' => 'voiture_5_places'],
            ['nom' => 'Service Livraison', 'type' => 'utilitaire'],
            ['nom' => 'Maintenance Véhicules', 'type' => 'utilitaire']
        ];

        foreach ($departements as $departement) {
            Departement::create($departement);
        }
    }
}
