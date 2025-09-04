<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ReportController;

// Auth (public)
Route::post('/auth/login', [AuthController::class, 'login']);

// Authed routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Admin-only
    Route::middleware('role:admin')->group(function () {
        Route::post('/teachers', [AdminController::class, 'createTeacher']);
        Route::get('/teachers', [AdminController::class, 'listTeachers']);
        Route::post('/students', [AdminController::class, 'createStudent']);
        Route::get('/students', [AdminController::class, 'listStudents']);
    });

    // Teacher-only
    Route::middleware('role:teacher')->group(function () {
        Route::get('/classes', [AttendanceController::class, 'classes']);
        Route::post('/attendance/sessions', [AttendanceController::class, 'createSession']);
        Route::post('/attendance/sessions/{id}/marks', [AttendanceController::class, 'saveMarks']);
    });

    // Reports (both roles can access)
    Route::get('/students/{id}/attendance', [ReportController::class, 'studentReport']);
});
