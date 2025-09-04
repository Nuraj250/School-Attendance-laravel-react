<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\AttendanceSession;
use App\Models\Student;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function studentReport($id, Request $request) {
        $student = Student::findOrFail($id);

        $from = $request->query('from') ?: Carbon::today()->subDays(30)->toDateString();
        $to   = $request->query('to')   ?: Carbon::today()->toDateString();

        $rows = Attendance::query()
            ->join('attendance_sessions as s', 's.id', '=', 'attendances.attendance_session_id')
            ->where('attendances.student_id', $student->id)
            ->whereBetween('s.date', [$from, $to])
            ->orderBy('s.date','desc')
            ->get([
                's.date as date',
                's.class_name as class_name',
                'attendances.status as status',
            ]);

        $total = $rows->count();
        $present = $rows->where('status','present')->count();
        $absent = $rows->where('status','absent')->count();

        return response()->json([
            'student' => ['id'=>$student->id,'name'=>$student->name,'class_name'=>$student->class_name],
            'range' => ['from'=>$from,'to'=>$to],
            'summary' => ['total'=>$total, 'present'=>$present, 'absent'=>$absent],
            'entries' => $rows,
        ]);
    }
}
