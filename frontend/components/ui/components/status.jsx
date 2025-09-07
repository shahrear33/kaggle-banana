import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const dotStatusVariants = cva("rounded-full p-1", {
  variants: {
    variant: {
      primary: "bg-primary-light",
      success: "bg-green-light",
      warning: "bg-orange-light",
      danger: "bg-red-light",
      disabled: "bg-mid-1",
    },
    size: {
      sm: "w-[14px] h-[14px]",
      md: "w-[18px] h-[18px]",
      lg: "w-[22px] h-[22px]",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "sm",
  },
});

function Dot({ variant = "primary", size, className }) {
  const resolvedVariant = variant || "primary";

  const centerColor = {
    primary: "bg-primary",
    success: "bg-[#28A745]",
    warning: "bg-[#FFA500]",
    danger: "bg-[#FF0000]",
    disabled: "bg-[#E0E0E0]",
  };

  return (
    <div
      className={cn(
        dotStatusVariants({
          size,
          variant,
          className,
        })
      )}
    >
      <div
        className={cn([
          "rounded-full w-full h-full",
          centerColor[resolvedVariant],
        ])}
      />
    </div>
  );
}

export { Dot, dotStatusVariants };
