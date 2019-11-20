<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PresentationPage extends Model
{
    protected $fillable = ['image', 'audio', 'audio_time', 'sort_order', 'presentation_id'];

    public function presentation() {
        return $this->belongsTo('App\PresentationUser', 'presentation_id');
    }
}
