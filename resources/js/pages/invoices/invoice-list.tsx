import { Head, Link, router } from '@inertiajs/react';
import { CreditCard, Eye, SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { create, destroy, edit, pay, show } from '@/routes/invoices';

export default function InvoiceList({ data }: { data: Invoice[] }) {
  const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);

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
              <TableHead className="w-25">Número</TableHead>
              <TableHead className="w-32.5">Data de Emissão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-37.5 text-right">Valor Total</TableHead>
              <TableHead className="w-37.5 text-right">Valor Pago</TableHead>
              <TableHead className="w-25 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.number}</TableCell>
                <TableCell>{invoice.issueDate}</TableCell>
                <TableCell>
                  <Badge
                    variant={'outline'}
                    className={classNameStatus(invoice.status)}
                  >
                    {descriptionStatusInvoice(invoice.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sumAmountItems(invoice.items))}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(invoice.paidAmount || 0)}
                </TableCell>
                <TableCell className="flex justify-end">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="link"
                      style={{ padding: 0 }}
                      className="h-4 w-4 cursor-pointer text-primary hover:underline"
                      title="Editar"
                      disabled={invoice.status !== InvoiceStatusE.PENDING}
                      onClick={() => router.get(edit(invoice.id).url)}
                    >
                      <SquarePen className="h-4 w-4" />
                    </Button>
                    <AlertDialog
                      open={invoiceToDelete === invoice.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setInvoiceToDelete(null);
                        }
                      }}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="link"
                          style={{ padding: 0 }}
                          className="h-4 w-4 cursor-pointer"
                          title="Excluir"
                          disabled={invoice.status !== InvoiceStatusE.PENDING}
                          onClick={() => setInvoiceToDelete(invoice.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2 />
                          </AlertDialogMedia>
                          <AlertDialogTitle>
                            Tem certeza que deseja excluir esta fatura?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso irá excluir a
                            fatura.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            className="cursor-pointer"
                            onClick={() => setInvoiceToDelete(null)}
                          >
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="cursor-pointer"
                            onClick={() => {
                              router.delete(destroy(invoice.id).url);
                              setInvoiceToDelete(null);
                            }}
                          >
                            Continuar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button
                      variant="link"
                      style={{ padding: 0 }}
                      className="h-4 w-4 cursor-pointer text-primary hover:underline"
                      title="Pagar"
                      disabled={invoice.status === InvoiceStatusE.PAID}
                      onClick={() => router.get(pay(invoice.id).url)}
                    >
                      <CreditCard className="h-4 w-4" />
                    </Button>
                    <Link
                      href={show(invoice.id)}
                      className="text-primary hover:underline"
                      title="Ver detalhes"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
