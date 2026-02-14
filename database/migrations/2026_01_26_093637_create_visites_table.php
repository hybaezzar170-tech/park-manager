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
        Schema::create('visites', function (Blueprint $table) {
    $table->id();
    $table->foreignId('voiture_id')->constrained()->onDelete('cascade');
    $table->date('date_visite');
    $table->date('prochaine_visite')->nullable();
    $table->integer('rappel_jours')->default(0);
    $table->text('note')->nullable();
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visites');
    }
};
