import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import InputError from '@/components/input-error';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function RazaDialogCreate() {
    const [open, setOpen] = useState(false);

    const { data, setData, errors, processing, reset, post } = useForm({
        nombre: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        post(route('razas.store'), {
            onSuccess: () => {
                toast.success('Raza creada exitosamente');
                reset();
                setOpen(false);
            },
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="text-xs">
                    <Plus />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Agregar Nueva Raza</DialogTitle>
                    <DialogDescription>Registra una nueva raza para el ganado.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-3">
                        <Label htmlFor="nombre">Nombre de la raza</Label>
                        <Input
                            required
                            id="nombre"
                            type="text"
                            placeholder="Ej: Holstein, Angus, etc."
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                        />
                        <InputError message={errors.nombre} />
                    </div>

                    <Button type="submit" disabled={processing}>
                        {processing ? 'Guardando...' : 'Guardar Raza'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
