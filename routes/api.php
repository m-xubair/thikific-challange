<?php


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::group(['middleware' => ['jwt.verify']], function() {
    Route::resource('presentations', 'PresentationController');
    Route::post('/pages/sort', 'PageController@sortPagesOrder');
    Route::post('pages/add-new', 'PageController@addNewPage');
    Route::put('pages/{id}/delete/audio', 'PageController@removeAudio');
    Route::post('pages/{id}/audio', 'PageController@updateAudio');
    Route::post('pages/{id}', 'PageController@update');
    Route::resource('pages', 'PageController');
});
