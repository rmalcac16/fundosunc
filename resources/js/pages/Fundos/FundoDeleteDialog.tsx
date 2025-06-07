import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useForm } from '@inertiajs/react';
import { Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

interface FundoData {
    id: number;
    nombre: string;
}

interface FundoDeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    fundo: FundoData | null;
    onSuccess: () => void;
}

export default function FundoDeleteDialog({ isOpen, onClose, fundo, onSuccess }: FundoDeleteDialogProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        if (!fundo) return;

        destroy(route('fundos.destroy', fundo.id), {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
                onClose();
                toast('Fundo eliminado', {
                    icon: <Trash2Icon />,
                    closeButton: true,
                    description: 'El fundo se ha eliminado correctamente.',
                });
            },
            onError: (errors) => {
                console.error('Error al eliminar el fundo:', errors);
            },
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de que quieres eliminar este fundo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el fundo:
                        <span className="ml-1 font-semibold">{fundo?.nombre || 'N/A'}</span>y todos sus datos asociados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={processing}>
                        {processing ? 'Eliminando...' : 'Eliminar'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
