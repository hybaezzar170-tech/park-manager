<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reclamations', function (Blueprint $table) {
            $table->id();
            $table->string('sujet');
            $table->text('description');
            $table->string('type_reclamation');
            $table->string('urgence');
            $table->unsignedBigInteger('voiture_id')->nullable();
            $table->string('email');
            $table->string('statut')->default('en_attente');
            $table->text('reponse')->nullable();
            $table->timestamps();
            
            $table->foreign('voiture_id')->references('id')->on('voitures')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('reclamations');
    }
};
