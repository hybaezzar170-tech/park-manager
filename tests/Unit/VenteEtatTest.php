<?php

namespace Tests\Unit;

use App\Http\Controllers\Api\VenteController;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

/**
 * TC-VEH-07 : une voiture déjà vendue ne peut pas être revendue.
 * Test témoin : une voiture en location ne peut pas être vendue.
 * Exigence : EX-VEH-05 / Risque : R1 / Règle : RG3 / Hypothèse : A3.
 *
 * DatabaseTransactions annule toutes les écritures à la fin de chaque test.
 */
class VenteEtatTest extends TestCase
{
    use DatabaseTransactions;

    public function test_vente_sur_voiture_en_location_est_refusee(): void
    {
        // Arrange : une voiture à l'état « location » et un client
        [$voitureId, $clientId] = $this->preparer('location');

        // Act : tentative de vente avec un prix valide
        $statut = $this->tenterVente($voitureId, $clientId);

        // Assert : refus et aucune vente enregistrée
        $this->assertGreaterThanOrEqual(400, $statut, 'Une voiture en location ne doit pas pouvoir être vendue.');
        $this->assertSame(0, DB::table('ventes')->where('voiture_id', $voitureId)->count());
    }

    public function test_vente_sur_voiture_deja_vendue_est_refusee(): void
    {
        // Arrange : une voiture déjà à l'état « vendue » et un client
        [$voitureId, $clientId] = $this->preparer('vendue');

        // Act : tentative de revente avec un prix valide
        $statut = $this->tenterVente($voitureId, $clientId);

        // Assert : refus et aucune vente enregistrée
        $this->assertGreaterThanOrEqual(400, $statut, 'Une voiture déjà vendue ne doit pas pouvoir être revendue (TC-VEH-07).');
        $this->assertSame(0, DB::table('ventes')->where('voiture_id', $voitureId)->count());
    }

    /** Crée un département, une voiture dans l'état demandé et un client. */
    private function preparer(string $etat): array
    {
        $departementId = DB::table('departements')->insertGetId([
            'nom'        => 'TEST Departement',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $voitureId = DB::table('voitures')->insertGetId([
            'matricule'           => 'TEST-UT-' . strtoupper($etat),
            'modele'              => 'Peugeot 208',
            'num_serie'           => 'TESTUT' . strtoupper($etat),
            'departement_id'      => $departementId,
            'marque'              => 'Peugeot',
            'couleur'             => 'Noir',
            'mise_en_circulation' => '2026-01-01',
            'carburant'           => 'Essence',
            'etat'                => $etat,
            'created_at'          => now(),
            'updated_at'          => now(),
        ]);

        $clientId = DB::table('clients')->insertGetId([
            'nom'        => 'TEST',
            'prenom'     => 'Client',
            'telephone'  => '20123456',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return [(int) $voitureId, (int) $clientId];
    }

    /** Appelle VenteController::store et renvoie le code HTTP (422 si la validation refuse). */
    private function tenterVente(int $voitureId, int $clientId): int
    {
        $request = Request::create('/api/ventes', 'POST', [
            'voiture_id' => $voitureId,
            'client_id'  => $clientId,
            'prix_vente' => 25000,
            'date_vente' => '2026-11-06',
        ]);

        try {
            return (new VenteController())->store($request)->getStatusCode();
        } catch (ValidationException $e) {
            return 422;
        }
    }
}