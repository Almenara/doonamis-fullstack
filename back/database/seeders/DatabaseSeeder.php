<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
        $this->call([
            AdminUserSeeder::class,
        ]);
        // Creamos 10 usuarios de prueba
        User::factory(10)->create();
    }
}
