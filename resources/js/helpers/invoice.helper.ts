import { InvoiceStatusE } from "@/interfaces/invoice.interface";

export function descriptionStatusInvoice(status: string): string {
    switch (status) {
        case InvoiceStatusE.PENDING:
            return 'Pendente';
        case InvoiceStatusE.PARTIALLY_PAID:
            return 'Parcialmente Paga';
        case InvoiceStatusE.PAID:
            return 'Paga';
        default:
            return '';
    }
}
