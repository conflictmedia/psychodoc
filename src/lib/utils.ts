import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDoseAmount(amount: number, unit: string): { amount: string; unit: string } {
  // Handle micrograms (μg) - convert to mg if >= 1000
  if (unit === 'μg' || unit === 'ug' || unit === 'mcg') {
    if (amount >= 1000) {
      const converted = amount / 1000
      // Format to remove unnecessary trailing zeros
      const formatted = converted % 1 === 0 ? converted.toString() : converted.toFixed(2).replace(/\.?0+$/, '')
      return { amount: formatted, unit: 'mg' }
    }
    return { amount: amount.toString(), unit }
  }
  
  // Handle milligrams (mg) - convert to g if >= 1000
  if (unit === 'mg') {
    if (amount >= 1000) {
      const converted = amount / 1000
      // Format to remove unnecessary trailing zeros
      const formatted = converted % 1 === 0 ? converted.toString() : converted.toFixed(2).replace(/\.?0+$/, '')
      return { amount: formatted, unit: 'g' }
    }
    return { amount: amount.toString(), unit }
  }
  
  // For other units (g, ml, tabs, etc.), return as-is
  return { amount: amount.toString(), unit }
}
