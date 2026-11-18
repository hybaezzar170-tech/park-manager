<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\Support\DonneesDeTest;
use Tests\TestCase;

/**
 * Intégrité des données des voitures, vérifiée dans la base.
 * - IT-02 : un doublon de matricule envoyé à l'API est refusé
 * - IT-03 : la base elle-même refuse un doublon de matricule
 * - IT-04 : supprimer une voiture ne laisse pas de ventes orphelines
 */
class VoitureIntegriteTest extends TestCase
{
    use DatabaseTransactions, DonneesDeTest;

    /**
     * Authentification pour les routes protégées par Sanctum.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $user = User::create([
            'name' => 'TEST Admin',
            'email' => 'test.voiture@example.com',
            'password' => Hash::make('Password123!'),
            'role' => 'admin',
        ]);

        Sanctum::actingAs($user);
    }

    public function test_doublon_de_matricule_envoye_a_l_api_est_refuse_et_la_base_reste_inchangee(): void
    {
        // Arrange : une première voiture créée par l'API
        $donnees = [
            'matricule'           => 'TEST-IT-300',
            'modele'              => 'Peugeot 208',
            'num_serie'           => 'SN-TEST-IT-300',
            'departement_id'      => $this->creerDepartement(),
            'marque'              => 'Peugeot',
            'couleur'             => 'Noir',
            'mise_en_circulation' => '2026-01-01',
            'carburant'           => 'Essence',
        ];

        $this->postJson('/api/voitures', $donnees)
            ->assertStatus(201);

        // Act : seconde voiture avec le même matricule
        $reponse = $this->postJson(
            '/api/voitures',
            array_merge($donnees, [
                'num_serie' => 'SN-TEST-IT-301',
            ])
        );

        // Assert : refus et une seule voiture porte ce matricule
        $this->assertGreaterThanOrEqual(400, $reponse->status());

        $this->assertSame(
            1,
            DB::table('voitures')
                ->where('matricule', 'TEST-IT-300')
                ->count()
        );
    }

    public function test_la_base_refuse_un_doublon_de_matricule(): void
    {
        // Arrange : une voiture insérée directement en base
        $this->creerVoiture([
            'matricule' => 'TEST-IT-200',
            'num_serie' => 'SN-TEST-IT-200-A',
        ]);

        // Act + Assert : la base doit refuser le doublon
        try {
            $this->creerVoiture([
                'matricule' => 'TEST-IT-200',
                'num_serie' => 'SN-TEST-IT-200-B',
            ]);

            $this->fail(
                'La base aurait dû refuser un doublon de matricule.'
            );
        } catch (QueryException $e) {
            $this->assertStringContainsString(
                'Duplicate entry',
                $e->getMessage()
            );
        }
    }

    public function test_supprimer_une_voiture_ne_laisse_pas_de_ventes_orphelines(): void
    {
        // Arrange : une voiture vendue avec une vente enregistrée
        $voitureId = $this->creerVoiture([
            'matricule' => 'TEST-IT-400',
            'num_serie' => 'SN-TEST-IT-400',
            'etat' => 'vendue',
        ]);

        DB::table('ventes')->insert([
            'voiture_id' => $voitureId,
            'client_id'  => $this->creerClient(),
            'prix_vente' => 25000,
            'date_vente' => '2026-11-06',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Act : suppression de la voiture par l'API
        $this->deleteJson("/api/voitures/{$voitureId}");

        // Assert : la voiture existe encore ou aucune vente n'est orpheline
        $voitureExiste = DB::table('voitures')
            ->where('id', $voitureId)
            ->exists();

        $ventesOrphelines = DB::table('ventes')
            ->where('voiture_id', $voitureId)
            ->count();

        $this->assertTrue(
            $voitureExiste || $ventesOrphelines === 0,
            "La voiture a été supprimée alors que {$ventesOrphelines} vente(s) pointent encore vers elle."
        );
    }
}
