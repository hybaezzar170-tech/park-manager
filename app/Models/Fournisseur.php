<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom','prenom','type','email','tel','fax','site_web','adresse','ville','code_postal','contact'
    ];

    public function pieces1()
    {
        return $this->hasMany(Piece::class);
    }

    public function alertes()
    {
        return $this->hasMany(Alerte::class);
    }
}
