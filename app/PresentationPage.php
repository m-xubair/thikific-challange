<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PresentationPage extends Model
{
    public function presentation() {
        return $this->belongsTo('App\PresentationUser', 'presentation_id');
    }
}
