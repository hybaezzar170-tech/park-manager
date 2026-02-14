<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('acc_', function (Blueprint $table) {
            $table->id();
             $table->foreignId('fournisseur_id')->constrained()->cascadeOnDelete();
            $table->foreignId('voiture_id')->constrained()->cascadeOnDelete();
            $table->string('reference')->unique();
            $table->string('nom');
            $table->string('categorie'); 
            $table->string('marque')->nullable();
            $table->integer('quantite')->default(0);
            $table->integer('seuil_alerte')->default(5);
            $table->enum('etat', ['disponible', 'rupture'])->default('disponible');
            $table->decimal('prix_achat', 10, 2)->nullable();
            $table->decimal('prix_vente', 10, 2)->nullable();
            $table->date('date_achat')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('acc_');
    }
};
