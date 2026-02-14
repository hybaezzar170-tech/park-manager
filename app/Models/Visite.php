<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visite extends Model
{
    use HasFactory;

    protected $fillable = [
        'voiture_id',
        'date_visite',
        'prochaine_visite',
        'rappel_jours',
        'note'
    ];

    public function voiture() {
        return $this->belongsTo(Voiture::class);
    }
}
