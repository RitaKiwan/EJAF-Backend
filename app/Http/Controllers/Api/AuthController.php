<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Http\Request;



class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'بيانات الدخول غير صحيحة'
            ], 401);
        }

        if (!$user->is_admin) {
            return response()->json([
                'message' => 'غير مصرح لك بالدخول'
            ], 403);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'       => $user->id,
                'name'     => $user->name,
                'username' => $user->username,
                'is_admin' => $user->is_admin,
            ]
        ]);
    }

   public function resetPassword(Request $request) {
    // التحقق من أن المستخدم مسجل دخول فعلاً قبل أي شيء
    if (!$request->user()) {
        return response()->json(['message' => 'غير مصرح لك'], 401);
    }

    // التحقق من صحة البيانات
    $validated = $request->validate([
        'oldPassword' => 'required',
        'newPassword' => 'required|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&]/',
    ]);

    // التحقق من كلمة المرور القديمة
    if (!Hash::check($request->oldPassword, $request->user()->password)) {
        return response()->json(['message' => 'كلمة المرور القديمة خاطئة'], 403);
    }

    // التحديث
    $user = $request->user();
    $user->password = Hash::make($request->newPassword);
    $user->save();

    return response()->json(['message' => 'تم التحديث بنجاح']);
}
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'تم تسجيل الخروج']);
    }
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}