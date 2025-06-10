import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { FundoData } from '@/types/fundo';
import { Head, Link } from '@inertiajs/react';
import { Beef, TrendingUp } from 'lucide-react';

type Props = {
    fundo: FundoData;
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Detalles del fundo', href: '/fundos' }];

export default function FundoDetail({ fundo }: Props) {
    const ganadosNacidosEstaSemana =
        fundo.ganados?.filter((ganado) => {
            const fechaNacimiento = new Date(ganado.fecha_nacimiento || '');
            const inicioSemana = new Date();
            inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
            inicioSemana.setHours(0, 0, 0, 0);
            return fechaNacimiento >= inicioSemana;
        }).length || 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detalle del fundo - ${fundo.nombre}`} />
            <div className="mx-auto w-full space-y-6 px-4 py-8">
                <h1 className="mb-4 text-3xl font-bold">{fundo.nombre}</h1>
                {fundo.descripcion && <p className="mb-8 text-gray-700">{fundo.descripcion}</p>}

                <div className="grid grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardDescription>Ganados</CardDescription>
                            <CardTitle className="flex items-center gap-2 text-4xl">
                                <Beef />
                                {fundo.ganados?.length || 0}
                            </CardTitle>
                            <CardAction>
                                <Badge variant="outline">
                                    <TrendingUp />+ {ganadosNacidosEstaSemana}
                                </Badge>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="justify-between gap-2">
                            <div className="line-clamp-1 flex gap-2 font-medium">
                                Nacidos esta semana <TrendingUp className="size-4" />
                            </div>
                            <Link className="text-xs" href={route('ganados.index', { fundo: fundo.id })}>
                                Administrar
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
