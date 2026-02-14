<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpirationAlert extends Model
{
    use HasFactory;

    protected $fillable = [
        'alert_type',
        'voiture_matricule',
        'voiture_modele',
        'expiration_date',
        'days_remaining',
        'urgency',
        'message',
        'reference_id',
    ];

    protected $casts = [
        'expiration_date' => 'date',
        'days_remaining' => 'integer',
    ];
}
