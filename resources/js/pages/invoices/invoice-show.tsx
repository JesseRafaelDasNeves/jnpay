import { Form, Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { descriptionStatusInvoice } from '@/helpers/invoice.helper';
import type { Invoice } from '@/interfaces/invoice.interface';
import { InvoiceStatusE } from '@/interfaces/invoice.interface';

export default function InvoiceShow({ register }: { register: Invoice }) {
  const totalAmount = useMemo(
    () =>
      register.items.reduce(
        (sum, item) =>
          sum +
          (typeof item.amount === 'string'
            ? parseFloat(item.amount)
            : item.amount),
        0,
      ),
    [register.items],
  );

  const paidAmount = register.paidAmount || 0;
  const pendingAmount = totalAmount - paidAmount;

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
      <Head title="Detalhes da Fatura" />
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Section */}
          <div className="border-b pb-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">Detalhes da Fatura</h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                  Gerenciamento de faturas em aberto.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Items and History */}
            <div className="col-span-12 space-y-6 lg:col-span-8">
              <Card>
                <CardContent className="flex flex-row justify-between gap-2 pt-0">
                  <div>
                    Número da Fatura:{' '}
                    <span className="font-bold">{register.number}</span>
                  </div>
                  <div>
                    <span>Status: </span>
                    <Badge className={classNameStatus(register.status)}>
                      {descriptionStatusInvoice(register.status)}
                    </Badge>
                  </div>
                  <div>
                    Data de Emissão:{' '}
                    <span className="font-bold">{register.issueDate}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Items Table */}
              <Card className="overflow-hidden">
                <div className="flex border-b bg-muted px-6 py-3 text-sm font-medium">
                  <div className="flex-1">Descrição do Item</div>
                  <div className="w-32 text-right">Valor Total</div>
                  <div className="w-48 text-center">Progresso</div>
                  <div className="w-32 text-right">Valor Pago</div>
                </div>
                <div>
                  {register.items.map((item, index) => {
                    const itemAmount =
                      typeof item.amount === 'string'
                        ? parseFloat(item.amount)
                        : item.amount;
                    const percentagePaid = item.percentagePaid || 0;
                    const itemPending = itemAmount * (1 - percentagePaid / 100);

                    return (
                      <div
                        key={item.id || index}
                        className="flex items-center border-b px-6 py-4 transition-colors last:border-b-0 hover:bg-muted/50"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {item.description}
                          </p>
                        </div>
                        <div className="w-32 text-right font-mono text-sm">
                          {formatCurrency(itemAmount)}
                        </div>
                        <div className="w-48 px-4">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-xs font-medium">
                              {percentagePaid}% Pago
                            </span>
                          </div>
                          <Progress value={percentagePaid} />
                        </div>
                        <div className="w-32 text-right font-mono font-semibold">
                          {formatCurrency(itemAmount - itemPending)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Right Column - Payment Card */}
            <div className="col-span-12 lg:col-span-4">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Totalizadores</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...InvoiceController.updatePay.form(register!.id)}>
                    {/* Summary */}
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Valor Total da Fatura</span>
                        <span className="font-mono">
                          {formatCurrency(totalAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Valor pago</span>
                        <span className="font-mono">
                          {formatCurrency(paidAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-3 text-base font-bold">
                        <span>SALDO DEVEDOR</span>
                        <span className="font-mono">
                          {formatCurrency(pendingAmount)}
                        </span>
                      </div>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2">
            <Link href="/invoices">
              <Button
                variant="outline"
                type="button"
                className="cursor-pointer"
              >
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
