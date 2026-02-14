<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reparation extends Model
{
    use HasFactory;

    protected $fillable = [
        'voiture_id',
        'ouvrier_id',
        'type_reparation',
        'description',
        'cout_main_oeuvre',
        'cout_pieces',
        'cout_total',
        'date_debut',
        'date_fin_prevue',
        'date_fin_reelle',
        'statut',
        'notes'
    ];

    protected $casts = [
        'cout_main_oeuvre' => 'decimal:2',
        'cout_pieces' => 'decimal:2',
        'cout_total' => 'decimal:2',
        'date_debut' => 'date',
        'date_fin_prevue' => 'date',
        'date_fin_reelle' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function voiture()
    {
        return $this->belongsTo(Voiture::class);
    }

    public function ouvrier()
    {
        return $this->belongsTo(Ouvrier::class);
    }

    public function pieces()
    {
        return $this->belongsToMany(acc_::class, 'reparation_piece')
            ->withPivot('quantite', 'prix_unitaire', 'prix_total')
            ->withTimestamps();
    }

    public function calculateCoutTotal()
    {
        $coutPieces = $this->pieces()->sum('prix_total');
        $coutMainOeuvre = $this->cout_main_oeuvre ?? 0;
        
        $this->cout_pieces = $coutPieces;
        $this->cout_total = $coutPieces + $coutMainOeuvre;
        $this->save();
    }

    public function scopeEnCours($query)
    {
        return $query->where('statut', 'en_cours');
    }

    public function scopeTerminee($query)
    {
        return $query->where('statut', 'terminee');
    }

    public function getDureeAttribute()
    {
        if (!$this->date_debut) return null;
        
        $end = $this->date_fin_reelle ?? now();
        return $this->date_debut->diffInDays($end);
    }
}
