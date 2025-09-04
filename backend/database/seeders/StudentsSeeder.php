<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;

class StudentsSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            ['name'=>'Aarav Kumar','class_name'=>'Grade 5'],
            ['name'=>'Nethmi Perera','class_name'=>'Grade 5'],
            ['name'=>'Ishan Silva','class_name'=>'Grade 6'],
            ['name'=>'Tharindi Fernando','class_name'=>'Grade 6'],
            ['name'=>'Kasun Jayasuriya','class_name'=>'Class 10-B'],
            ['name'=>'Dilini Wickramasinghe','class_name'=>'Class 10-B'],
            // add more to taste...
        ];
        foreach ($students as $s) { Student::firstOrCreate($s); }
    }
}
