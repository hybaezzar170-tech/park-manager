<?php

namespace Tests\Unit;

use App\Http\Controllers\Api\ReparationController;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

/**
 * Stock de pièces lors d'une réparation (ReparationController::store).
 * - TC-STK-02 : le stock diminue de 1 quand une pièce est utilisée.
 * - TC-STK-03 : une pièce dont le stock est à 0 ne peut pas être utilisée.
 * Exigences : EX-STK-02, EX-STK-03 / Risque : R4 / Règle : RG7.
 *
 * Remarque : l'API n'accepte pas de quantité (une pièce = 1 unité), donc le cas
 * « utiliser 2 pièces avec un stock de 1 » du catalogue S4 est reformulé en
 * « utiliser 1 pièce avec un stock de 0 ».
 *
 * DatabaseTransactions annule toutes les écritures à la fin de chaque test.
 */
class ReparationStockTest extends TestCase
{
    use DatabaseTransactions;

    public function test_reparation_diminue_le_stock_de_la_piece_de_un(): void
    {
        // Arrange : une pièce en stock de 25
        $pieceId = $this->creerPiece(25);

        // Act : réparation utilisant cette pièce
        $this->enregistrerReparation([$pieceId]);

        // Assert : le stock passe à 24
        $this->assertSame(24, (int) DB::table('pieces')->where('id', $pieceId)->value('quantite'));
    }

    public function test_reparation_avec_une_piece_sans_stock_est_refusee_ou_limitee(): void
    {
        // Arrange : une pièce dont le stock est à 0
        $pieceId = $this->creerPiece(0);

        // Act
        $statut = $this->enregistrerReparation([$pieceId]);

        // Assert : la réparation est refusée, ou la pièce n'est pas rattachée à la réparation
        $refusee  = $statut >= 400;
        $attachee = DB::table('reparation_piece')->where('piece_id', $pieceId)->exists();

        $this->assertTrue(
            $refusee || ! $attachee,
            'Une pièce sans stock ne doit pas être utilisée par une réparation (EX-STK-03).'
        );
    }

    private function creerPiece(int $quantite): int
    {
        return (int) DB::table('pieces')->insertGetId([
            'nom'        => 'TEST Filtre a huile',
            'quantite'   => $quantite,
            'prix_achat' => 12.50,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /** Appelle ReparationController::store et renvoie le code HTTP (422 si la validation refuse). */
    private function enregistrerReparation(array $piecesIds): int
    {
        $request = Request::create('/api/reparations', 'POST', [
            'description'      => 'TEST Vidange',
            'date_debut'       => '2026-12-10',
            'statut'           => 'en_cours',
            'pieces_utilisees' => $piecesIds,
        ]);

        try {
            return (new ReparationController())->store($request)->getStatusCode();
        } catch (ValidationException $e) {
            return 422;
        }
    }
}