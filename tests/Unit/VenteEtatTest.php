<?php

namespace Tests\Unit;

use App\Http\Controllers\Api\VenteController;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

/**
 * Vente selon l'état de la voiture (VenteController::store).
 * - UT-03 : une voiture en location ne peut pas être vendue   (anomalie ANO-007)
 * - UT-04 : une voiture déjà vendue ne peut pas être revendue (anomalie ANO-005, TC-VEH-07)
 * - UT-09 : témoin, une vente valide sur une voiture disponible est enregistrée
 * Exigence : EX-VEH-05 / Risque : R1 / Règle : RG3 / Hypothèse : A3.
 *
 * Les états utilisés sont ceux réellement écrits en base : disponible, en_location, vendue.
 * DatabaseTransactions annule toutes les écritures à la fin de chaque test.
 */
class VenteEtatTest extends TestCase
{
    use DatabaseTransactions;

    public function test_vente_sur_voiture_en_location_est_refusee(): void
    {
        // Arrange : une voiture à l'état « en_location » et un client
        [$voitureId, $clientId] = $this->preparer('en_location');

        // Act : tentative de vente avec un prix valide
        $statut = $this->tenterVente($voitureId, $clientId);

        // Assert : refus et aucune vente enregistrée
        $this->assertGreaterThanOrEqual(400, $statut, 'Une voiture en location ne doit pas pouvoir être vendue (ANO-007).');
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

    public function test_vente_valide_sur_voiture_disponible_est_enregistree(): void
    {
        // Arrange : une voiture disponible et un client
        [$voitureId, $clientId] = $this->preparer('disponible');

        // Act : vente avec un prix valide
        $statut = $this->tenterVente($voitureId, $clientId);

        // Assert : vente créée (201), une ligne en base, voiture passée à « vendue »
        $this->assertSame(201, $statut);
        $this->assertSame(1, DB::table('ventes')->where('voiture_id', $voitureId)->count());
        $this->assertSame('vendue', DB::table('voitures')->where('id', $voitureId)->value('etat'));
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