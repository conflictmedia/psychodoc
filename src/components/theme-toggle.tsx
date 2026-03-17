'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const currentTheme = resolvedTheme || theme

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
      suppressHydrationWarning
    >
      <Sun className="h-5 w-5 hidden dark:block" />
      <Moon className="h-5 w-5 block dark:hidden" />
    </Button>
  )
}
