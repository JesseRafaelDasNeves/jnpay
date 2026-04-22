import { Form, Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useState, useMemo } from 'react';

import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { descriptionStatusInvoice } from '@/helpers/invoice.helper';
import type { Invoice } from '@/interfaces/invoice.interface';

export default function InvoicePay({ register }: { register: Invoice }) {
  const [paymentAmount, setPaymentAmount] = useState(
    (
      register.items.reduce(
        (sum, item) =>
          sum +
          (typeof item.amount === 'string'
            ? parseFloat(item.amount)
            : item.amount),
        0,
      ) - (register.paidAmount || 0)
    ).toFixed(2),
  );

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

  return (
    <>
      <Head title="Pagar Fatura" />
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Section */}
          <div className="border-b pb-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">Realizar Pagamento</h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                  Gerenciamento de faturas em aberto.
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground uppercase">
                  Saldo Devedor Atual
                </p>
                <p className="text-5xl font-bold">
                  R$ {pendingAmount.toFixed(2).replace('.', ',')}
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
                    <Badge>{descriptionStatusInvoice(register.status)}</Badge>
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
                  <div className="w-32 text-right">Pendente</div>
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
                          R$ {itemAmount.toFixed(2).replace('.', ',')}
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
                          R$ {itemPending.toFixed(2).replace('.', ',')}
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
                  <CardTitle>Finalizar Saldo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Form {...InvoiceController.updatePay.form(register!.id)}>
                    {({
                      processing,
                      errors,
                    }: {
                      processing: boolean;
                      errors: Record<string, string>;
                    }) => (
                      <>
                        {/* Amount Input */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase">
                            Valor a Pagar (R$)
                          </label>
                          <Input
                            type="number"
                            step="0.01"
                            id="paidAmount"
                            name="paidAmount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            placeholder="0,00"
                            className="text-right font-mono text-2xl"
                          />
                          <InputError
                            message={errors.paidAmount}
                            className="mt-2"
                          />
                        </div>

                        {/* Summary */}
                        <div className="space-y-3 border-t pt-4">
                          <div className="flex justify-between text-sm">
                            <span>Subtotal Pendente</span>
                            <span className="font-mono">
                              R$ {pendingAmount.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Encargos</span>
                            <span className="font-mono">R$ 0,00</span>
                          </div>
                          <div className="flex justify-between border-t pt-3 text-base font-bold">
                            <span>TOTAL</span>
                            <span className="font-mono">
                              R$ {paymentAmount}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pt-4">
                          <Button
                            className="w-full cursor-pointer gap-2"
                            size="lg"
                            disabled={processing}
                          >
                            <Icon iconNode={CheckCircle2} className="h-4 w-4" />
                            {processing
                              ? 'Processando...'
                              : 'Efetuar Pagamento'}
                          </Button>
                        </div>
                      </>
                    )}
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
                Cancelar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
