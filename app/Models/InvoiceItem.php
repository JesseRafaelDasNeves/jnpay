<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['description', 'amount', 'percentagePaid', 'invoice_id'])]
class InvoiceItem extends Model
{}