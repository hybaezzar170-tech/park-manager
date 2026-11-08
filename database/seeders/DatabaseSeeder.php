<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            DepartementSeeder::class,
            TransportPersonnelSeeder::class,
            TransportCollectifSeeder::class,
            LivraisonMarchandiseSeeder::class,
            TransportLourdSeeder::class,
            ServicesSpecialisesSeeder::class,
            ConducteurSeeder::class,
            FournisseurSeeder::class,
            VoitureSeeder::class,
        ]);
    }
}
