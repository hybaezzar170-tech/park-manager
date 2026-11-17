<?php

namespace Tests\Support;

use Illuminate\Support\Facades\DB;

/**
 * Jeux de données reproductibles pour les tests d'intégration.
 * Toutes les données portent le préfixe TEST et sont annulées à la fin de chaque
 * test (DatabaseTransactions) : la base alba_test reste propre.
 */
trait DonneesDeTest
{
    protected function creerDepartement(string $nom = 'TEST Departement'): int
    {
        return (int) DB::table('departements')->insertGetId([
            'nom'        => $nom,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /** Crée une voiture disponible ; les valeurs peuvent être surchargées. */
    protected function creerVoiture(array $surcharges = []): int
    {
        return (int) DB::table('voitures')->insertGetId(array_merge([
            'matricule'           => 'TEST-IT-001',
            'modele'              => 'Peugeot 208',
            'num_serie'           => 'SN-TEST-IT-001',
            'departement_id'      => $surcharges['departement_id'] ?? $this->creerDepartement(),
            'marque'              => 'Peugeot',
            'couleur'             => 'Noir',
            'mise_en_circulation' => '2026-01-01',
            'carburant'           => 'Essence',
            'etat'                => 'disponible',
            'created_at'          => now(),
            'updated_at'          => now(),
        ], $surcharges));
    }

    protected function creerClient(): int
    {
        return (int) DB::table('clients')->insertGetId([
            'nom'        => 'TEST',
            'prenom'     => 'Client',
            'telephone'  => '20123456',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    protected function creerPiece(int $quantite): int
    {
        return (int) DB::table('pieces')->insertGetId([
            'nom'        => 'TEST Filtre a huile',
            'quantite'   => $quantite,
            'prix_achat' => 12.50,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    protected function creerOuvrier(array $surcharges = []): int
    {
        return (int) DB::table('ouvriers')->insertGetId(array_merge([
            'nom'        => 'TEST',
            'prenom'     => 'Meca',
            'type'       => 'mecanicien',
            'statut'     => 'actif',
            'created_at' => now(),
            'updated_at' => now(),
        ], $surcharges));
    }
}
