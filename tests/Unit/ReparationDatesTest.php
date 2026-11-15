<?php

namespace Tests\Unit;

use App\Http\Controllers\Api\ReparationController;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

/**
 * TC-REP-02 : une réparation dont la date de fin précède la date de début est refusée.
 * Exigence : EX-REP-02 / Risque : R10 / Règle : RG8.
 */
class ReparationDatesTest extends TestCase
{
    public function test_reparation_avec_date_fin_avant_date_debut_est_refusee(): void
    {
        $controller = new ReparationController();
        $request = Request::create('/api/reparations', 'POST', [
            'description' => 'TEST Vidange',
            'date_debut'  => '2026-12-10',
            'date_fin'    => '2026-12-09',
            'statut'      => 'en_cours',
        ]);

        try {
            $controller->store($request);
            $this->fail('La réparation aurait dû être refusée (ValidationException attendue).');
        } catch (ValidationException $e) {
            $this->assertArrayHasKey('date_fin', $e->errors());
        }
    }
}