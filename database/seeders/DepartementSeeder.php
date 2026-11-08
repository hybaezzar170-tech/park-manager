<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;

class DepartementSeeder extends Seeder
{
    public function run(): void
    {
        $departements = [
            [
                'nom' => 'Transport Personnel',
                'type' => 'voiture_5_places'
            ],
            [
                'nom' => 'Transport Collectif',
                'type' => 'minibus'
            ],
            [
                'nom' => 'Livraison Marchandises',
                'type' => 'utilitaire'
            ],
            [
                'nom' => 'Transport Lourd',
                'type' => 'camion'
            ],
            [
                'nom' => 'Service Client',
                'type' => 'voiture_5_places'
            ]
        ];

        foreach ($departements as $departement) {
            Departement::create($departement);
        }
    }
}
