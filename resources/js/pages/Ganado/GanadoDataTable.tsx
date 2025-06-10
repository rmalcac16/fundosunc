'use client';

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
import { ChevronDown } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { formatDate } from '@/lib/utils';
import { FundoData } from '@/types/fundo';
import { GanadoData } from '@/types/ganado';
import { RazaData } from '@/types/raza';
import GanadoDeleteDialog from './GanadoDeleteDialog';
import GanadoEditDialog from './GanadoEditDialog';
import GanadoForceDeleteDialog from './GanadoForceDeleteDialog';
import GanadoRestoreDialog from './GanadoRestoreDialog';

interface GanadoDataTableProps {
    data: GanadoData[];
    fundo: FundoData;
    razas: RazaData[];
}

export function GanadoDataTable({ data, fundo, razas }: GanadoDataTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const columns: ColumnDef<GanadoData>[] = [
        {
            accessorKey: 'codigo',
            header: 'Código',
            cell: ({ row }) => <div>{row.getValue('codigo')}</div>,
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre',
            cell: ({ row }) => <div>{row.getValue('nombre')}</div>,
        },
        {
            accessorKey: 'raza.nombre',
            header: 'Raza',
            cell: ({ row }) => <div>{row.original.raza?.nombre}</div>,
        },
        {
            accessorKey: 'fecha_nacimiento',
            header: 'Nacimiento',
            cell: ({ row }) => <div>{row.original.fecha_nacimiento ? formatDate(row.original.fecha_nacimiento) : '-'}</div>,
        },
        {
            accessorKey: 'genero',
            header: 'Género',
            cell: ({ row }) => <div className="capitalize">{row.getValue('genero')}</div>,
        },
        {
            accessorKey: 'estado',
            header: 'Estado',
            cell: ({ row }) => {
                const estado = row.getValue('estado');
                const estadoVariantMap: Record<string, 'default' | 'destructive' | 'secondary' | 'outline'> = {
                    activo: 'default',
                    inactivo: 'destructive',
                    produccion: 'secondary',
                    vendido: 'outline',
                    muerto: 'destructive',
                };
                const variant = estadoVariantMap[String(estado).toLowerCase()] ?? 'default';

                return (
                    <Badge variant={variant} className="capitalize">
                        {String(estado)}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const gan = row.original;

                const isDeleted = !!gan.deleted_at;

                return (
                    <div className="flex items-center gap-2">
                        {!isDeleted && (
                            <>
                                <GanadoEditDialog fundo={fundo} razas={razas} ganado={gan} />
                                <GanadoDeleteDialog ganado={gan} />
                            </>
                        )}
                        {isDeleted && (
                            <>
                                <GanadoRestoreDialog ganado={gan} />
                                <GanadoForceDeleteDialog ganado={gan} />
                            </>
                        )}
                    </div>
                );
            },
        },
    ];

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
            <div className="flex items-center py-4">
                <Input
                    placeholder="Buscar por nombre..."
                    value={(table.getColumn('nombre')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('nombre')?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columnas <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    className={row.original.deleted_at ? 'text-destructive line-through' : ''}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} seleccionado(s).
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
