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

interface FundoForceDeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    fundo: FundoData | null;
    onSuccess: () => void;
}

export default function FundoForceDeleteDialog({ isOpen, onClose, fundo, onSuccess }: FundoForceDeleteDialogProps) {
    const { delete: destroy, processing } = useForm();

    const handleForceDelete = () => {
        if (!fundo) return;

        destroy(route('fundos.forceDelete', fundo.id), {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
                onClose();
                toast('Fundo eliminado permanentemente', {
                    closeButton: true,
                    description: 'Este fundo ha sido eliminado de forma definitiva.',
                    icon: <Trash2Icon />,
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
                    <AlertDialogTitle>¿Eliminar permanentemente este fundo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. El fundo
                        <span className="ml-1 font-semibold text-red-600">{fundo?.nombre || 'N/A'}</span> será eliminado de forma definitiva.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleForceDelete} disabled={processing} className="bg-red-600 hover:bg-red-700">
                        {processing ? 'Eliminando...' : 'Eliminar'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
