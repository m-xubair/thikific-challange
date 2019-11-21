<?php

namespace Tests\Unit;

use App\User;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use JWTAuth;

class PresentationTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    protected function authenticate(){
        $user = User::create([
            'name' => 'test',
            'email' => 'test@gmail.com',
            'provider' => 'google',
            'provider_id' => '100545957935787309042'
        ]);
        $token = JWTAuth::fromUser($user);
        return $token;
    }
    public function testCreate()
    {
        //Get token
        $token = $this->authenticate();
        $response = $this->withHeaders([
            'Authorization' => 'Bearer '. $token,
        ])->json('POST','/api/presentations',[
            'name' => 'Test presentation',
            'description' => 'This is test presentation'
        ]);
        $this->assertEquals(200, $response->status());
        $json = json_decode($response->getContent());
        $this->assertEquals('Test presentation', $json->name);

    }

    public function testDelete()
    {
        //Get token
        $token = $this->authenticate();
        $response = $this->withHeaders([
            'Authorization' => 'Bearer '. $token,
        ])->json('POST','/api/presentations',[
            'name' => 'Test presentation',
            'description' => 'This is test presentation'
        ]);
        $json = json_decode($response->getContent());
        $presentation_id = $json->id;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer '. $token,
        ])->json('PUT','/api/presentations/'.$presentation_id,[
            'name' => 'updated presentation',
            'description' => 'This is test presentation'
        ]);
        $json = json_decode($response->getContent());
        $this->assertEquals(200, $response->status());
        $this->assertEquals(true, $json->success);


    }

}
