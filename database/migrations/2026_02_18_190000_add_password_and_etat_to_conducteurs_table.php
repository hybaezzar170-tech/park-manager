<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conducteurs', function (Blueprint $table) {
            $table->string('password')->nullable();
            $table->enum('etat', ['actif', 'inactif'])->default('actif');
        });
    }

    public function down(): void
    {
        Schema::table('conducteurs', function (Blueprint $table) {
            $table->dropColumn(['password', 'etat']);
        });
    }
};
