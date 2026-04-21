<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invoices = Invoice::with('items')->orderBy('created_at', 'desc')->get();
        return Inertia::render('invoices/invoice-list', [
            'data' => $invoices,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('invoices/invoice-register');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        DB::transaction(function () use ($request) {
            $invoice = Invoice::create($request->only(['number', 'status', 'issueDate', 'paidAmount']));
            $items = $request->input('items', []);
            $invoice->items()->createMany($items);
        });
        return redirect()->route('invoices');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $invoice = Invoice::with('items')->findOrFail($id);
        return Inertia::render('invoices/invoice-register', [
            'register' => $invoice,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        DB::transaction(function () use ($request, $id) {
            $invoice = Invoice::findOrFail($id);
            $invoice->update($request->only(['number', 'status', 'issueDate', 'paidAmount']));

            $items = $request->input('items', []);
            foreach ($items as $item) {
                $invoice->items()->updateOrCreate(
                    ['id' => $item['id'] ?? null],
                    $item
                );
            }
        });
        return redirect()->route('invoices');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();
        return redirect()->route('invoices');
    }
}
