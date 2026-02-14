<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Conducteur;

class ConducteurSeeder extends Seeder
{
    public function run(): void
    {
        $conducteurs = [
            [
                'nom' => 'Alami',
                'prenom' => 'Mohammed',
                'telephone' => '0612345678',
                'adresse' => '123 Rue Mohammed V, Rabat',
                'ville' => 'Rabat',
                'code_postal' => '10000',
                'email' => 'mohammed.alami1@email.com',
                'date_naissance' => '1985-05-15',
                'date_embauche' => '2020-01-15',
                'numero_permis' => 'B1234567'
            ],
            [
                'nom' => 'Zahra',
                'prenom' => 'Fatima',
                'telephone' => '0623456789',
                'adresse' => '45 Avenue Hassan II, Casablanca',
                'ville' => 'Casablanca',
                'code_postal' => '20000',
                'email' => 'fatima.zahra2@email.com',
                'date_naissance' => '1990-08-22',
                'date_embauche' => '2018-03-10',
                'numero_permis' => 'B7890123'
            ],
            [
                'nom' => 'Karim',
                'prenom' => 'Abdelkrim',
                'telephone' => '0634567890',
                'adresse' => '78 Boulevard Zerktouni, Marrakech',
                'ville' => 'Marrakech',
                'code_postal' => '40000',
                'email' => 'abdelkrim.karim3@email.com',
                'date_naissance' => '1988-12-03',
                'date_embauche' => '2019-06-20',
                'numero_permis' => 'B3456789'
            ],
            [
                'nom' => 'Benjelloun',
                'prenom' => 'Amina',
                'telephone' => '0645678901',
                'adresse' => '12 Rue Agdal, Fès',
                'ville' => 'Fès',
                'code_postal' => '30000',
                'email' => 'amina.benjelloun4@email.com',
                'date_naissance' => '1992-04-18',
                'date_embauche' => '2021-09-15',
                'numero_permis' => 'B9012345'
            ],
            [
                'nom' => 'Amrani',
                'prenom' => 'Youssef',
                'telephone' => '0656789012',
                'adresse' => '89 Place Nations Unies, Tanger',
                'ville' => 'Tanger',
                'code_postal' => '90000',
                'email' => 'youssef.amrani5@email.com',
                'date_naissance' => '1987-09-30',
                'date_embauche' => '2017-12-01',
                'numero_permis' => 'B5678901'
            ]
        ];

        foreach ($conducteurs as $conducteur) {
            Conducteur::create($conducteur);
        }
    }
}
