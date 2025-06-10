import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GanadoData } from '@/types/ganado';
import { useForm } from '@inertiajs/react';
import { CircleX, Trash2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface GanadoDeleteDialogProps {
    ganado: GanadoData;
}

export default function GanadoDeleteDialog({ ganado }: GanadoDeleteDialogProps) {
    const [openDialog, setOpenDialog] = React.useState(false);

    const { delete: destroy, processing } = useForm({
        id: ganado.id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        destroy(
            route('ganados.destroy', {
                ganado: ganado.id,
                fundo: ganado.fundo_id,
            }),
            {
                onSuccess: () => {
                    toast.success('Ganado eliminado exitosamente');
                    setOpenDialog(false);
                },
                onError: (errors) => console.error(errors),
            },
        );
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="outline" className="text-destructive">
                    <Trash2 />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Eliminar Ganado: <span className="font-semibold">{ganado.nombre}</span>
                    </DialogTitle>
                    <DialogDescription>Esta acción enviará el ganado a la papelera.</DialogDescription>
                </DialogHeader>

                <div className="my-4 flex flex-col items-center text-center">
                    <CircleX size={96} className="mb-4 text-destructive" />
                    <p className="max-w-sm text-sm text-muted-foreground">
                        Esta eliminación no es definitiva. Podrás restaurar este ganado más adelante si lo necesitas desde la papelera.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex justify-end">
                    <Button type="submit" disabled={processing} variant="destructive">
                        {processing ? 'Eliminando...' : 'Eliminar Ganado'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
