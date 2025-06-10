import { Button } from '@/components/ui/button';

import { FundoData } from '@/types/fundo';
import { useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import RazaDialogCreate from '@/components/raza-dialog-create';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GanadoData } from '@/types/ganado';
import { RazaData } from '@/types/raza';
import { ChevronDownIcon, Edit } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface GanadoCreateDialogProps {
    fundo: FundoData;
    razas: RazaData[];
    ganado: GanadoData;
}

interface GanadoFormData {
    codigo: string;
    nombre: string;
    fecha_nacimiento: Date;
    genero: 'macho' | 'hembra';
    raza_id: string;
    estado?: 'activo' | 'produccion' | 'vendido' | 'muerto';
    fundo_id: number;
}

export default function GanadoEditDialog({ fundo, razas, ganado }: GanadoCreateDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [openDialog, setOpenDialog] = React.useState(false);

    const { data, setData, errors, processing, transform, reset, put } = useForm<Required<GanadoFormData>>({
        codigo: ganado.codigo || '',
        nombre: ganado.nombre || '',
        raza_id: ganado.raza_id ? String(ganado.raza_id) : '',
        fecha_nacimiento: ganado.fecha_nacimiento ? new Date(`${ganado.fecha_nacimiento}T00:00:00`) : new Date(),
        genero: ganado.genero || 'macho',
        estado: ganado.estado || 'activo',
        fundo_id: fundo.id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        transform((form) => ({
            ...form,
            fecha_nacimiento: form.fecha_nacimiento.toISOString().split('T')[0],
        }));

        put(
            route('ganados.update', {
                ganado: ganado.id,
                fundo: fundo.id,
            }),
            {
                onSuccess: () => {
                    toast.success('Ganado editado exitosamente');
                    reset();
                    setOpenDialog(false);
                    setOpen(false);
                },
                onError: (errors) => console.error(errors),
            },
        );
    };

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                <Button variant={'outline'}>
                    <Edit />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Editar Ganado
                        <span className="text-sm text-muted-foreground"> {ganado.codigo}</span>
                    </DialogTitle>
                    <DialogDescription>
                        Modifique los detalles del ganado seleccionado. Asegúrese de que la información sea precisa antes de guardar los cambios.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="codigo">Codigo</Label>
                            <Input
                                required
                                id="codigo"
                                type="text"
                                placeholder="Ingrese codigo..."
                                value={data.codigo}
                                onChange={(e) => setData('codigo', e.target.value)}
                            />
                            <InputError message={errors.codigo} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                                required
                                id="nombre"
                                type="text"
                                placeholder="Ingrese nombre..."
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                            />
                            <InputError message={errors.nombre} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="raza">Raza</Label>
                            <div className="flex items-center gap-1">
                                <Select
                                    defaultValue={data.raza_id ? String(data.raza_id) : ''}
                                    required
                                    onValueChange={(value) => setData('raza_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent id="raza">
                                        {razas.map((raza) => (
                                            <SelectItem key={raza.id} value={String(raza.id)}>
                                                {raza.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <RazaDialogCreate />
                            </div>
                            <InputError message={errors.raza_id} className="text-xs" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="date" className="px-1">
                                Fecha de Nacimiento
                            </Label>
                            <Popover open={open} onOpenChange={setOpen} modal={true}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" id="date" className="justify-between font-normal">
                                        {data.fecha_nacimiento ? data.fecha_nacimiento.toLocaleDateString() : 'Seleccionar fecha'}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={data.fecha_nacimiento}
                                        onSelect={(date) => {
                                            setData('fecha_nacimiento', date ? new Date(date) : new Date());
                                            setOpen(false);
                                        }}
                                        disabled={(date) => date > new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="genero">Genero</Label>
                            <Select
                                defaultValue={data.genero || 'macho'}
                                required
                                onValueChange={(value) => setData('genero', value.toLocaleLowerCase() as 'macho' | 'hembra')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent id="genero">
                                    <SelectItem value="macho">Macho</SelectItem>
                                    <SelectItem value="hembra">Hembra</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.raza_id} className="text-xs" />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="estado">Estado</Label>

                            <Select
                                defaultValue={data.estado || 'activo'}
                                required
                                onValueChange={(value) => setData('estado', value as 'activo' | 'produccion' | 'vendido' | 'muerto')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                                <SelectContent id="estado">
                                    <SelectItem value="activo">Activo</SelectItem>
                                    <SelectItem value="produccion">Producción</SelectItem>
                                    <SelectItem value="vendido">Vendido</SelectItem>
                                    <SelectItem value="muerto">Muerto</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.estado} className="text-xs" />
                        </div>
                    </div>
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Actualizando...' : 'Actualizar Ganado'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
