<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reparation extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'cout_total',
        'date_debut',
        'date_fin',
        'statut',
        'voiture_id',
        'mecanicien_id',
    ];

    protected $casts = [
        'cout_total' => 'decimal:2',
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    // Relations
    public function voiture()
    {
        return $this->belongsTo(Voiture::class);
    }

    public function mecanicien()
    {
        return $this->belongsTo(Ouvrier::class);
    }

    // Relation many-to-many avec les pièces
    public function pieces()
    {
        return $this->belongsToMany(Piece::class, 'reparation_piece')
            ->withPivot('quantite_utilisee')
            ->withTimestamps();
    }
}
