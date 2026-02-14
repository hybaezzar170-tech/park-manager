<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reparation_piece', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reparation_id')->constrained('reparations')->onDelete('cascade');
            $table->foreignId('piece_id')->constrained('pieces')->onDelete('cascade');
            $table->integer('quantite_utilisee')->default(1);
            $table->timestamps();

            $table->unique(['reparation_id', 'piece_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reparation_piece');
    }
};
