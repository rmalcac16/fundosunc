export interface GanadoData {
    id: number;
    codigo: string;
    nombre: string;
    fecha_nacimiento: string | null;
    genero: 'macho' | 'hembra';
    estado: 'activo' | 'produccion' | 'vendido' | 'muerto';

    padre_id: number | null;
    madre_id: number | null;

    raza_id: number;
    raza?: {
        id: number;
        nombre: string;
    };

    fundo_id: number;
    fundo?: {
        id: number;
        nombre: string;
    };

    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}
