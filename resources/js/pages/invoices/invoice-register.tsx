import { Form, Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { Trash2, Plus, Calendar as CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import InvoiceController from '@/actions/App/Http/Controllers/InvoiceController';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { InvoiceStatus  } from '@/interfaces/invoice.interface';
import type {InvoiceItem} from '@/interfaces/invoice.interface';


export default function InvoiceRegister() {
    const [items, setItems] = useState<InvoiceItem[]>([
        { description: '', amount: '' },
    ]);
    const [date, setDate] = React.useState<Date>();
    const [status] = React.useState<string>(InvoiceStatus.PENDING);

    const total = items.reduce((sum, item) => {
        const amount =
            typeof item.amount === 'number'
                ? item.amount
                : parseFloat(item.amount as string) || 0;

        return sum + amount;
    }, 0);

    function handleAddItem() {
        setItems([...items, { description: '', amount: '' }]);
    }

    function handleRemoveItem(index: number) {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    }

    function handleItemChange(
        index: number,
        field: keyof InvoiceItem,
        value: string | number,
    ) {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    }

    return (
        <>
            <Head title="Nova Fatura" />
            <div className="bg-white p-6">
                <h1 className="mb-6 text-3xl font-bold">Nova Fatura</h1>
                <Separator className="mb-6" />

                <Form {...InvoiceController.store.form()} className="space-y-8">
                    {({
                        processing,
                        errors,
                    }: {
                        processing: boolean;
                        errors: Record<string, string>;
                    }) => (
                        <>
                            {/* Informações da Fatura Section */}
                            <div>
                                <div className="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                                    Informações da Fatura
                                </div>

                                <div className="flex gap-4">
                                    <div className="grid w-70 gap-2">
                                        <Label htmlFor="number">
                                            Número da Fatura
                                        </Label>
                                        <Input
                                            id="number"
                                            name="number"
                                            placeholder="FAT-001"
                                            className="block w-full"
                                            required
                                        />
                                        <InputError
                                            message={errors.number}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid w-50 gap-2">
                                        <Label htmlFor="issueDate">
                                            Data de Emissão
                                        </Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal"
                                                    type="button"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date ? (
                                                        format(
                                                            date,
                                                            'dd/MM/yyyy',
                                                        )
                                                    ) : (
                                                        <span>
                                                            Selecione uma data
                                                        </span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Input
                                            id="issueDate"
                                            name="issueDate"
                                            type="hidden"
                                            required
                                            value={
                                                date
                                                    ? format(date, 'yyyy-MM-dd')
                                                    : ''
                                            }
                                        />
                                        <InputError
                                            message={errors.issueDate}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* items da Fatura Section */}
                            <div>
                                <div className="mb-4 border-l-2 border-black pl-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                                    Itens da Fatura
                                </div>

                                <div className="space-y-4">
                                    {items.map((item, index) => (
                                        <div key={index}>
                                            <div className="flex items-end gap-3">
                                                <div className="grid flex-1 gap-2">
                                                    {index === 0 && (
                                                        <Label
                                                            htmlFor={`items-${index}-description`}
                                                        >
                                                            Descrição
                                                        </Label>
                                                    )}
                                                    <Input
                                                        id={`items-${index}-description`}
                                                        name={`items[${index}][description]`}
                                                        placeholder="Descrição do item"
                                                        value={item.description}
                                                        onChange={(e) =>
                                                            handleItemChange(
                                                                index,
                                                                'description',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `items.${index}.description`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <div className="grid w-32 gap-2">
                                                    {index === 0 && (
                                                        <Label
                                                            htmlFor={`items-${index}-amount`}
                                                        >
                                                            Valor (R$)
                                                        </Label>
                                                    )}
                                                    <Input
                                                        id={`items-${index}-amount`}
                                                        name={`items[${index}][amount]`}
                                                        type="number"
                                                        placeholder="0,00"
                                                        step="0.01"
                                                        min="0"
                                                        value={item.amount}
                                                        onChange={(e) =>
                                                            handleItemChange(
                                                                index,
                                                                'amount',
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `items.${index}.amount`
                                                            ]
                                                        }
                                                        className="mt-2"
                                                    />
                                                </div>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            type="button"
                                                            onClick={() =>
                                                                handleRemoveItem(
                                                                    index,
                                                                )
                                                            }
                                                            disabled={
                                                                items.length ===
                                                                1
                                                            }
                                                            className={
                                                                items.length ===
                                                                1
                                                                    ? 'text-muted-foreground/50'
                                                                    : 'text-destructive'
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Remover item
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>

                                            {index < items.length - 1 && (
                                                <Separator className="mt-4" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleAddItem}
                                    className="mt-4 gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Adicionar Item
                                </Button>

                                <InputError
                                    message={errors.items}
                                    className="mt-2"
                                />
                            </div>

                            {/* Summary Row */}
                            <div className="flex items-center justify-end gap-4 border-t pt-6">
                                <Input
                                    id="status"
                                    name="status"
                                    type="hidden"
                                    required
                                    value={status}
                                />
                                <Badge variant="outline">
                                    {status === InvoiceStatus.PENDING
                                        ? 'PENDENTE'
                                        : status === InvoiceStatus.PARTIALLY_PAID
                                        ? 'PARCIALMENTE PAGO'
                                        : 'PAGO'}
                                </Badge>
                                <span className="font-mono text-lg font-bold">
                                    Valor Total: R$ {total.toFixed(2)}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2">
                                <Link href="/invoices">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        disabled={processing}
                                    >
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button disabled={processing}>
                                    {processing ? 'Criando...' : 'Criar Fatura'}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
