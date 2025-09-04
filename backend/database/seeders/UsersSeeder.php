<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@school.com'],
            ['name'=>'Admin', 'password'=>Hash::make('password'), 'role'=>'admin']
        );

        User::updateOrCreate(
            ['email' => 'teacher@school.com'],
            ['name'=>'Teacher', 'password'=>Hash::make('password'), 'role'=>'teacher']
        );
    }
}
