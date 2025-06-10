import { GanadoData } from './ganado';

export interface FundoData {
    id: number;
    nombre: string;
    slug: string;
    descripcion: string | null;
    imagen: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    ganados: GanadoData[] | null;
}
