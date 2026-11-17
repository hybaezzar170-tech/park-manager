<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\Support\DonneesDeTest;
use Tests\TestCase;

/**
 * Cohérence du stock de pièces à travers la création et la suppression d'une réparation.
 * - IT-07a : supprimer une réparation restitue le stock qu'elle avait consommé
 * - IT-07b : supprimer une réparation créée avec une pièce sans stock ne doit pas gonfler le stock
 * Exigences : EX-STK-02, EX-STK-03 / Risque : R4 / Anomalie liée : ANO-006.
 *
 * DatabaseTransactions annule toutes les écritures à la fin de chaque test.
 */
class ReparationStockIntegrationTest extends TestCase
{
    use DatabaseTransactions, DonneesDeTest;

    public function test_supprimer_une_reparation_restitue_le_stock_utilise(): void
    {
        // Arrange : une pièce en stock de 25 et une réparation qui en utilise une
        $pieceId = $this->creerPiece(25);
        $reparationId = $this->creerReparationParApi($pieceId);
        $this->assertSame(24, $this->stock($pieceId));

        // Act : suppression de la réparation
        $this->deleteJson("/api/reparations/{$reparationId}")->assertStatus(204);

        // Assert : le stock est revenu à 25
        $this->assertSame(25, $this->stock($pieceId));
    }

    public function test_supprimer_une_reparation_creee_sans_stock_ne_gonfle_pas_le_stock(): void
    {
        // Arrange : une pièce dont le stock est à 0 ; la réparation est acceptée sans décrément (ANO-006)
        $pieceId = $this->creerPiece(0);
        $reparationId = $this->creerReparationParApi($pieceId);
        $this->assertSame(0, $this->stock($pieceId));

        // Act : suppression de la réparation
        $this->deleteJson("/api/reparations/{$reparationId}")->assertStatus(204);

        // Assert : le stock doit rester à 0 (aucune pièce n'avait été consommée)
        $this->assertSame(0, $this->stock($pieceId), 'Le stock a augmenté sans achat de pièce (suite d\'ANO-006).');
    }

    private function creerReparationParApi(int $pieceId): int
    {
        $reponse = $this->postJson('/api/reparations', [
            'description'      => 'TEST Vidange',
            'date_debut'       => '2026-12-10',
            'statut'           => 'en_cours',
            'pieces_utilisees' => [$pieceId],
        ]);
        $reponse->assertStatus(201);

        return (int) $reponse->json('id');
    }

    private function stock(int $pieceId): int
    {
        return (int) DB::table('pieces')->where('id', $pieceId)->value('quantite');
    }
}
