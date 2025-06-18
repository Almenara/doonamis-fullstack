<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
        Route::get('/check-login', [AuthController::class, 'checkLogin'])->name('checkLogin');
    });
});

Route::prefix('users')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [\App\Http\Controllers\UserController::class, 'index'])->name('users.index');
    Route::get('/{id}', [\App\Http\Controllers\UserController::class, 'show'])->name('users.show');
    // Additional user routes can be added here
});


Route::post('/register', [AuthController::class, 'register'])->name('register');

