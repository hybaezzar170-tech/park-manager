<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Taxe extends Model
{
    use HasFactory;

   protected $fillable = [
    'voiture_id',
    'type_taxe',
    'annee',
    'montant',
    'date_paiement',
    'date_expiration',
    'statut',
    'recu',
    'remarque'
];

public function voiture()
{
    return $this->belongsTo(Voiture::class);
}

}
