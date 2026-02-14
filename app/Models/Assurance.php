<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assurance extends Model
{
    use HasFactory;

    protected $fillable = [
        'voiture_id',
        'fournisseur_id',
        'type_assurance',
        'date_debut',
        'date_expiration',
        'rappel_jours',
        'note'
    ];

    public function voiture() {
        return $this->belongsTo(Voiture::class);
    }

    public function fournisseur() {
        return $this->belongsTo(Fournisseur::class);
    }
}
