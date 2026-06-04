<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // POST /api/contact (public)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        ContactMessage::create($validated);

        return response()->json([
            'message' => 'تم إرسال رسالتك بنجاح'
        ], 201);
    }

    // GET /api/contact (admin only)
    public function index()
    {
        $messages = ContactMessage::latest()->get();
        return response()->json($messages);
    }

    // PUT /api/contact/:id/read (admin only)
    public function markRead($id)
    {
        $msg = ContactMessage::findOrFail($id);
        $msg->update(['read_at' => now()]);
        return response()->json(['message' => 'تم التحديد كمقروء']);
    }
}