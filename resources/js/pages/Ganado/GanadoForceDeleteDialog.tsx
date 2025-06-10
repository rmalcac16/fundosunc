import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GanadoData } from '@/types/ganado';
import { useForm } from '@inertiajs/react';
import { CircleX, Skull } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface GanadoForceDeleteDialogProps {
    ganado: GanadoData;
}

export default function GanadoForceDeleteDialog({ ganado }: GanadoForceDeleteDialogProps) {
    const [openDialog, setOpenDialog] = React.useState(false);

    const { delete: destroy, processing } = useForm({
        id: ganado.id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        destroy(
            route('ganados.forceDelete', {
                ganado: ganado.id,
                fundo: ganado.fundo_id,
            }),
            {
                onSuccess: () => {
                    toast.success('Ganado eliminado permanentemente');
                    setOpenDialog(false);
                },
                onError: (errors) => console.error(errors),
            },
        );
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant="destructive">
                    <CircleX />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Eliminación Permanente: <span className="font-semibold">{ganado.nombre}</span>
                    </DialogTitle>
                    <DialogDescription>Esta acción eliminará el ganado de forma definitiva. No podrás recuperarlo más adelante.</DialogDescription>
                </DialogHeader>

                <div className="my-4 flex flex-col items-center text-center">
                    <Skull size={96} className="mb-4 text-destructive" />
                    <p className="max-w-sm text-sm text-muted-foreground">
                        Esta acción no se puede deshacer. Asegúrate de que deseas eliminar permanentemente este registro.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex justify-end">
                    <Button type="submit" disabled={processing} variant="destructive">
                        {processing ? 'Eliminando...' : 'Eliminar Permanentemente'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
