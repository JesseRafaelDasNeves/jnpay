<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class InvoiceRequest extends FormRequest
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
            'number' => ['required', 'string', 'max:100'],
            'status' => ['required', 'string', 'in:PENDENTE,PARCIALMENTE_PAGO,PAGO'],
            'issueDate' => ['required', 'date'],
            'items' => ['array'],
            'items.*.description' => ['required', 'string', 'max:100'],
            'items.*.amount' => ['required', 'numeric', 'min:1'],
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
            'number.required' => 'O número da fatura é obrigatório.',
            'number.string' => 'O número da fatura deve ser um texto.',
            'number.max' => 'O número da fatura não pode ter mais de 100 caracteres.',
            
            'status.required' => 'O status da fatura é obrigatório.',
            'status.string' => 'O status deve ser um texto.',
            'status.in' => 'O status deve ser um dos seguintes: PENDENTE, PARCIALMENTE_PAGO ou PAGO.',
            
            'issueDate.required' => 'A data de emissão é obrigatória.',
            'issueDate.date' => 'A data de emissão deve ser uma data válida.',
            
            'items.array' => 'Os itens devem ser um array.',
            'items.*.description.required' => 'A descrição do item é obrigatória.',
            'items.*.description.string' => 'A descrição do item deve ser um texto.',
            'items.*.description.max' => 'A descrição do item não pode ter mais de 100 caracteres.',
            
            'items.*.amount.required' => 'O valor do item é obrigatório.',
            'items.*.amount.numeric' => 'O valor do item deve ser um número.',
            'items.*.amount.min' => 'O valor do item deve ser maior que 0.',
        ];
    }
}
