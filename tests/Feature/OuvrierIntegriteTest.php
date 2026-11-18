<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\Support\DonneesDeTest;
use Tests\TestCase;

class OuvrierIntegriteTest extends TestCase
{
    use DatabaseTransactions, DonneesDeTest;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::create([
            'name' => 'TEST Admin',
            'email' => 'test.ouvrier.integrite@example.com',
            'password' => Hash::make('Password123!'),
            'role' => 'admin',
        ]);

        Sanctum::actingAs($user);
    }

    public function test_supprimer_un_ouvrier_lie_a_une_reparation_conserve_l_historique(): void
    {
        // Arrange : un mécanicien et une réparation rattachée
        $ouvrierId = $this->creerOuvrier();

        $reparationId = DB::table('reparations')->insertGetId([
            'description' => 'TEST Vidange',
            'date_debut' => '2026-11-01',
            'statut' => 'terminee',
            'mecanicien_id' => $ouvrierId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Act : suppression de l'ouvrier
        $reponse = $this->deleteJson("/api/ouvriers/{$ouvrierId}");

        // Assert : pas d'erreur serveur
        $this->assertNotSame(500, $reponse->status());

        $reparation = DB::table('reparations')
            ->where('id', $reparationId)
            ->first();

        $this->assertNotNull($reparation);

        $ouvrierExiste = DB::table('ouvriers')
            ->where('id', $ouvrierId)
            ->exists();

        $this->assertTrue(
            $ouvrierExiste || $reparation->mecanicien_id === null,
            'La réparation référence un ouvrier qui n’existe plus.'
        );
    }

    public function test_deux_ouvriers_ne_peuvent_pas_partager_le_meme_email(): void
    {
        Mail::fake();

        $donnees = [
            'nom' => 'TEST',
            'prenom' => 'Ouvrier',
            'type' => 'mecanicien',
            'email' => 'test.ouvrier@example.com',
        ];

        // Premier ouvrier accepté
        $this->postJson('/api/ouvriers', $donnees)
            ->assertStatus(201);

        // Deuxième ouvrier avec le même e-mail
        $reponse = $this->postJson('/api/ouvriers', $donnees);

        // Refus du doublon
        $this->assertGreaterThanOrEqual(
            400,
            $reponse->status(),
            'Un second ouvrier avec le même e-mail devrait être refusé.'
        );

        $this->assertSame(
            1,
            DB::table('ouvriers')
                ->where('email', 'test.ouvrier@example.com')
                ->count()
        );
    }
}
