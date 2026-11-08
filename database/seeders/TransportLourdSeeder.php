<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;

class TransportLourdSeeder extends Seeder
{
    public function run(): void
    {
        $departements = [
            ['nom' => 'Transport Longue Distance', 'type' => 'camion'],
            ['nom' => 'Transport Lourd', 'type' => 'camion'],
            ['nom' => 'Logistique Industrielle', 'type' => 'camion'],
            ['nom' => 'Transport Matériaux', 'type' => 'camion'],
            ['nom' => 'Fret National', 'type' => 'camion']
        ];

        foreach ($departements as $departement) {
            Departement::create($departement);
        }
    }
}
