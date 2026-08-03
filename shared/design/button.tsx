import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

const designButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-button text-sm font-medium transition-colors duration-[120ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:   "bg-text text-canvas hover:bg-text/90",
        accent:    "bg-primary text-primary-on hover:bg-primary-hover",
        secondary: "bg-surface border border-border-strong text-text hover:bg-surface-2",
        ghost:     "text-text-2 hover:bg-surface-2 hover:text-text",
      },
      size: {
        sm:      "h-7 px-3 text-xs",
        default: "h-8 px-4",
        lg:      "h-10 px-6 text-md",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  },
);

type DesignButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof designButtonVariants> & {
    asChild?: boolean;
    kbd?: string;
  };

export function DesignButton({
  variant,
  size,
  asChild = false,
  kbd,
  className,
  children,
  ...props
}: DesignButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(designButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {kbd ? (
        <span className="ml-1 font-mono text-xs opacity-60">{kbd}</span>
      ) : null}
    </Comp>
  );
}
