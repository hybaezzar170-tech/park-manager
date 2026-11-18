<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\Support\DonneesDeTest;
use Tests\TestCase;

class VoitureCrudTest extends TestCase
{
    use DatabaseTransactions, DonneesDeTest;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::create([
            'name' => 'TEST Admin',
            'email' => 'test.crud.voiture@example.com',
            'password' => Hash::make('Password123!'),
            'role' => 'admin',
        ]);

        Sanctum::actingAs($user);
    }

    public function test_cycle_creer_lire_modifier_supprimer_une_voiture(): void
    {
        // Arrange : un département et les données d'une voiture valide
        $departementId = $this->creerDepartement();

        $donnees = [
            'matricule'           => 'TEST-IT-100',
            'modele'              => 'Peugeot 208',
            'num_serie'           => 'SN-TEST-IT-100',
            'departement_id'      => $departementId,
            'marque'              => 'Peugeot',
            'couleur'             => 'Noir',
            'mise_en_circulation' => '2026-01-01',
            'carburant'           => 'Essence',
        ];

        // Création
        $creation = $this->postJson('/api/voitures', $donnees);

        $creation->assertStatus(201);

        $this->assertDatabaseHas('voitures', [
            'matricule' => 'TEST-IT-100',
            'etat' => 'disponible',
        ]);

        $id = $creation->json('data.id');

        // Lecture
        $this->getJson("/api/voitures/{$id}")
            ->assertStatus(200)
            ->assertJsonFragment([
                'matricule' => 'TEST-IT-100',
            ]);

        // Modification
        $this->putJson("/api/voitures/{$id}", [
            'couleur' => 'Blanc',
        ])->assertStatus(200);

        $this->assertDatabaseHas('voitures', [
            'id' => $id,
            'couleur' => 'Blanc',
        ]);

        // Suppression
        $this->deleteJson("/api/voitures/{$id}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('voitures', [
            'id' => $id,
        ]);
    }
}
