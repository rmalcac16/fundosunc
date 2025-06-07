import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { CheckCircle2Icon } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';
import { toast } from 'sonner';

interface FundoCreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface FormularioFundo {
    nombre: string;
    descripcion: string;
    imagen?: File | null;
}

export default function FundoCreateDialog({ isOpen, onClose, onSuccess }: FundoCreateDialogProps) {
    const { data, setData, post, errors, processing, reset } = useForm<Required<FormularioFundo>>({
        nombre: '',
        descripcion: '',
        imagen: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('fundos.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onSuccess();
                onClose();
                toast('Fundo creado', {
                    closeButton: true,
                    description: 'El fundo se ha registrado correctamente.',
                    icon: <CheckCircle2Icon />,
                });
            },
        });
    };

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Nuevo Fundo</DialogTitle>
                    <DialogDescription>Completa los campos para registrar un nuevo fundo.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                            id="nombre"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            required
                            autoComplete="off"
                            placeholder="Nombre del fundo"
                        />
                        <InputError message={errors.nombre} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="descripcion">Descripción</Label>
                        <Input
                            id="descripcion"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            autoComplete="off"
                            placeholder="Descripción del fundo"
                        />
                        <InputError message={errors.descripcion} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="imagen">Imagen</Label>
                        <Input
                            id="imagen"
                            type="file"
                            onChange={(e) => setData('imagen', e.target.files ? e.target.files[0] : null)}
                            accept="image/*"
                        />
                        <InputError message={errors.imagen} />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Guardando...' : 'Guardar Fundo'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
