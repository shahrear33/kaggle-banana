"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon } from "./icon"
import { Spinner } from "./spinner"
import Link from 'next/link';
import { motion } from "framer-motion"

const buttonVariantOptions = {
  variants: {
    variant: {
      // Primary buttons
      primary: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:bg-indigo-700',
      
      // Secondary buttons
      secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700',
      
      // Danger buttons
      danger: 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600',
      
      // Outline buttons
      outline: 'border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white',
      
      // Ghost buttons
      ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-white',
      
      // Icon buttons
      icon: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 !p-2',
      
      // Link buttons
      link: 'text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline !p-0',
      
      // Text buttons
      text: 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white !p-0',
      
      // Success buttons
      success: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600',
      
      // Dark buttons
      dark: 'bg-gray-900 text-white',
      
      // Menu buttons
      menu: 'bg-indigo-600 text-white shadow-lg rounded-full hover:bg-indigo-700',
      
      // Outline secondary buttons
      'outline-secondary': 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:border-indigo-300 hover:bg-indigo-100',
      
      // New variants
      glass: 'backdrop-blur-md bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 text-white hover:bg-white/20 dark:hover:bg-black/30',
      
      gradient: 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-lg hover:shadow-xl transition-shadow',
      
      soft: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
      
      'soft-success': 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
      
      'soft-danger': 'bg-red-50 text-red-700 hover:bg-red-100',
      
      'soft-warning': 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
    },
    size: {
      default: 'h-10 px-4 py-2',
      xs: 'h-6 px-2 py-0.5 text-xs',
      sm: 'h-8 px-3 py-1 text-sm',
      lg: 'h-12 px-6 py-3 text-base',
      xl: 'h-14 px-8 py-4 text-lg',
      '2xl': 'h-16 px-10 py-5 text-xl',
      '3xl': 'h-20 px-12 py-6 text-2xl',
      '4xl': 'h-24 px-14 py-7 text-3xl',
      icon: 'h-10 w-10 p-2',
      'icon-sm': 'h-8 w-8 p-1.5',
      'icon-lg': 'h-12 w-12 p-2.5',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
}

const buttonVariants = cva(
  'inline-flex items-center relative justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50',
  buttonVariantOptions
)

const iconSizeMapper = {
  default: 'default',
  lg: 'md',
  sm: 'sm',
  xs: 'xs',
}

const spinnerSizeMapper = {
  default: 'default',
  lg: 'lg',
  sm: 'sm',
  xs: 'sm',
}

const Button = React.forwardRef(({
  className,
  variant,
  size,
  fullWidth,
  containerClassName,
  rounded = true,
  animate,
  children,
  leftIcon,
  rightIcon,
  isLoading,
  asChild = false,
  to,
  center,
  ...props
}, ref) => {
  
  if (asChild) {
    return <Slot {...props}>{children}</Slot>
  }

  const ButtonComponent = ({ children }) => {
    return (
      <div className={cn(
        "w-full",
        center && "flex justify-center items-center"
      )}>
        {children}
      </div>
    )
  }

  const textSize = size || 'default'

  const Comp = to ? Link : "button";
  
  // Determine if we should use motion
  const useMotion = animate !== false; // Default to true if not explicitly set to false
  
  const ButtonContent = () => (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner size={spinnerSizeMapper[textSize] || 'default'} className="text-current" />
        </div>
      )}
      <div
        className={cn([
          "flex items-center whitespace-nowrap gap-2",
          isLoading ? 'opacity-0' : '',
          center && 'justify-center',
        ])}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </div>
    </>
  );
  
  const buttonClasses = cn([
    className,
    'group',
    buttonVariants({
      variant,
      size,
    }),
    rounded && 'rounded-full',
    isLoading ? 'cursor-wait' : 'cursor-pointer',
    fullWidth && 'w-full',
    center && '!justify-center',
    containerClassName,
  ]);
  
  return (
    <ButtonComponent>
      {useMotion ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={buttonClasses}
          {...(to ? { as: Comp, href: to } : {})}
          {...props}
          ref={ref}
        >
          <ButtonContent />
        </motion.div>
      ) : (
        <Comp
          className={buttonClasses}
          ref={ref}
          {...(to ? { href: to } : {})}
          {...props}
        >
          <ButtonContent />
        </Comp>
      )}
    </ButtonComponent>
  )
})

Button.displayName = "Button"

export { Button, buttonVariants, buttonVariantOptions }
