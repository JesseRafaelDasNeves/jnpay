<?php

namespace App\Http\Controllers;

use App\Enums\InvoiceStatus;
use App\Http\Requests\InvoiceRequest;
use App\Http\Requests\PaymentInvoiceRequest;
use App\Models\Invoice;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
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
    public function store(InvoiceRequest $request)
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
    public function update(InvoiceRequest $request, string $id)
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

    /**
     * Pay invoice
     */
    public function pay(string $id)
    {
        $invoice = Invoice::with('items')->findOrFail($id);
        return Inertia::render('invoices/invoice-pay', [
            'register' => $invoice,
        ]);
    }

    /**
     * Update Pay invoice
     */
    public function updatePay(PaymentInvoiceRequest $request, string $id)
    {
        $invoice = Invoice::with('items')->findOrFail($id);
        $currentPayment = (float)$invoice->paidAmount;
        $totalAmount = $invoice->items->sum(function ($item) {
            return (float)$item->amount;
        }); 
        $paidAmontInput = (float)$request->input('paidAmount', 0);
        $paidAmountNew = $paidAmontInput + $currentPayment;
        
        // Validação: impedir pagamento superior ao total
        if ($paidAmountNew > $totalAmount) {
            $request->validateLimitPaidAmount($currentPayment, $totalAmount);
        }
        
        $paidProportion = $paidAmountNew / $totalAmount;

        DB::transaction(function () use ($invoice, $paidAmountNew, $paidProportion, $totalAmount) {
            $invoice->update([
                'paidAmount' => $paidAmountNew,
                'status' => $paidAmountNew === $totalAmount ? InvoiceStatus::PAID->value : InvoiceStatus::PARTIALLY_PAID->value,
            ]);

            foreach ($invoice->items as $item) {                
                $item->update([
                    'percentagePaid' => $paidProportion * 100,
                ]);
            }
        });

        return redirect()->route('invoices'); 
    }
}
