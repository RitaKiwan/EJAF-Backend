<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    // GET /api/blog?lang=en|ar
    public function index(Request $request)
    {
        // إذا كان الطلب قادم من لوحة التحكم (Admin Dashboard)
        if ($request->query('dashboard') === 'true') {
            $posts = Post::latest('created_at_display')->get()->map(function ($p) {
                return [
                    'id'                 => (string) $p->id,
                    'title_en'           => $p->title_en,
                    'title_ar'           => $p->title_ar,
                    'excerpt_en'         => $p->excerpt_en,
                    'excerpt_ar'         => $p->excerpt_ar,
                    'content_en'         => $p->content_en,
                    'content_ar'         => $p->content_ar,
                    'slug'               => $p->slug,
                    'image'              => $p->image,
                    'tags'               => $p->tags, // سيعيد كائن يحتوي على en و ar للأدمن
                    'createdAt'          => $p->created_at_display,
                ];
            }); // ✅ تم تصحيح الإغلاق هنا للـ map

            return response()->json($posts); // ✅ تم نقل الإرجاع ليكون داخل شرط الـ dashboard
        }

        // إذا كان الطلب قادم من واجهة الزائر العادية
        $lang = $request->query('lang', 'en');

        $posts = Post::latest('created_at_display')->get()->map(function ($p) use ($lang) {
            // حماية مرنة لقراءة التاغات في حال كانت كائن أو نص قديم
            $tagsData = $p->tags;
            $selectedTags = "";

            if (is_array($tagsData) || is_object($tagsData)) {
                $tagsArray = (array) $tagsData;
                $selectedTags = $lang === 'ar' ? ($tagsArray['ar'] ?? '') : ($tagsArray['en'] ?? '');
            } else if (is_string($tagsData)) {
                $selectedTags = $tagsData;
            }

            return [
                'id'        => (string) $p->id,
                'title'     => $lang === 'ar' ? $p->title_ar : $p->title_en,
                'excerpt'   => $lang === 'ar' ? $p->excerpt_ar : $p->excerpt_en,
                'content'   => $lang === 'ar' ? $p->content_ar : $p->content_en,
                'slug'      => $p->slug,
                'image'     => $p->image,
                'tags'      => $selectedTags, // تعيد النص المفلتر للغة المطلوبة مباشرة
                'createdAt' => $p->created_at_display,
            ];
        });

        return response()->json($posts);
    }

    // POST /api/blog (admin only)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title_en'           => 'required|string|max:255',
            'title_ar'           => 'required|string|max:255',
            'excerpt_en'         => 'required|string',
            'excerpt_ar'         => 'required|string',
            'content_en'         => 'required|string',
            'content_ar'         => 'required|string',
            'slug'               => 'required|string|unique:posts,slug|max:255',
            'image'              => 'nullable|string',
            'tags'               => 'required|array', 
            'created_at_display' => 'required|date',
        ]);

        $post = Post::create($validated);

        return response()->json([
            'id'        => (string) $post->id,
            'slug'      => $post->slug,
            'createdAt' => $post->created_at_display,
        ], 201);
    }

    // PUT /api/blog/:id (admin only)
    public function update(Request $request, $id)
    {
        $post = Post::findOrFail($id);

        $validated = $request->validate([
            'title_en'           => 'required|string|max:255',
            'title_ar'           => 'required|string|max:255',
            'excerpt_en'         => 'required|string',
            'excerpt_ar'         => 'required|string',
            'content_en'         => 'required|string',
            'content_ar'         => 'required|string',
            'slug'               => 'required|string|unique:posts,slug,'.$id.'|max:255',
            'image'              => 'nullable|string',
            'tags'               => 'required|array',
            'created_at_display' => 'required|date',
        ]);

        $post->update($validated);

        return response()->json($post);
    }

    // DELETE /api/blog/:id (admin only)
    public function destroy($id)
    {
        $post = Post::findOrFail($id);
        $post->delete();
        return response()->json(['deleted' => true, 'id' => $id]);
    }
}