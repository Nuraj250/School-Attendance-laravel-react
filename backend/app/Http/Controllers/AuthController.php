<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request) {
        $data = $request->validate([
            'email' => ['required','email'],
            'password' => ['required','string'],
        ]);

        if (!Auth::attempt($data)) {
            return response()->json(['message' => 'Invalid credentials'], 422);
        }

        $request->session()->regenerate();
        $user = $request->user();

        return response()->json([
            'user' => ['id'=>$user->id, 'name'=>$user->name, 'email'=>$user->email, 'role'=>$user->role],
        ]);
    }

    public function logout(Request $request) {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->noContent();
    }

    public function me(Request $request) {
        $u = $request->user();
        return response()->json([
            'user' => ['id'=>$u->id, 'name'=>$u->name, 'email'=>$u->email, 'role'=>$u->role],
        ]);
    }
}
