<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function classes() {
        return Student::query()
            ->select('class_name')
            ->distinct()
            ->orderBy('class_name')
            ->get()
            ->pluck('class_name');
    }

    public function createSession(Request $request) {
        $data = $request->validate([
            'class_name' => ['required','string'],
            'date' => ['nullable','date'],
        ]);
        $date = $data['date'] ?? Carbon::today()->toDateString();

        // Enforce one session per class/day
        $exists = AttendanceSession::where('class_name', $data['class_name'])
            ->where('date', $date)->exists();
        if ($exists) {
            return response()->json(['message' => 'Attendance already submitted for this class today'], 409);
        }

        $session = AttendanceSession::create([
            'class_name' => $data['class_name'],
            'date' => $date,
            'teacher_id' => $request->user()->id,
        ]);

        return response()->json($session, 201);
    }

    public function saveMarks($id, Request $request) {
        $session = AttendanceSession::findOrFail($id);

        $payload = $request->validate([
            'marks' => ['required','array','min:1'],
            'marks.*.student_id' => ['required','integer', Rule::exists('students','id')],
            'marks.*.status' => ['required', Rule::in(['present','absent'])],
        ]);

        DB::transaction(function () use ($payload, $session) {
            foreach ($payload['marks'] as $m) {
                Attendance::updateOrCreate(
                    ['attendance_session_id' => $session->id, 'student_id' => $m['student_id']],
                    ['status' => $m['status']]
                );
            }
        });

        return response()->json(['message' => 'Saved'], 200);
    }

    public function studentsByClass(Request $request) {
    $data = $request->validate([
        'class_name' => ['required','string','max:255'],
    ]);

    return \App\Models\Student::query()
        ->where('class_name', $data['class_name'])
        ->orderBy('name')
        ->get(['id','name','class_name']);
}

}
