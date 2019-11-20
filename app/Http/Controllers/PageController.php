<?php

namespace App\Http\Controllers;

use App\PresentationPage;
use App\PresentationUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Spatie\PdfToImage\Pdf;

class PageController extends Controller
{
    /**
     * Display a listing of the resource.
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

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
        // validate request
        $validator = Validator::make($request->all(), $this->rules(), $this->messages());
        if($validator->errors()->count()) {
            return response()->json($validator->errors()->all());
        }

        $fileName = $request->presentation_id.'-'.time().'.pdf';//new file name
        $uploadPath = $this->checkDirectories($request->presentation_id);

        $request->file->storeAs($uploadPath, $fileName);
        $pdf = new Pdf(storage_path('app/'.$uploadPath.'/'.$fileName));
        $numberOfPages = $pdf->getNumberOfPages();
        $alreadyPresentationPages = PresentationPage::where('presentation_id', $request->presentation_id)
            ->get()->count();
        if(($numberOfPages + $alreadyPresentationPages) > 20) {
            @unlink(storage_path('app/'.$uploadPath.'/'.$fileName));
            return response()->json(['error' => 'Maximum 20 pages allowed.'], 403);
        }

        for($page = 1; $page <= $numberOfPages; $page++) {
            $image_name = time().'-'.rand(10000,99999).'.png';
            $pdf->setPage($page)
                ->saveImage(storage_path('app/'.$uploadPath.'/'.$image_name));
            PresentationPage::create([
                'presentation_id' => $request->presentation_id,
                'image' => $image_name,
                'sort_order' => ($page + $alreadyPresentationPages)
            ]);
        }
        $presentation = PresentationUser::with(['pages' => function($q){
                $q->orderBy('sort_order', 'ASC');
            }])
            ->where('id', $request->presentation_id)
            ->first();

        //Remove uploaded pdf after generating images.
        @unlink(storage_path('app/'.$uploadPath.'/'.$fileName));

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
        $presentation = PresentationUser::with(['pages' => function($q) {
            $q->orderBy('sort_order', 'ASC');
        }])->where('id', $id)
            ->where('user_id', Auth::user()->id)
            ->first();

        return response()->json($presentation);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {



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
        $validator = Validator::make($request->all(),
            [
                'file' => 'required|image',
                'presentation_id' => 'required'
            ],
            [
                'required' => 'The :attribute is required.',
                'image' => 'Only Image file allowed'
            ]
        );


        if($validator->errors()->count()) {
            return response()->json($validator->errors()->all());
        }
        $page = PresentationPage::where('id', $id)
            ->where('presentation_id', $request->presentation_id)
            ->first();
        $oldImage = $page->image;
        $file = $request->file('file');

        $uploadPath = $this->checkDirectories($request->presentation_id);
        $fileName = time().'-'.rand(10000,99999).'.'.$file->getClientOriginalExtension();

        $request->file->storeAs($uploadPath, $fileName);


        $page->image = $fileName;
        $page->save();

        @unlink(storage_path('app/'.$uploadPath.'/'.$oldImage));

        return response()->json($page);


    }

    public function addNewPage(Request $request) {
        $validator = Validator::make($request->all(),
            [
                'file' => 'required|image',
                'presentation_id' => 'required'
            ],
            [
                'required' => 'The :attribute is required.',
                'image' => 'Only Image file allowed'
            ]
        );


        if($validator->errors()->count()) {
            return response()->json($validator->errors()->all());
        }
        $presentation = PresentationUser::with(['pages' => function($q) {
                $q->orderBy('sort_order', 'ASC');
            }])
            ->where('id', $request->presentation_id)
            ->where('user_id', Auth::user()->id)
            ->first();

        if($presentation && $presentation->pages->count() >= 20) {
            return response()->json(['error' => 'Only 20 pages allowed per presentation.']);
        }

        $maxSortOrder = $presentation->pages()->max('sort_order');



        $file = $request->file('file');

        $uploadPath = $this->checkDirectories($request->presentation_id);
        $fileName = time().'-'.rand(10000,99999).'.'.$file->getClientOriginalExtension();

        $request->file->storeAs($uploadPath, $fileName);

        $page = PresentationPage::create([
            'image' => $fileName,
            'sort_order' => ($maxSortOrder + 1),
            'presentation_id' => $request->presentation_id
        ]);

        return response()->json($page);
    }

    public function removeAudio(Request $request, $id) {
        $page = PresentationPage::with(['presentation' => function($q){
            $q->where('user_id', Auth::user()->id);
        }])
            ->where('id', $id)
            ->where('presentation_id', $request->presentation_id)
            ->first();

        if($page && !$page->presentation) { //if presentation not belongs to auth user return error.
            return response()->json(['error' => 'Invalid request'], 403);
        }

        @unlink(storage_path('app/public/presentations/'.$request->presentation_id.'/'.$page->audio));

        $page->audio = '';
        $page->save();

        return response()->json($page, 200);
    }

    public function updateAudio(Request $request, $id) {
        $validator = Validator::make($request->all(),
            [
                'file' => 'required',
                'presentation_id' => 'required'
            ],
            [
                'required' => 'The :attribute is required.',
                'mimes' => 'Only mp3 & wav file allowed'
            ]
        );


        if($validator->errors()->count()) {
            return response()->json($validator->errors()->all());
        }
        $page = PresentationPage::with(['presentation' => function($q){
                $q->where('user_id', Auth::user()->id);
            }])
            ->where('id', $id)
            ->where('presentation_id', $request->presentation_id)
            ->first();

        if($page && !$page->presentation) { //if presentation not belongs to auth user return error.
            return response()->json(['error' => 'Invalid request'], 403);
        }
        $oldImage = $page->audio;
        $file = $request->file('file');

        $uploadPath = $this->checkDirectories($request->presentation_id);
        $fileName = time().'-'.rand(10000,99999).'.'.$file->getClientOriginalExtension();

        $request->file->storeAs($uploadPath, $fileName);


        $page->audio = $fileName;
        $page->save();

        if($oldImage) {
            @unlink(storage_path('app/' . $uploadPath . '/' . $oldImage));
        }

        return response()->json($page);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $presentation = PresentationUser::where('id', $request->presentation_id)
            ->first();
        if($presentation) {
            PresentationPage::where('id', $id)->delete();
            return response()->json(['success' => true], 200);
        }
        return response()->json(['success' => false], 400);

    }

    public function sortPagesOrder(Request $request) {
        sleep(2);
        if($request->sort_order) {
            $presentation = PresentationUser::where('user_id', Auth::user()->id)
                ->where('id', $request->presentation_id)
                ->first();
            if($presentation) {
                foreach ($request->sort_order as $item) {
                    PresentationPage::where('id', $item[0]['id'])
                        ->update([
                            'sort_order' => $item[0]['sort']
                        ]);
                }
                return response()->json(['success' => true], 200);
            }
        }

        return response()->json(['error' => 'Invalid request.'], 400);
    }

    private function rules() {
        return [
            'file' => 'required|mimes:pdf',
            'presentation_id' => 'required'
        ];
    }

    private function messages() {
        return [
            'required' => 'The :attribute is required.',
            'mimes:pdf' => 'Only PDF files allowed',
        ];
    }

    private function checkDirectories($presentation_id) {
        $mainDirectory = storage_path('app/public/presentations');
        $uploadPath = 'public/presentations/'.$presentation_id;

        if(!is_dir($mainDirectory)) {
            mkdir($mainDirectory, 0775);
        }
        if(!is_dir(storage_path('app/'.$uploadPath))){
            mkdir(storage_path('app/'.$uploadPath), 0775);
        }

        return $uploadPath;
    }
}
