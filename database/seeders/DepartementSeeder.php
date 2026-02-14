<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;

class DepartementSeeder extends Seeder
{
    public function run(): void
    {
        $departements = [
            ['nom' => 'Rabat-Salé-Kénitra'],
            ['nom' => 'Casablanca-Settat'],
            ['nom' => 'Marrakech-Safi'],
            ['nom' => 'Fès-Meknès'],
            ['nom' => 'Tanger-Tétouan-Al Hoceïma'],
            ['nom' => 'Oriental'],
            ['nom' => 'Béni Mellal-Khénifra'],
            ['nom' => 'Souss-Massa'],
            ['nom' => 'Guelmim-Oued Noun'],
            ['nom' => 'Laâyoune-Sakia El Hamra'],
            ['nom' => 'Dakhla-Oued Ed-Dahab'],
            ['nom' => 'Drâa-Tafilalet'],
        ];

        foreach ($departements as $departement) {
            Departement::create($departement);
        }
    }
}
