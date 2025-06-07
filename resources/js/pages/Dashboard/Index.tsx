import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CheckCircle2Icon, MapPinIcon } from 'lucide-react';

type Fundo = {
    id: number;
    nombre: string;
    activo: boolean;
    created_at: string;
    deleted_at: string | null;
};

type Props = {
    fundos: Fundo[];
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard({ fundos }: Props) {
    const totalFundos = fundos.length;
    const activos = fundos.filter((f) => f.deleted_at === null).length;
    const inactivos = totalFundos - activos;

    const fundosNuevos = fundos.filter((f) => new Date(f.created_at) > new Date(new Date().setMonth(new Date().getMonth() - 1))).length;

    const porcentajeActivos = totalFundos > 0 ? ((activos / totalFundos) * 100).toFixed(1) : '0';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold">Resumen General de Fundos</h1>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardDescription>Total de Fundos Registrados</CardDescription>
                            <CardTitle className="text-4xl">{totalFundos}</CardTitle>
                            <CardAction>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <MapPinIcon className="h-4 w-4" />
                                    {activos} activos
                                </Badge>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="text-muted-foreground">{inactivos} inactivos</CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Fundos Activos</CardDescription>
                            <CardTitle className="text-4xl">{activos}</CardTitle>
                            <CardAction>
                                <Badge variant="outline" className="flex items-center gap-1 text-green-600">
                                    <CheckCircle2Icon className="h-4 w-4" />
                                    {porcentajeActivos}%
                                </Badge>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="text-muted-foreground">De los fundos registrados</CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Fundos Registrados en el último mes</CardDescription>
                            <CardTitle className="text-4xl">{fundosNuevos}</CardTitle>
                            <CardAction>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <MapPinIcon className="h-4 w-4" />
                                    Último mes
                                </Badge>
                            </CardAction>
                        </CardHeader>
                        <CardFooter className="text-muted-foreground">Cantidad de nuevos fundos</CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
