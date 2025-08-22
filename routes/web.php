<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\HrController;
use App\Http\Controllers\VehiclePermitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Vehicle permit form (main page)
Route::get('/', [VehiclePermitController::class, 'index'])->name('home');
Route::post('/permits', [VehiclePermitController::class, 'store'])->name('permits.store');
Route::get('/employee-details', [VehiclePermitController::class, 'show'])->name('employee.details');

// HR Dashboard
Route::get('/hr-admin', [HrController::class, 'index'])->name('hr.dashboard');
Route::put('/permits/{permit}', [VehiclePermitController::class, 'update'])->name('permits.update');
Route::get('/hr-admin/export', [HrController::class, 'show'])->name('hr.export');

// Employee Management (for HR)
Route::resource('employees', EmployeeController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
