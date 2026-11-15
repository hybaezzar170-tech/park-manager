<?php

namespace Tests\Unit;

use App\Http\Controllers\Api\AlerteController;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

/**
 * Tests de AlerteController::getExpirationAlerts().
 *
 * - TC-ALR-01 : le temps restant d'une alerte est correct   (ANO-004)
 * - TC-ALR-04 : un véhicule vendu ne génère pas d'alerte    (ANO-003)
 * Exigences : EX-ALR-01, EX-ALR-03 / Risque : R3 / Hypothèse : A5.
 *
 * Double de test : l'horloge est figée avec Carbon::setTestNow() pour que le
 * résultat ne dépende pas du jour d'exécution.
 * DatabaseTransactions annule toutes les écritures à la fin de chaque test.
 */
class AlerteTest extends TestCase
{
    use DatabaseTransactions;

    protected function tearDown(): void
    {
        Carbon::setTestNow(); // rétablit l'horloge réelle
        parent::tearDown();
    }

    public function test_echeance_du_lendemain_affiche_un_jour_restant(): void
    {
        // Arrange : horloge figée au 13/11/2026 à 21:22, assurance expirant le 14/11/2026
        Carbon::setTestNow(Carbon::create(2026, 11, 13, 21, 22, 0));
        $voitureId = $this->creerVoiture('disponible', 'TEST-UT-AL1');
        $this->creerAssurance($voitureId, '2026-11-14');

        // Act
        $alerte = $this->alertePour($this->lireAlertes(), 'TEST-UT-AL1');

        // Assert : une alerte existe et indique 1 jour restant
        $this->assertNotNull($alerte, 'Une alerte est attendue pour une échéance à J+1.');
        $this->assertEquals(1, $alerte['days_remaining'], 'Échéance demain : 1 jour restant attendu (ANO-004).');
    }

    public function test_vehicule_vendu_ne_genere_pas_d_alerte(): void
    {
        // Arrange : voiture vendue avec une assurance expirant le lendemain
        Carbon::setTestNow(Carbon::create(2026, 11, 13, 21, 22, 0));
        $voitureId = $this->creerVoiture('vendue', 'TEST-UT-AL2');
        $this->creerAssurance($voitureId, '2026-11-14');

        // Act
        $alerte = $this->alertePour($this->lireAlertes(), 'TEST-UT-AL2');

        // Assert : aucune alerte pour ce véhicule
        $this->assertNull($alerte, 'Un véhicule vendu ne doit pas générer d\'alerte (ANO-003).');
    }

    /** Appelle le contrôleur et renvoie la liste des alertes sous forme de tableau. */
    private function lireAlertes(): array
    {
        return (new AlerteController())->getExpirationAlerts()->getData(true);
    }

    /** Cherche l'alerte dont le champ « voiture » contient le matricule donné. */
    private function alertePour(array $alertes, string $matricule): ?array
    {
        foreach ($alertes as $alerte) {
            if (str_contains($alerte['voiture'], $matricule)) {
                return $alerte;
            }
        }

        return null;
    }

    private function creerVoiture(string $etat, string $matricule): int
    {
        $departementId = DB::table('departements')->insertGetId([
            'nom'        => 'TEST Departement',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return (int) DB::table('voitures')->insertGetId([
            'matricule'           => $matricule,
            'modele'              => 'Peugeot 208',
            'num_serie'           => 'SN-' . $matricule,
            'departement_id'      => $departementId,
            'marque'              => 'Peugeot',
            'couleur'             => 'Noir',
            'mise_en_circulation' => '2026-01-01',
            'carburant'           => 'Essence',
            'etat'                => $etat,
            'created_at'          => now(),
            'updated_at'          => now(),
        ]);
    }

    private function creerAssurance(int $voitureId, string $dateExpiration): void
    {
        DB::table('assurances')->insert([
            'voiture_id'      => $voitureId,
            'type_assurance'  => 'Tiers',
            'date_debut'      => '2026-01-01',
            'date_expiration' => $dateExpiration,
            'rappel_jours'    => 0,
            'created_at'      => now(),
            'updated_at'      => now(),
        ]);
    }
}
