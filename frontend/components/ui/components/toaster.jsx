"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/components/toast"
import { Check, X, AlertCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    (<ToastProvider>
      {toasts.map(function ({ id, title, description, variant, ...props }) {
        return (
          (<Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {variant === "destructive" && (
                  <div className="h-8 w-8 rounded-full bg-[#fee2e2] dark:bg-[#ef4444]/10 flex items-center justify-center">
                    <X className="h-5 w-5 text-[#dc2626] dark:text-[#f87171]" />
                  </div>
                )}
                {variant === "success" && (
                  <div className="h-8 w-8 rounded-full bg-[#dcfce7] dark:bg-[#22c55e]/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-[#16a34a] dark:text-[#4ade80]" />
                  </div>
                )}
                {variant === "warning" && (
                  <div className="h-8 w-8 rounded-full bg-[#fef3c7] dark:bg-[#f59e0b]/10 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-[#d97706] dark:text-[#fbbf24]" />
                  </div>
                )}
                {(!variant || variant === "default") && (
                  <div className="h-8 w-8 rounded-full bg-[#e0f2fe] dark:bg-[#3b82f6]/10 flex items-center justify-center">
                    <Info className="h-5 w-5 text-[#2563eb] dark:text-[#60a5fa]" />
                  </div>
                )}
              </div>
              <div className="flex-1 pt-0.5">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            <ToastClose />
          </Toast>)
        );
      })}
      <ToastViewport />
    </ToastProvider>)
  );
}
