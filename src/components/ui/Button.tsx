import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "cta-button inline-flex items-center justify-center rounded-md text-base font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",

          // Variant styles
          {
            "bg-burgundy hover:bg-opacity-90 text-white shadow-lg hover:shadow-xl":
              variant === "default",
            "border-burgundy text-burgundy hover:bg-burgundy border-2 bg-transparent hover:text-white":
              variant === "outline",
            "hover:bg-gray-100 hover:text-gray-900": variant === "ghost",
            "text-burgundy h-auto p-0 underline-offset-4 hover:underline": variant === "link",
          },

          // Size styles
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3 text-sm": size === "sm",
            "h-12 rounded-md px-8 text-lg": size === "lg",
            "h-10 w-10": size === "icon",
          },

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
