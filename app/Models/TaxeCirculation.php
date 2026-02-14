<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaxeCirculation extends Model
{
    use HasFactory;

    protected $table = 'taxes_circulation';

    protected $fillable = [
        'voiture_id',
        'annee',
        'montant',
        'date_paiement',
        'status',
        'date_expiration',
        'rappel_jours',
        'note'
    ];

    public function voiture() {
        return $this->belongsTo(Voiture::class);
    }
}

