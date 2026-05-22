import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-(--border) bg-white px-3 py-2 text-sm placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--primary) focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";
