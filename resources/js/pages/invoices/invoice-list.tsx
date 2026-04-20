import { Head, Link } from '@inertiajs/react';
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
import type { Invoice } from '@/interfaces/invoice.interface';
import { create } from '@/routes/invoices';

export default function InvoiceList({ data }: { data: Invoice[] }) {
    function sumAmountItems(items: Invoice['items']): number {
        return items.reduce((total, item) => {
            const amount = typeof item.amount === 'number' ? item.amount : parseFloat(item.amount as string) || 0;

            return total + amount;
        }, 0);
    }

    function formatCurrency(amount: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(amount);
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
                            <TableHead className='w-[130px]'>Data Emissão</TableHead>
                            <TableHead className='w-[120px]'>Status</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                            <TableHead className="text-right">
                                Valor Pago
                            </TableHead>
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
                                        className={
                                            invoice.status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : invoice.status === 'pending'
                                                  ? 'bg-yellow-100 text-yellow-800'
                                                  : 'bg-red-100 text-red-800'
                                        }
                                    >
                                        {invoice.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(sumAmountItems(invoice.items))}
                                </TableCell>
                                <TableCell className="text-right">
                                    {formatCurrency(invoice.paidAmount || 0)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}
