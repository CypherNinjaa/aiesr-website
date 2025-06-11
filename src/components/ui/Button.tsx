import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
					"inline-flex items-center justify-center whitespace-nowrap rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cta-button",

					// Variant styles
					{
						"bg-burgundy text-white hover:bg-opacity-90 shadow-lg hover:shadow-xl":
							variant === "default",
						"border-2 border-burgundy text-burgundy bg-transparent hover:bg-burgundy hover:text-white":
							variant === "outline",
						"hover:bg-gray-100 hover:text-gray-900": variant === "ghost",
						"text-burgundy underline-offset-4 hover:underline p-0 h-auto":
							variant === "link",
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
				style={{
					backgroundColor:
						variant === "default" ? "var(--primary-burgundy)" : undefined,
					borderColor:
						variant === "outline" ? "var(--primary-burgundy)" : undefined,
					color: variant === "outline" ? "var(--primary-burgundy)" : undefined,
				}}
				{...props}
			/>
		);
	}
);

Button.displayName = "Button";

export { Button };
