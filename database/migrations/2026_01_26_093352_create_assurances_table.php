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
    Schema::create('assurances', function (Blueprint $table) {
    $table->id();
    $table->foreignId('voiture_id')->constrained()->onDelete('cascade');
    $table->foreignId('fournisseur_id')->nullable()->constrained()->onDelete('set null');
    $table->string('type_assurance');
    $table->date('date_debut');
    $table->date('date_expiration');
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
        Schema::dropIfExists('assurances');
    }
};
