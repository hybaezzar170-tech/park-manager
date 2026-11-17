<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\Support\DonneesDeTest;
use Tests\TestCase;

/**
 * IT-01 : cycle complet d'une voiture à travers les vraies routes HTTP, avec
 * vérification de l'état de la base à chaque étape (persistance).
 * Cas de test : TC-VEH-01 / Exigence : EX-VEH-01 / Risque : R8.
 */
class VoitureCrudTest extends TestCase
{
    use DatabaseTransactions, DonneesDeTest;

    public function test_cycle_creer_lire_modifier_supprimer_une_voiture(): void
    {
        // Arrange : un département et les données d'une voiture valide
        $departementId = $this->creerDepartement();
        $donnees = [
            'matricule'           => 'TEST-IT-100',
            'modele'              => 'Peugeot 208',
            'num_serie'           => 'SN-TEST-IT-100',
            'departement_id'      => $departementId,
            'marque'              => 'Peugeot',
            'couleur'             => 'Noir',
            'mise_en_circulation' => '2026-01-01',
            'carburant'           => 'Essence',
        ];

        // Act + Assert : création, la ligne existe en base à l'état « disponible »
        $creation = $this->postJson('/api/voitures', $donnees);
        $creation->assertStatus(201);
        $this->assertDatabaseHas('voitures', ['matricule' => 'TEST-IT-100', 'etat' => 'disponible']);
        $id = $creation->json('data.id');

        // Lecture : la voiture est retrouvée par son identifiant
        $this->getJson("/api/voitures/{$id}")
            ->assertStatus(200)
            ->assertJsonFragment(['matricule' => 'TEST-IT-100']);

        // Modification : la nouvelle valeur est persistée
        $this->putJson("/api/voitures/{$id}", ['couleur' => 'Blanc'])->assertStatus(200);
        $this->assertDatabaseHas('voitures', ['id' => $id, 'couleur' => 'Blanc']);

        // Suppression : la ligne a disparu de la base
        $this->deleteJson("/api/voitures/{$id}")->assertStatus(200);
        $this->assertDatabaseMissing('voitures', ['id' => $id]);
    }
}
