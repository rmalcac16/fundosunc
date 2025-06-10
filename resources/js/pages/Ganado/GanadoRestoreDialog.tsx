import { useForm } from '@inertiajs/react';
import { RotateCcw } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GanadoData } from '@/types/ganado';

interface GanadoRestoreDialogProps {
    ganado: GanadoData;
}

export default function GanadoRestoreDialog({ ganado }: GanadoRestoreDialogProps) {
    const [openDialog, setOpenDialog] = React.useState(false);

    const { post, processing } = useForm({
        id: ganado.id,
    });

    const handleRestore = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        post(
            route('ganados.restore', {
                fundo: ganado.fundo_id,
                ganado: ganado.id,
            }),
            {
                onSuccess: () => {
                    toast.success('Ganado restaurado exitosamente');
                    setOpenDialog(false);
                },
                onError: (errors) => console.error(errors),
            },
        );
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <RotateCcw className="text-green-600" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Restaurar Ganado: <span className="font-semibold">{ganado.nombre}</span>
                    </DialogTitle>
                    <DialogDescription>Esta acción restaurará el ganado y lo volverá a activar en el sistema.</DialogDescription>
                </DialogHeader>

                <div className="my-4 flex flex-col items-center text-center">
                    <RotateCcw size={96} className="mb-4 text-green-600" />
                    <p className="max-w-sm text-sm text-muted-foreground">
                        Este ganado fue enviado previamente a la papelera. Puedes restaurarlo para que vuelva a estar disponible en el sistema.
                    </p>
                </div>

                <form onSubmit={handleRestore} className="mt-4 flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Restaurando...' : 'Restaurar Ganado'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
