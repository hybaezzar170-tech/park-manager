<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Piece extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'modele',
        'quantite',
        'prix_achat',
        'fournisseur_id',
        'type_piece'
    ];

    protected $casts = [
        'quantite' => 'integer',
        'prix_achat' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    /**
     * Relation avec le fournisseur
     */
    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }

    /**
     * Scope pour obtenir les pièces par type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type_piece', $type);
    }

    /**
     * Scope pour obtenir les pièces par modèle
     */
    public function scopeByModele($query, $modele)
    {
        return $query->where('modele', $modele);
    }

    /**
     * Scope pour obtenir les pièces en stock faible
     */
    public function scopeLowStock($query, $threshold = 10)
    {
        return $query->where('quantite', '<=', $threshold);
    }

    /**
     * Obtenir la valeur totale du stock
     */
    public function getValeurTotaleAttribute()
    {
        return $this->quantite * $this->prix_achat;
    }

    /**
     * Obtenir le statut du stock
     */
    public function getStockStatusAttribute()
    {
        if ($this->quantite == 0) {
            return 'rupture';
        } elseif ($this->quantite <= 10) {
            return 'faible';
        } else {
            return 'suffisant';
        }
    }
}
