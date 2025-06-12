import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  className,
  children,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  registration?: UseFormRegisterReturn;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, registration, className, ...props }, ref) => {
    return (
      <input
        {...registration}
        {...props}
        ref={ref}
        className={cn(
          "focus:ring-gold w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:outline-none",
          error ? "border-red-300 focus:ring-red-500" : "border-gray-300 hover:border-gray-400",
          className
        )}
      />
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  registration?: UseFormRegisterReturn;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, registration, className, ...props }, ref) => {
    return (
      <textarea
        {...registration}
        {...props}
        ref={ref}
        className={cn(
          "focus:ring-gold w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:outline-none",
          error ? "border-red-300 focus:ring-red-500" : "border-gray-300 hover:border-gray-400",
          className
        )}
      />
    );
  }
);

Textarea.displayName = "Textarea";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  registration?: UseFormRegisterReturn;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, registration, options, placeholder, className, ...props }, ref) => {
    return (
      <select
        {...registration}
        {...props}
        ref={ref}
        className={cn(
          "focus:ring-gold w-full rounded-lg border px-4 py-3 transition-colors focus:border-transparent focus:ring-2 focus:outline-none",
          error ? "border-red-300 focus:ring-red-500" : "border-gray-300 hover:border-gray-400",
          className
        )}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = "Select";
