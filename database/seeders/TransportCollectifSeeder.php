<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;

class TransportCollectifSeeder extends Seeder
{
    public function run(): void
    {
        $departements = [
            ['nom' => 'Transport Scolaire', 'type' => 'minibus'],
            ['nom' => 'Transport Public', 'type' => 'minibus'],
            ['nom' => 'Navette Urbaine', 'type' => 'minibus'],
            ['nom' => 'Transport Touristique', 'type' => 'minibus'],
            ['nom' => 'Service Excursions', 'type' => 'minibus']
        ];

        foreach ($departements as $departement) {
            Departement::create($departement);
        }
    }
}
