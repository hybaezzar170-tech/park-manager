<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voitures', function (Blueprint $table) {
            $table->id();
            $table->string('matricule')->unique();
            $table->string('modele');
            $table->string('num_serie')->unique();
            $table->string('type_departement');
            $table->foreignId('departement_id')->constrained('departements')->onDelete('cascade');
            $table->foreignId('conducteur_id')->nullable()->constrained('conducteurs')->onDelete('set null');
            $table->string('marque');
            $table->string('couleur');
            $table->date('mise_en_circulation');
            $table->string('carburant');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('voitures');
    }
};
