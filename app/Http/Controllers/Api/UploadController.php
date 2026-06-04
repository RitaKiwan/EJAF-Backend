<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,gif,svg,webp|max:5120',
        ]);

        $path = $request->file('file')->store('uploads', 'public');

        return response()->json([
            'url' => '/storage/' . $path,
        ]);
    }
}