import * as React from "react"
import { Label } from "./label"
import { cn } from "@/lib/utils"
import { cva } from "class-variance-authority"

const inputVariantOptions = {
  variants: {
    size: {
      default: 'h-9 px-3 py-2 text-base md:text-sm',
      xs: 'h-7 px-2 py-1 text-xs',
      sm: 'h-8 px-3 py-1 text-sm',
      lg: 'h-10 px-4 py-2 text-lg',
      xl: 'h-12 px-6 py-3 text-xl',
    },
  },
  defaultVariants: {
    size: 'default',
  },
}

const inputVariants = cva(
  "flex w-full border border-main-border bg-transparent shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-main-border focus-visible:border disabled:cursor-not-allowed disabled:opacity-50",
  inputVariantOptions
)

const Input = React.forwardRef(({ className, type, label, id, size, rounded, ...props }, ref) => {
  return (
    <div className="grid w-full gap-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <input
        type={type}
        id={id}
        className={cn(
          inputVariants({ size }),
          rounded ? "rounded-full" : "rounded-md",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
})
Input.displayName = "Input"

export { Input, inputVariants, inputVariantOptions }
