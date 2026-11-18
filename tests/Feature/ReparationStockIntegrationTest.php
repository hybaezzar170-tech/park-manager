<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\Support\DonneesDeTest;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use App\Models\User;

class ReparationStockIntegrationTest extends TestCase
{
    use DatabaseTransactions, DonneesDeTest;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::create([
            'name' => 'TEST Admin',
            'email' => 'test.reparation.stock@example.com',
            'password' => Hash::make('Password123!'),
            'role' => 'admin',
        ]);

        Sanctum::actingAs($user);
    }

    public function test_supprimer_une_reparation_restitue_le_stock_utilise(): void
    {
        // Arrange : une pièce avec un stock de 25
        $pieceId = $this->creerPiece(25);
        $reparationId = $this->creerReparationParApi($pieceId);

        $this->assertSame(24, $this->stock($pieceId));

        // Act : suppression de la réparation
        $this->deleteJson("/api/reparations/{$reparationId}")
            ->assertStatus(204);

        // Assert : le stock revient à 25
        $this->assertSame(25, $this->stock($pieceId));
    }

    public function test_reparation_sans_stock_est_refusee_et_le_stock_reste_a_zero(): void
    {
        // Arrange : une pièce sans stock
        $pieceId = $this->creerPiece(0);

        // Act : tenter de créer une réparation
        $reponse = $this->postJson('/api/reparations', [
            'description' => 'TEST Vidange',
            'date_debut' => '2026-12-10',
            'statut' => 'en_cours',
            'pieces_utilisees' => [$pieceId],
        ]);

        // Assert : création refusée
        $reponse->assertStatus(422);

        // Le stock reste à zéro
        $this->assertSame(
            0,
            $this->stock($pieceId),
            'Le stock ne doit pas devenir négatif ni augmenter artificiellement.'
        );
    }

    private function creerReparationParApi(int $pieceId): int
    {
        $reponse = $this->postJson('/api/reparations', [
            'description' => 'TEST Vidange',
            'date_debut' => '2026-12-10',
            'statut' => 'en_cours',
            'pieces_utilisees' => [$pieceId],
        ]);

        $reponse->assertStatus(201);

        return (int) $reponse->json('id');
    }

    private function stock(int $pieceId): int
    {
        return (int) DB::table('pieces')
            ->where('id', $pieceId)
            ->value('quantite');
    }
}
