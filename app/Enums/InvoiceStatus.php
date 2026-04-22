<?php

namespace App\Enums;

enum InvoiceStatus: string
{
    case PENDING = 'PENDENTE';
    case PARTIALLY_PAID = 'PARCIALMENTE_PAGO';
    case PAID = 'PAGO';
}