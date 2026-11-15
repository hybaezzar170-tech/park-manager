<?php

namespace Tests\Unit;

use App\Http\Controllers\Api\VenteController;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

/**
 * TC-CTR-03 : une vente dont le prix est négatif doit être refusée.
 * Exigence : EX-CTR-03 / Risque : R2 / Règle : RG5 / Hypothèse : A4.
 * Anomalie associée : ANO-001.
 *
 * DatabaseTransactions annule toutes les écritures à la fin du test :
 * la base alba_test reste propre.
 */
class VentePrixTest extends TestCase
{
    use DatabaseTransactions;

    public function test_vente_avec_prix_negatif_est_refusee(): void
    {
        // Arrange : un département, une voiture disponible et un client de test
        $departementId = DB::table('departements')->insertGetId([
            'nom'        => 'TEST Departement',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $voitureId = DB::table('voitures')->insertGetId([
            'matricule'           => 'TEST-UT-01',
            'modele'              => 'Peugeot 208',
            'num_serie'           => 'TESTUT01',
            'departement_id'      => $departementId,
            'marque'              => 'Peugeot',
            'couleur'             => 'Noir',
            'mise_en_circulation' => '2026-01-01',
            'carburant'           => 'Essence',
            'etat'                => 'disponible',
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

        $request = Request::create('/api/ventes', 'POST', [
            'voiture_id' => $voitureId,
            'client_id'  => $clientId,
            'prix_vente' => -5555,
            'date_vente' => '2026-11-06',
        ]);

        try {
            (new VenteController())->store($request);
            $this->fail('Une vente à prix négatif aurait dû être refusée (ANO-001).');
        } catch (ValidationException $e) {
            $this->assertArrayHasKey('prix_vente', $e->errors());
        }
    }
}