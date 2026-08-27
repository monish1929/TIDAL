import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white",
        secondary: "border-border bg-gray-100 text-dark-text",
        outline: "border-border text-dark-muted",
        safe: "bg-emerald-50 text-emerald-700 border-emerald-200",
        caution: "bg-amber-50 text-amber-700 border-amber-200",
        hazard: "bg-rose-50 text-rose-700 border-rose-200",
        ai: "bg-indigo-50 text-indigo-700 border-indigo-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
