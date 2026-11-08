<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Voiture;
use App\Models\Client;

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

    protected $casts = [
        'date_location' => 'date',
        'date_fin' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relation avec la voiture
    public function voiture()
    {
        return $this->belongsTo(Voiture::class);
    }

    // Relation avec le client (basé sur le nom complet)
    public function clientRelation()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    // Accesseur pour obtenir le nom complet du client
    public function getClientNomAttribute()
    {
        if ($this->clientRelation) {
            return $this->clientRelation->nom . ' ' . $this->clientRelation->prenom;
        }
        
        // Fallback si pas de relation client (ancien système)
        return $this->client;
    }
}
