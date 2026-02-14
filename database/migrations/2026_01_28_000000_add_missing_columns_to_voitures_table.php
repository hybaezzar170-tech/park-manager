<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('voitures', function (Blueprint $table) {
            if (!Schema::hasColumn('voitures', 'etat')) {
                $table->string('etat')->default('disponible');
            }
            if (!Schema::hasColumn('voitures', 'prix_achat')) {
                $table->decimal('prix_achat', 10, 2)->nullable();
            }
            if (!Schema::hasColumn('voitures', 'date_achat')) {
                $table->date('date_achat')->nullable();
            }
            if (!Schema::hasColumn('voitures', 'fournisseur_id')) {
                $table->foreignId('fournisseur_id')->nullable()->constrained('fournisseurs')->onDelete('set null');
            }
        });
    }

    public function down(): void
    {
        Schema::table('voitures', function (Blueprint $table) {
            if (Schema::hasColumn('voitures', 'fournisseur_id')) {
                $table->dropForeign(['fournisseur_id']);
                $table->dropColumn('fournisseur_id');
            }
            if (Schema::hasColumn('voitures', 'date_achat')) {
                $table->dropColumn('date_achat');
            }
            if (Schema::hasColumn('voitures', 'prix_achat')) {
                $table->dropColumn('prix_achat');
            }
            if (Schema::hasColumn('voitures', 'etat')) {
                $table->dropColumn('etat');
            }
        });
    }
};
