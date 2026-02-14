<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Voiture;

class Conducteur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'date_naissance',
        'date_embauche',
        'numero_permis',
        'adresse',
        'ville',
        'code_postal',
        'telephone',
        'email'
    ];

    public function voitures()
    {
        return $this->hasMany(Voiture::class);
    }
}
