import { cn } from "@/lib/utils";
import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-(--border) bg-white px-3 py-2 text-sm placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--primary) focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
