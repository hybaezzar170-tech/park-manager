<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CompteCreeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $details;

    /**
     * Create a new message instance.
     *
     * @param array $details
     * @return void
     */
    public function __construct($details)
    {
        $this->details = $details;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Votre compte a été créé - AutoPark')
                    ->view('emails.compte_cree')
                    ->with([
                        'nom' => $this->details['nom'],
                        'prenom' => $this->details['prenom'],
                        'email' => $this->details['email'],
                        'password' => $this->details['password'],
                        'type' => $this->details['type']
                    ]);
    }
}
