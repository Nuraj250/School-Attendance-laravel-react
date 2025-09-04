<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceSession extends Model
{
    protected $fillable = ['class_name','date','teacher_id'];

    public function marks() {
        return $this->hasMany(Attendance::class, 'attendance_session_id');
    }
}
