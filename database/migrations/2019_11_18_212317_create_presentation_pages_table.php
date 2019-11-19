<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePresentationPagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('presentation_pages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('image');
            $table->string('audio')->nullable();
            $table->integer('audio_time')->nullable();
            $table->integer('sort_order');
            $table->uuid('presentation_id');
            $table->timestamps();

            $table->foreign('presentation_id')
                ->references('id')
                ->on('presentation_users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('presentation_pages');
    }
}
