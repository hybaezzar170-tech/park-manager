<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    use HasFactory;

    protected $fillable = [
        'voiture_id',
        'description',
        'cout',
        'date_debut',
        'date_fin_prevue',
        'date_fin_reelle',
        'statut',
        'ouvrier_id',
        'notes',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin_prevue' => 'date',
        'date_fin_reelle' => 'date',
        'cout' => 'decimal:2',
    ];

    public function voiture()
    {
        return $this->belongsTo(Voiture::class);
    }

    public function ouvrier()
    {
        return $this->belongsTo(Ouvrier::class);
    }

    public function getDureeAttribute()
    {
        if ($this->date_fin_reelle) {
            return $this->date_debut->diffInDays($this->date_fin_reelle);
        } elseif ($this->date_fin_prevue) {
            return $this->date_debut->diffInDays($this->date_fin_prevue);
        }
        return null;
    }

    public function getEstEnRetardAttribute()
    {
        if ($this->statut === 'en_cours' && $this->date_fin_prevue) {
            return now()->greaterThan($this->date_fin_prevue);
        }
        return false;
    }
}
