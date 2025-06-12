import { useForm, UseFormProps, FieldValues, Path, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

interface UseFormWithSchemaProps<T extends FieldValues> extends Omit<UseFormProps<T>, "resolver"> {
  schema: z.ZodType<T, z.ZodTypeDef, T>;
}

export function useFormWithSchema<T extends FieldValues>({
  schema,
  ...props
}: UseFormWithSchemaProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    mode: "onChange",
    ...props,
  });

  const handleSubmit = (onSubmit: (data: T) => Promise<void> | void) => {
    return form.handleSubmit(async data => {
      try {
        setIsSubmitting(true);
        await onSubmit(data);
      } catch (error) {
        console.error("Form submission error:", error);
        // You can add error handling here
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  return {
    ...form,
    handleSubmit,
    isSubmitting,
  };
}

// Custom hook for field error handling
export function useFieldError<T extends FieldValues>(errors: FieldErrors<T>, name: Path<T>) {
  const error = errors[name];
  return {
    hasError: !!error,
    errorMessage: error?.message as string | undefined,
    errorId: error ? `${name}-error` : undefined,
  };
}
