import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "default" | "primary" | "outline" | "ghost" | "destructive";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  default:
    "bg-(--muted) text-(--foreground) hover:bg-(--border) border border-(--border)",
  primary:
    "bg-(--primary) text-(--primary-foreground) hover:opacity-90",
  outline:
    "border border-(--border) bg-transparent hover:bg-(--muted) text-(--foreground)",
  ghost:
    "bg-transparent hover:bg-(--muted) text-(--foreground)",
  destructive:
    "bg-(--destructive) text-(--destructive-foreground) hover:opacity-90",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-(--primary) focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
