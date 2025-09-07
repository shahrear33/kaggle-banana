"use client";

import { TooltipProvider as ShadcnTooltipProvider } from "../ui/components/tooltip";

export function TooltipProvider({ children }) {
  return <ShadcnTooltipProvider>{children}</ShadcnTooltipProvider>;
}
