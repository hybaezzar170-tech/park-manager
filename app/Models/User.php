<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Les attributs qui peuvent être assignés en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'telephone',
        'email_verified_at',
        'remember_token',
    ];

    /**
     * Les attributs à cacher pour la sérialisation (JSON, etc).
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Les attributs à caster.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Relation avec les locations.
     * Un utilisateur peut avoir plusieurs locations (rentales).
     */
    public function rentales()
    {
        return $this->hasMany(Rentale::class);
    }

    /**
     * Vérifie si l'utilisateur est un admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
