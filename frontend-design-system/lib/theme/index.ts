import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Utility function to combine and merge Tailwind CSS classes cleanly */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
