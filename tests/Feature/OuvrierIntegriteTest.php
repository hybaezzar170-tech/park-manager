<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Tests\Support\DonneesDeTest;
use Tests\TestCase;

/**
 * Intégrité des données des ouvriers, vérifiée dans la base.
 * - IT-05 : supprimer un ouvrier lié à une réparation conserve l'historique (TC-OUV-03)
 * - IT-06 : deux ouvriers ne peuvent pas partager le même e-mail (TC-OUV-02, EX-OUV-02)
 * Risques : R11, R8 / Hypothèse : A8.
 *
 * DatabaseTransactions annule toutes les écritures à la fin de chaque test.
 */
class OuvrierIntegriteTest extends TestCase
{
    use DatabaseTransactions, DonneesDeTest;

    public function test_supprimer_un_ouvrier_lie_a_une_reparation_conserve_l_historique(): void
    {
        // Arrange : un mécanicien et une réparation qui lui est rattachée
        $ouvrierId = $this->creerOuvrier();
        $reparationId = DB::table('reparations')->insertGetId([
            'description'   => 'TEST Vidange',
            'date_debut'    => '2026-11-01',
            'statut'        => 'terminee',
            'mecanicien_id' => $ouvrierId,
            'created_at'    => now(),
            'updated_at'    => now(),
        ]);

        // Act : suppression de l'ouvrier par l'API
        $reponse = $this->deleteJson("/api/ouvriers/{$ouvrierId}");

        // Assert : pas d'erreur serveur, la réparation existe encore et ne référence pas un ouvrier inexistant
        $this->assertNotSame(500, $reponse->status());

        $reparation = DB::table('reparations')->where('id', $reparationId)->first();
        $this->assertNotNull($reparation, "La réparation a disparu avec l'ouvrier : l'historique est perdu.");

        $ouvrierExiste = DB::table('ouvriers')->where('id', $ouvrierId)->exists();
        $this->assertTrue(
            $ouvrierExiste || $reparation->mecanicien_id === null,
            'La réparation référence un ouvrier qui n\'existe plus.'
        );
    }

    public function test_deux_ouvriers_ne_peuvent_pas_partager_le_meme_email(): void
    {
        // Arrange : aucun e-mail réel n'est envoyé
        Mail::fake();
        $donnees = [
            'nom'    => 'TEST',
            'prenom' => 'Ouvrier',
            'type'   => 'mecanicien',
            'email'  => 'test.ouvrier@example.com',
        ];
        $this->postJson('/api/ouvriers', $donnees)->assertStatus(201);

        // Act : second ouvrier avec le même e-mail
        $reponse = $this->postJson('/api/ouvriers', $donnees);

        // Assert : refus, et un seul ouvrier porte cet e-mail
        $this->assertGreaterThanOrEqual(400, $reponse->status(), 'Un second ouvrier avec le même e-mail devrait être refusé (EX-OUV-02).');
        $this->assertSame(1, DB::table('ouvriers')->where('email', 'test.ouvrier@example.com')->count());
    }
}
