import { Head, Link } from '@inertiajs/react';
import { SquarePen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { descriptionStatusInvoice } from '@/helpers/invoice.helper';
import { InvoiceStatusE } from '@/interfaces/invoice.interface';
import type { Invoice } from '@/interfaces/invoice.interface';
import { create, edit } from '@/routes/invoices';

export default function InvoiceList({ data }: { data: Invoice[] }) {
    function sumAmountItems(items: Invoice['items']): number {
        return items.reduce((total, item) => {
            const amount =
                typeof item.amount === 'number'
                    ? item.amount
                    : parseFloat(item.amount as string) || 0;

            return total + amount;
        }, 0);
    }

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(amount);
    }

    function classNameStatus(status: InvoiceStatusE): string {
        switch (status) {
            case InvoiceStatusE.PAID:
                return 'bg-green-100 text-green-800';
            case InvoiceStatusE.PENDING:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    }

    return (
        <>
            <Head title="Faturas" />
            <div className="items-center justify-between space-y-4 p-4 sm:flex sm:space-y-0">
                <div>
                    <h1 className="text-2xl font-bold">Faturas</h1>
                </div>
                <div>
                    <Link href={create().url} className="">
                        <Button className="cursor-pointer">Criar Fatura</Button>
                    </Link>
                </div>
            </div>
            <div className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Número</TableHead>
                            <TableHead className="w-[130px]">
                                Data de Emissão
                            </TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[150px] text-right">
                                Valor Total
                            </TableHead>
                            <TableHead className="w-[150px] text-right">
                                Valor Pago
                            </TableHead>
                            <TableHead className="w-[100px]">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">
                                    {invoice.number}
                                </TableCell>
                                <TableCell>{invoice.issueDate}</TableCell>
                                <TableCell>
                                    <Badge
                                        variant={'outline'}
                                        className={classNameStatus(
                                            invoice.status,
                                        )}
                                    >
                                        {descriptionStatusInvoice(invoice.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(
                                        sumAmountItems(invoice.items),
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(invoice.paidAmount || 0)}
                                </TableCell>
                                <TableCell>
                                    <Link
                                        href={edit(invoice.id).url}
                                        className="text-primary hover:underline"
                                    >
                                        <SquarePen className="h-4 w-4" />
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
