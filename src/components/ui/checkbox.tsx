import * as React from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, ...props }, ref) => (
  <input
    type='checkbox'
    className={cn(
      'h-4 w-4 cursor-pointer rounded border border-zinc-300 accent-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
      className,
    )}
    ref={ref}
    {...props}
  />
))

Checkbox.displayName = 'Checkbox'

export { Checkbox }
