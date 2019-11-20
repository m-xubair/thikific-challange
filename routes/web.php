<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('auth/{provider}', 'Auth\LoginController@redirectToProvider');
Route::get('auth/{provider}/callback', 'Auth\LoginController@handleProviderCallback');
Route::get('presentation/{id}/export', 'PresentationController@exportPresentation');

Route::any('{all}', function () {
//    $pdf = new Spatie\PdfToImage\Pdf(public_path('iq.pdf'));
//    $pdf->setPage(2)
//        ->saveImage(public_path('isq.png'));
    return view('welcome');
})->where('all', '^(?!auth).*$');;
