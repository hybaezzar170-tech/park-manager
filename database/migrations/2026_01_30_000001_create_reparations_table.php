<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reparations', function (Blueprint $table) {
            $table->id();
            $table->text('description');
            $table->decimal('cout_total', 10, 2)->nullable();
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->enum('statut', ['en_attente', 'en_cours', 'terminee'])->default('en_attente');
            
            // Relations
            $table->foreignId('voiture_id')->nullable()->constrained('voitures')->onDelete('set null');
            $table->foreignId('mecanicien_id')->nullable()->constrained('ouvriers')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reparations');
    }
};
