<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class PaymentInvoiceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'paidAmount' => 'required|numeric|min:0.1',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {        
        return [
            'paidAmount.required' => 'O valor pago é obrigatório.',
            'paidAmount.numeric' => 'O valor pago deve ser um número.',
            'paidAmount.min' => 'O valor pago deve ser pelo menos 0.1.',
        ];
    }

    public function validateLimitPaidAmount($currentPayment, $totalAmount)
    {
        $newPayment = (float)$this->input('paidAmount');
        if ($currentPayment + $newPayment > $totalAmount) {
            $formattedTotal = number_format($totalAmount - $currentPayment, 2, ',', '.');
            throw ValidationException::withMessages([
                'paidAmount' => 'O valor a pagar não pode exceder o total da fatura. Máximo permitido: R$ ' . $formattedTotal
            ]);
        }
    }
}
