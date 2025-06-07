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
import { CheckCircle2Icon } from 'lucide-react';
import { toast } from 'sonner';

interface FundoData {
    id: number;
    nombre: string;
}

interface FundoRestoreDialogProps {
    isOpen: boolean;
    onClose: () => void;
    fundo: FundoData | null;
    onSuccess: () => void;
}

export default function FundoRestoreDialog({ isOpen, onClose, fundo, onSuccess }: FundoRestoreDialogProps) {
    const { post, processing } = useForm();

    const handleRestore = () => {
        if (!fundo) return;

        post(route('fundos.restore', fundo.id), {
            preserveScroll: true,
            onSuccess: () => {
                onSuccess();
                onClose();
                toast('Fundo restaurado', {
                    closeButton: true,
                    description: 'El fundo se ha restaurado correctamente.',
                    icon: <CheckCircle2Icon />,
                });
            },
            onError: (errors) => {
                console.error('Error al restaurar el fundo:', errors);
            },
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Restaurar este fundo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esto restaurará el fundo
                        <span className="ml-1 font-semibold">{fundo?.nombre || 'N/A'}</span> y estará nuevamente disponible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRestore} disabled={processing}>
                        {processing ? 'Restaurando...' : 'Restaurar'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
