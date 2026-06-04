<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Support\Facades\Route;

// ============================================
// Public Routes — anyone can access these without authentication
// ============================================

Route::get('/services', [ServiceController::class, 'index']);

Route::get('/projects', [ProjectController::class, 'index']);

Route::get('/blog', [PostController::class, 'index']);

Route::post('/contact', [ContactController::class, 'store']);

Route::post('/auth/login', [AuthController::class, 'login']);

// ============================================
// Protected Routes — only authenticated admins can access
// ============================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth 
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',     [AuthController::class, 'me']);

    Route::post('/upload', [UploadController::class, 'upload']);
    // Services
    Route::post('/services',         [ServiceController::class, 'store']);
    Route::put('/services/{id}',     [ServiceController::class, 'update']);
    Route::delete('/services/{id}',  [ServiceController::class, 'destroy']);

    // Projects
    Route::post('/projects',         [ProjectController::class, 'store']);
    Route::put('/projects/{id}',     [ProjectController::class, 'update']);
    Route::delete('/projects/{id}',  [ProjectController::class, 'destroy']);

    // Blog
    Route::post('/blog',             [PostController::class, 'store']);
    Route::put('/blog/{id}',         [PostController::class, 'update']);
    Route::delete('/blog/{id}',      [PostController::class, 'destroy']);

    // Contact messages
    Route::get('/contact',              [ContactController::class, 'index']);
    Route::put('/contact/{id}/read',    [ContactController::class, 'markRead']);
});
