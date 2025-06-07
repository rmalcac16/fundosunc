import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { CheckCircle2Icon } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';
import { toast } from 'sonner';

interface FundoData {
    id: number;
    nombre: string;
    descripcion: string;
    imagen?: string | null;
}

interface FundoEditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    fundo: FundoData | null;
    onSuccess: () => void;
}

interface FormularioFundoEdit {
    nombre: string;
    descripcion: string;
    imagen?: File | null;
    clear_imagen: boolean;
    _method: 'PUT';
}

export default function FundoEditDialog({ isOpen, onClose, fundo, onSuccess }: FundoEditDialogProps) {
    const { data, setData, errors, processing, reset, post } = useForm<Required<FormularioFundoEdit>>({
        nombre: '',
        descripcion: '',
        imagen: null,
        clear_imagen: false,
        _method: 'PUT',
    });

    useEffect(() => {
        if (fundo) {
            setData({
                nombre: fundo.nombre || '',
                descripcion: fundo.descripcion || '',
                imagen: null,
                clear_imagen: false,
                _method: 'PUT',
            });
        } else {
            reset();
        }
    }, [fundo, isOpen, setData, reset]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!fundo) return;

        post(route('fundos.update', fundo.id), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onSuccess();
                onClose();
                toast('Fundo actualizado', {
                    description: 'El fundo se ha actualizado correctamente.',
                    icon: <CheckCircle2Icon />,
                    closeButton: true,
                });
            },
            onError: (errors) => {
                console.error('Error al actualizar el fundo:', errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Fundo</DialogTitle>
                    <DialogDescription>Modifica los detalles del fundo existente.</DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input
                            id="nombre"
                            value={data.nombre || ''}
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
                            value={data.descripcion || ''}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            autoComplete="off"
                            placeholder="Descripción del fundo"
                        />
                        <InputError message={errors.descripcion} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="imagen">Imagen</Label>
                        {fundo?.imagen && !data.clear_imagen && (
                            <div className="flex items-center space-x-2">
                                <img src={`/storage/${fundo.imagen}`} alt="Imagen actual" className="h-16 w-16 rounded-md object-cover" />
                                <Label htmlFor="clear_imagen" className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                                    <Checkbox
                                        id="clear_imagen"
                                        checked={data.clear_imagen}
                                        onCheckedChange={(checked) => {
                                            setData((prevData) => ({
                                                ...prevData,
                                                clear_imagen: !!checked,
                                                imagen: checked ? null : prevData.imagen,
                                            }));
                                        }}
                                    />
                                    Eliminar imagen actual
                                </Label>
                            </div>
                        )}
                        <Input
                            id="imagen"
                            type="file"
                            onChange={(e) => setData('imagen', e.target.files ? e.target.files[0] : null)}
                            accept="image/*"
                            disabled={data.clear_imagen}
                        />
                        <InputError message={errors.imagen} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Actualizando...' : 'Actualizar Fundo'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
