<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('fournisseurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom'); 
            $table->string('type'); // Vente véhicule, etc.
            $table->string('email')->nullable()->unique();
            $table->string('tel');
            $table->string('fax')->nullable();
            $table->string('site_web')->nullable();
            $table->text('adresse');
            $table->string('ville');
            $table->string('code_postal');
            $table->string('contact')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fournisseurs');
    }
};
