<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;


class ServiceController extends Controller
{
    // GET /api/services?lang=en|ar
   public function index(Request $request)
{
    $lang = $request->query('lang', 'en');

    $services = Cache::remember("services_{$lang}", 300, function () use ($lang) {
        return Service::orderBy('order')->get()->map(function ($s) use ($lang) {
            return [
                'id'          => (string) $s->id,
                'title'       => $lang === 'ar' ? $s->title_ar : $s->title_en,
                'description' => $lang === 'ar' ? $s->description_ar : $s->description_en,
                'icon'        => $s->icon,
                'gif'         => $s->gif,
            ];
        });
    });

    return response()->json($services);
}

    // POST /api/services (admin only)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en'       => 'required|string|max:255',
            'title_ar'       => 'required|string|max:255',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'icon'           => 'required|string|max:100',
            'gif'            => 'nullable|string',
            'order'          => 'nullable|integer',
        ]);
        $service = Service::create($validated);
        Cache::forget('services_en');
        Cache::forget('services_ar');
        return response()->json($service, 201);
    }

    // PUT /api/services/:id (admin only)
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $validated = $request->validate([
            'title_en'       => 'required|string|max:255',
            'title_ar'       => 'required|string|max:255',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'icon'           => 'required|string|max:100',
            'gif'            => 'nullable|string',
            'order'          => 'nullable|integer',
        ]);

        $service->update($validated);
        Cache::forget('services_en');
        Cache::forget('services_ar');
        return response()->json($service);
    }

    // DELETE /api/services/:id (admin only)
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();
            
        Cache::forget('services_en');
        Cache::forget('services_ar');
        return response()->json(['deleted' => true]);
    }
}