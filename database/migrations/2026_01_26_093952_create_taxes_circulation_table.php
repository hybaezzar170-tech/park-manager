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
        Schema::create('taxes_circulation', function (Blueprint $table) {
    $table->id();
    $table->foreignId('voiture_id')->constrained()->onDelete('cascade');
    $table->year('annee');
    $table->decimal('montant', 10, 2);
    $table->date('date_paiement')->nullable();
    $table->enum('status', ['payé','non payé'])->default('non payé');
    $table->date('date_expiration')->nullable();
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
        Schema::dropIfExists('taxes_circulation');
    }
};
