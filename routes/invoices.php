<?php

use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices');
    Route::get('invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');

    Route::get('invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
    Route::post('invoices', [InvoiceController::class, 'store'])->name('invoices.store');

    Route::get('invoices/edit/{invoice}', [InvoiceController::class, 'edit'])->name('invoices.edit');
    Route::put('invoices/update/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');

    Route::delete('invoices/destroy/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');

    Route::get('invoices/pay/{invoice}', [InvoiceController::class, 'pay'])->name('invoices.pay');
    Route::put('invoices/update-pay/{invoice}', [InvoiceController::class, 'updatePay'])->name('invoices.update-pay');
});