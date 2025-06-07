// resources/js/Pages/Fundos/FundosDataTable.tsx
'use client'; // This directive is important for client-side components in Next.js

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal, PencilIcon, RotateCcwIcon, Trash2Icon } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { FundoData } from './Index';

interface FundosDataTableProps {
    data: FundoData[];
    emptyMessage: string;
    onEdit?: (fundo: FundoData) => void;
    onDelete?: (fundo: FundoData) => void;
    onRestore?: (fundo: FundoData) => void;
    onForceDelete?: (fundo: FundoData) => void;
}

export function FundosDataTable({ data, emptyMessage, onEdit, onDelete, onRestore, onForceDelete }: FundosDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const columns: ColumnDef<FundoData>[] = React.useMemo(
        () => [
            {
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'id',
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            ID <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
                enableHiding: false,
            },
            {
                accessorKey: 'nombre',
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Nombre <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => {
                    const fundo = row.original;
                    const fallbackInitials = fundo.nombre ? fundo.nombre.substring(0, 2).toUpperCase() : '??';

                    return (
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                {fundo.imagen ? (
                                    <AvatarImage src={'storage/' + fundo.imagen} alt={fundo.nombre} />
                                ) : (
                                    <AvatarFallback>{fallbackInitials}</AvatarFallback>
                                )}
                            </Avatar>
                            <div className="flex flex-col">
                                <span className="capitalize">{fundo.nombre}</span>
                                {fundo.deleted_at && (
                                    <Badge variant="destructive" className="mt-1 w-fit">
                                        Eliminado
                                    </Badge>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'descripcion',
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                            Descripción <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => <div className="hidden text-gray-600 md:table-cell dark:text-gray-400">{row.getValue('descripcion')}</div>,
            },
            {
                id: 'actions',
                enableHiding: false,
                cell: ({ row }) => {
                    const fundo = row.original;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                {!fundo.deleted_at ? (
                                    <>
                                        <DropdownMenuItem onClick={() => onEdit?.(fundo)}>
                                            <PencilIcon className="mr-2 h-4 w-4" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onDelete?.(fundo)} className="text-red-600 focus:text-red-600">
                                            <Trash2Icon className="mr-2 h-4 w-4" /> Eliminar
                                        </DropdownMenuItem>
                                    </>
                                ) : (
                                    <>
                                        <DropdownMenuItem onClick={() => onRestore?.(fundo)}>
                                            <RotateCcwIcon className="mr-2 h-4 w-4" /> Restaurar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => onForceDelete?.(fundo)} className="text-red-600 focus:text-red-600">
                                            <Trash2Icon className="mr-2 h-4 w-4" /> Eliminar permanentemente
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [onEdit, onDelete, onRestore, onForceDelete],
    );

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 py-4">
                <Input
                    placeholder="Filtrar por nombre..."
                    value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('nombre')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columnas <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                    >
                                        {column.id === 'select' ? 'Seleccionar' : column.id === 'actions' ? 'Acciones' : column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500 italic">
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        Anterior
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
