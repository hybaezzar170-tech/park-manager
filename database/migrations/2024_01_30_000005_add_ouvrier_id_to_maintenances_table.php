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
        Schema::table('maintenances', function (Blueprint $table) {
            // Add ouvrier_id column if it doesn't exist
            if (!Schema::hasColumn('maintenances', 'ouvrier_id')) {
                $table->unsignedBigInteger('ouvrier_id')->nullable()->after('statut');
                $table->foreign('ouvrier_id')->references('id')->on('ouvriers')->onDelete('set null');
            }
            
            // Add statut column if it doesn't exist
            if (!Schema::hasColumn('maintenances', 'statut')) {
                $table->enum('statut', ['en_cours', 'terminee', 'annulee'])->default('en_cours')->after('date_fin_reelle');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('maintenances', function (Blueprint $table) {
            if (Schema::hasColumn('maintenances', 'ouvrier_id')) {
                $table->dropForeign(['ouvrier_id']);
                $table->dropColumn('ouvrier_id');
            }
            
            if (Schema::hasColumn('maintenances', 'statut')) {
                $table->dropColumn('statut');
            }
        });
    }
};
