<?php

use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    
    Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices');
});

require __DIR__.'/settings.php';
