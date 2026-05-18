import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatSalary(salary: string | number) {
  if (!salary) return 'Kelishilgan';
  if (typeof salary === 'number') {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS' }).format(salary);
  }
  return salary;
}
