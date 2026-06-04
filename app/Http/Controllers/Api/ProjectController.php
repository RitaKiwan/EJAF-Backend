<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    // GET /api/projects
    public function index(Request $request)
    {
        
        if ($request->query('dashboard') === 'true') {
            $projects = Project::latest()->get()->map(function ($p) {
                return [
                    'id'             => (string) $p->id,
                    'title_en'       => $p->title_en,
                    'title_ar'       => $p->title_ar,
                    'description_en' => $p->description_en,
                    'description_ar' => $p->description_ar,
                    'image'          => $p->image,
                    'technologies'   => $p->technologies,
                ];
            });
            return response()->json($projects);
        }

       
        $lang = $request->query('lang', 'en');

        $projects = Project::latest()->get()->map(function ($p) use ($lang) {
            return [
                'id'           => (string) $p->id,
                'title'        => $lang === 'ar' ? $p->title_ar : $p->title_en,
                'description'  => $lang === 'ar' ? $p->description_ar : $p->description_en,
                'image'        => $p->image,
                
                'technologies' => $lang === 'ar' ? ($p->technologies['ar'] ?? []) : ($p->technologies['en'] ?? []),
            ];
        });

        return response()->json($projects);
    }

    // POST /api/projects (admin only)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en'        => 'required|string',
            'title_ar'        => 'required|string',
            'description_en'  => 'required|string',
            'description_ar'  => 'required|string',
            'image'           => 'nullable|string',
            'technologies'    => 'required|array', 
        ]);

        $project = Project::create($validated);

        return response()->json($project, 201);
    }

    // PUT /api/projects/:id (admin only)
    public function update(Request $request, $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'title_en'       => 'required|string|max:255',
            'title_ar'       => 'required|string|max:255',
            'description_en' => 'required|string',
            'description_ar' => 'required|string',
            'image'          => 'nullable|string',
            'technologies'   => 'required|array',
        ]);

        $project->update($validated);

        return response()->json($project);
    }

    // DELETE /api/projects/:id (admin only)
    public function destroy($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return response()->json(['deleted' => true, 'id' => $id]);
    }
}