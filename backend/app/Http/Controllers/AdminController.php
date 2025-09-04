<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function createTeacher(Request $request) {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'email' => ['required','email','unique:users,email'],
            'password' => ['required','string','min:6'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email'=> $data['email'],
            'password' => Hash::make($data['password']),
            'role' => 'teacher',
        ]);

        return response()->json($user, 201);
    }

    public function listTeachers() {
        return User::where('role','teacher')->select('id','name','email','role','created_at')->latest()->get();
    }

    public function createStudent(Request $request) {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'class_name' => ['required','string','max:255'],
        ]);
        $student = Student::create($data);
        return response()->json($student, 201);
    }

    public function listStudents(Request $request) {
        $q = Student::query()->orderBy('class_name')->orderBy('name');
        if ($request->filled('class_name')) {
            $q->where('class_name', $request->string('class_name'));
        }
        return $q->get();
    }
}
