<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PresentationUser extends Model
{
    use Uuids;
    protected $fillable = ['id', 'name', 'description', 'user_id'];
    public $incrementing    = false;

    public function user() {
        return $this->belongsTo('App\User');
    }

    public function pages() {
        return $this->hasMany('App\PresentationPage', 'presentation_id');
    }
}
