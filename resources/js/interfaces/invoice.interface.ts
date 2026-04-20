export interface Invoice {
    id: number;
    number: string;
    status: string;
    issueDate: string;
    paidAmount?: number;
    items: InvoiceItem[];
}

export interface InvoiceItem {
    description: string;
    amount: string | number;
    percentagePaid?: number;
    invoice_id?: number;
}

export enum InvoiceStatus {
    PENDING = 'PENDENTE',
    PARTIALLY_PAID = 'PARCIALMENTE_PAGO',
    PAID = 'PAGO',
}
