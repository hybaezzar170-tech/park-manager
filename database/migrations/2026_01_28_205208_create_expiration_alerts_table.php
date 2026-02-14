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
        Schema::create('expiration_alerts', function (Blueprint $table) {
            $table->id();
            $table->string('alert_type'); // 'Assurance', 'Taxe circulation', 'Visite technique'
            $table->string('voiture_matricule');
            $table->string('voiture_modele');
            $table->date('expiration_date');
            $table->integer('days_remaining'); // negative if expired
            $table->string('urgency'); // 'Urgent', 'Warning'
            $table->text('message');
            $table->string('reference_id'); // assurance_1, taxe_2, visite_3
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expiration_alerts');
    }
};
