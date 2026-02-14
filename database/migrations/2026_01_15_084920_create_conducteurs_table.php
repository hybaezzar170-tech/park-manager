<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
       Schema::create('conducteurs', function (Blueprint $table) {
    $table->id();
    $table->string('nom');
    $table->string('prenom');
    $table->date('date_naissance');
    $table->date('date_embauche');
    $table->string('numero_permis')->unique();
    $table->string('adresse');
    $table->string('ville');
    $table->string('code_postal');
    $table->string('telephone');
    $table->string('email')->unique();
    $table->timestamps();
});

    }
    public function down(): void
    {
        Schema::dropIfExists('conducteurs');
    }
};
