<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = [
        'fournisseur_id', 'constructeur', 'numero', 'nom', 'prix', 'date_prix'
    ];

    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }
}
