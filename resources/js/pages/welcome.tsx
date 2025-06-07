import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { School, Settings2, Sprout } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Fundos UNC" />

            <div className="flex min-h-screen flex-col">
                {/* Barra superior */}
                <header className="flex w-full items-center justify-end gap-4 p-4">
                    {auth.user ? (
                        <Button asChild>
                            <Link href={route('dashboard')}>Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" asChild>
                                <Link href={route('login')}>Iniciar Sesión</Link>
                            </Button>
                            <Button asChild>
                                <Link href={route('register')}>Registrarse</Link>
                            </Button>
                        </>
                    )}
                </header>

                {/* Contenido principal */}
                <main className="flex flex-1 items-center justify-center px-4">
                    <Card className="w-full max-w-2xl text-center">
                        <CardContent className="space-y-6 py-12">
                            <div className="flex justify-center gap-4 text-primary">
                                <Sprout size={36} />
                                <School size={36} />
                                <Settings2 size={36} />
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight">Sistema de Gestión de Fundos UNC</h1>
                            <p className="text-lg text-muted-foreground">
                                Tecnología para el monitoreo, producción y análisis agrícola en la Universidad Nacional de Cajamarca.
                            </p>

                            <footer className="pt-8 text-xs text-muted-foreground">
                                Desarrollado por <strong>Sistemas UNC</strong>
                            </footer>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </>
    );
}
