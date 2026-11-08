<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ouvrier extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'type',
        'telephone',
        'email',
        'password',
        'salaire',
        'date_embauche',
        'statut',
        'adresse'
    ];

    protected $casts = [
        'salaire' => 'decimal:2',
        'date_embauche' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Scope pour obtenir les ouvriers actifs
     */
    public function scopeActifs($query)
    {
        return $query->where('statut', 'actif');
    }

    /**
     * Scope pour obtenir les ouvriers par type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Obtenir le nom complet de l'ouvrier
     */
    public function getNomCompletAttribute()
    {
        return $this->nom . ' ' . $this->prenom;
    }

    /**
     * Obtenir le type formaté
     */
    public function getTypeFormatteAttribute()
    {
        return ucfirst($this->type);
    }

    /**
     * Obtenir le statut formaté
     */
    public function getStatutFormatteAttribute()
    {
        return ucfirst($this->statut);
    }
}
