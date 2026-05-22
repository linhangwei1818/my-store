import { cn } from "@/lib/utils";
import { SelectHTMLAttributes, forwardRef } from "react";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-lg border border-(--border) bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary) focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";
