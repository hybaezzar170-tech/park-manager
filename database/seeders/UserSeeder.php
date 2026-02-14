<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un utilisateur admin par défaut
        User::create([
            'name' => 'Admin ALBA',
            'email' => 'admin@alba.com',
            'password' => Hash::make('123456'),
            'role' => 'admin',
        ]);

        // Créer un utilisateur normal par défaut
        User::create([
            'name' => 'Utilisateur ALBA',
            'email' => 'user@alba.com',
            'password' => Hash::make('123456'),
            'role' => 'user',
        ]);

        // Créer quelques utilisateurs supplémentaires pour les tests
        User::create([
            'name' => 'Jean Dupont',
            'email' => 'jean.dupont@alba.com',
            'password' => Hash::make('123456'),
            'role' => 'user',
        ]);

        User::create([
            'name' => 'Marie Martin',
            'email' => 'marie.martin@alba.com',
            'password' => Hash::make('123456'),
            'role' => 'user',
        ]);

        User::create([
            'name' => 'Pierre Bernard',
            'email' => 'pierre.bernard@alba.com',
            'password' => Hash::make('123456'),
            'role' => 'admin',
        ]);
    }
}
