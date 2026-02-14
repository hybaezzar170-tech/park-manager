<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Voiture;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'voiture_id',
        'client',
        'date_location',
        'date_fin',
        'prix_location',
        'etat'
    ];

    public function voiture()
    {
        return $this->belongsTo(Voiture::class);
    }
}
