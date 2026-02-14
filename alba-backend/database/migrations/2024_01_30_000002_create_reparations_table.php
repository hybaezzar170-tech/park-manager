<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reparations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voiture_id')->constrained('voitures')->onDelete('cascade');
            $table->foreignId('ouvrier_id')->constrained('ouvriers')->onDelete('cascade');
            $table->string('type_reparation'); // moteur, freinage, électrique, carrosserie, etc.
            $table->text('description');
            $table->decimal('cout_main_oeuvre', 10, 2)->nullable();
            $table->decimal('cout_pieces', 10, 2)->default(0);
            $table->decimal('cout_total', 10, 2)->nullable();
            $table->date('date_debut');
            $table->date('date_fin_prevue')->nullable();
            $table->date('date_fin_reelle')->nullable();
            $table->string('statut')->default('en_cours'); // en_cours, terminee, annulee
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('reparations');
    }
};
