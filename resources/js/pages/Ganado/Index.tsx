import type { PageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import * as React from 'react';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { FundoData } from '@/types/fundo';
import { GanadoData } from '@/types/ganado';
import { RazaData } from '@/types/raza';

import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import GanadoCreateDialog from './GanadoCreateDialog';
import { GanadoDataTable } from './GanadoDataTable';

interface CustomPageProps extends PageProps {
    activeGanados: GanadoData[];
    deletedGanados: GanadoData[];
    razas: RazaData[];
    fundo: FundoData;
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Gestión de Ganado', href: '/ganado' }];

export default function Index() {
    const [editing, setEditing] = React.useState<GanadoData | null>(null);

    const { activeGanados, deletedGanados, razas, fundo } = usePage<CustomPageProps>().props;

    const allGanados = React.useMemo(() => {
        return [...activeGanados, ...deletedGanados].sort((a, b) => a.id - b.id);
    }, [activeGanados, deletedGanados]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Ganado" />

            <div className="mx-auto w-full space-y-6 px-4 py-8">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                        <Link href={route('fundos.show', { fundo: fundo.id })}>
                            <ChevronLeft />
                        </Link>
                        <h1 className="text-2xl font-semibold">Gestión de Ganado</h1>
                    </div>
                    <GanadoCreateDialog fundo={fundo} razas={razas} />
                </div>

                <Card className="shadow-lg">
                    <CardContent className="p-4">
                        <GanadoDataTable data={allGanados} fundo={fundo} razas={razas} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
