<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reclamation extends Model
{
    use HasFactory;

    protected $fillable = [
        'sujet',
        'description',
        'type_reclamation',
        'urgence',
        'voiture_id',
        'email',
        'statut',
        'reponse'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relations
    public function voiture()
    {
        return $this->belongsTo(Voiture::class);
    }
}
