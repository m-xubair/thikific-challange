<?php

namespace App\Http\Controllers;

use App\PresentationUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PresentationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        sleep(1);
        $presentations = PresentationUser::with('pages')
            ->where('user_id', Auth::user()->id)
            ->get();
        return response()->json($presentations);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), $this->rules(), $this->messages());
        if($validated->errors()->count()) {
            return response()->json($validated->errors()->all());
        }
        $presentation = PresentationUser::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => Auth::user()->id
        ]);

        return response()->json($presentation);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $presentation = PresentationUser::where('id', $id)->first();

        return response()->json($presentation, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validated = Validator::make($request->all(), $this->rules(), $this->messages());
        if($validated->errors()->count()) {
            return response()->json(['errors' => $validated->errors()->all()]);
        }
        $presentation = PresentationUser::where('id', $id)->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json(['success' => $presentation ? true: false]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        sleep(1);
        $presentation = PresentationUser::where('id', $id)
            ->where('user_id', Auth::user()->id)
            ->delete();
        return response()->json(['success' => $presentation ? true: false]);

    }

    private function rules() {
        return [
            'name' => 'required',
            'description' => 'required',
        ];
    }
    private function messages() {
        return [
            'required' => 'Presentation :attribute is required.',
        ];
    }

}
