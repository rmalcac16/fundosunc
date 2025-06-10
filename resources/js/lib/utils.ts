import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | undefined | null): string {
    if (!date) return '';
    const parsedDate = new Date(typeof date === 'string' ? `${date}T00:00:00` : date);

    return parsedDate.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}
