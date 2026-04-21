export interface Invoice {
    id: number;
    number: string;
    status: InvoiceStatusE;
    issueDate: string;
    paidAmount?: number;
    items: InvoiceItem[];
}

export interface InvoiceItem {
    id?: number;
    description: string;
    amount: string | number;
    percentagePaid?: number;
    invoice_id?: number;
}

export enum InvoiceStatusE {
    PENDING = 'PENDENTE',
    PARTIALLY_PAID = 'PARCIALMENTE_PAGO',
    PAID = 'PAGO',
}
