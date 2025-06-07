import type { PageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import * as React from 'react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import FundoCreateDialog from './FundoCreateDialog';
import FundoDeleteDialog from './FundoDeleteDialog';
import FundoEditDialog from './FundoEditDialog';
import FundoForceDeleteDialog from './FundoForceDeleteDialog';
import FundoRestoreDialog from './FundoRestoreDialog';

import { FundosDataTable } from './FundosDataTable';

interface FlashMessages {
    success?: string;
    error?: string;
}

export interface FundoData {
    id: number;
    nombre: string;
    descripcion: string;
    imagen?: string | null;
    deleted_at?: string | null;
}

interface CustomPageProps extends PageProps {
    [key: string]: unknown;
    activeFundos: FundoData[];
    deletedFundos: FundoData[];
    flash?: FlashMessages;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Gestión de fundos', href: '/fundos' }];

export default function Index() {
    const { flash, activeFundos, deletedFundos } = usePage<CustomPageProps>().props;

    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [isRestoreModalOpen, setIsRestoreModalOpen] = React.useState(false);
    const [isForceDeleteModalOpen, setIsForceDeleteModalOpen] = React.useState(false);
    const [selectedFundo, setSelectedFundo] = React.useState<FundoData | null>(null);

    const openCreate = () => setIsCreateModalOpen(true);
    const closeCreate = () => setIsCreateModalOpen(false);

    const openEdit = (f: FundoData) => {
        setSelectedFundo(f);
        setIsEditModalOpen(true);
    };
    const closeEdit = () => {
        setSelectedFundo(null);
        setIsEditModalOpen(false);
    };

    const openDelete = (f: FundoData) => {
        setSelectedFundo(f);
        setIsDeleteModalOpen(true);
    };
    const closeDelete = () => {
        setSelectedFundo(null);
        setIsDeleteModalOpen(false);
    };

    const openRestore = (f: FundoData) => {
        setSelectedFundo(f);
        setIsRestoreModalOpen(true);
    };
    const closeRestore = () => {
        setSelectedFundo(null);
        setIsRestoreModalOpen(false);
    };

    const openForceDelete = (f: FundoData) => {
        setSelectedFundo(f);
        setIsForceDeleteModalOpen(true);
    };
    const closeForceDelete = () => {
        setSelectedFundo(null);
        setIsForceDeleteModalOpen(false);
    };

    const onSuccess = () => {
        closeCreate();
        closeEdit();
        closeDelete();
        closeRestore();
        closeForceDelete();
        router.reload({ only: ['activeFundos', 'deletedFundos'] });
    };

    const allFundos = React.useMemo(() => {
        return [...activeFundos, ...deletedFundos].sort((a, b) => a.id - b.id);
    }, [activeFundos, deletedFundos]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de fundos" />
            <div className="container mx-auto space-y-6 px-4 py-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <Button onClick={openCreate} className="w-full sm:w-auto">
                        Nuevo fundo
                    </Button>
                </div>

                <Card className="shadow-lg">
                    <CardContent className="p-4">
                        <FundosDataTable
                            data={allFundos}
                            emptyMessage="No hay fundos registrados."
                            onEdit={openEdit}
                            onDelete={openDelete}
                            onRestore={openRestore}
                            onForceDelete={openForceDelete}
                        />
                    </CardContent>
                </Card>
            </div>

            <FundoCreateDialog isOpen={isCreateModalOpen} onClose={closeCreate} onSuccess={onSuccess} />
            <FundoEditDialog isOpen={isEditModalOpen} onClose={closeEdit} fundo={selectedFundo} onSuccess={onSuccess} />
            <FundoDeleteDialog isOpen={isDeleteModalOpen} onClose={closeDelete} fundo={selectedFundo} onSuccess={onSuccess} />
            <FundoRestoreDialog isOpen={isRestoreModalOpen} onClose={closeRestore} fundo={selectedFundo} onSuccess={onSuccess} />
            <FundoForceDeleteDialog isOpen={isForceDeleteModalOpen} onClose={closeForceDelete} fundo={selectedFundo} onSuccess={onSuccess} />
        </AppLayout>
    );
}
