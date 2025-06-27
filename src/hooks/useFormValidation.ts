import { useNotifications } from "@/contexts/NotificationContext";

export interface ValidationRule {
  field: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  firstError?: string;
}

export const useFormValidation = () => {
  const { showError, showWarning } = useNotifications();

  const validateForm = (
    data: Record<string, unknown>,
    rules: ValidationRule[]
  ): ValidationResult => {
    const errors: Record<string, string> = {};

    for (const rule of rules) {
      const value = data[rule.field];
      const label = rule.label;

      // Required field validation
      if (rule.required && (!value || (typeof value === "string" && value.trim() === ""))) {
        errors[rule.field] = `${label} is required`;
        continue;
      }

      // Skip other validations if field is empty and not required
      if (!value) continue;

      // String validations
      if (typeof value === "string") {
        // Min length validation
        if (rule.minLength && value.length < rule.minLength) {
          errors[rule.field] = `${label} must be at least ${rule.minLength} characters`;
          continue;
        }

        // Max length validation
        if (rule.maxLength && value.length > rule.maxLength) {
          errors[rule.field] = `${label} must be no more than ${rule.maxLength} characters`;
          continue;
        }

        // Pattern validation
        if (rule.pattern && !rule.pattern.test(value)) {
          errors[rule.field] = `${label} format is invalid`;
          continue;
        }
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(value);
        if (customError) {
          errors[rule.field] = customError;
        }
      }
    }

    const isValid = Object.keys(errors).length === 0;
    const firstError = Object.values(errors)[0];

    return {
      isValid,
      errors,
      firstError,
    };
  };

  const validateAndNotify = (data: Record<string, unknown>, rules: ValidationRule[]): boolean => {
    const result = validateForm(data, rules);

    if (!result.isValid) {
      const errorCount = Object.keys(result.errors).length;
      showError(
        "Form Validation Failed",
        `Please fix ${errorCount} error${errorCount > 1 ? "s" : ""}: ${result.firstError}`,
        6000
      );
      return false;
    }

    return true;
  };

  const showValidationWarning = (message: string) => {
    showWarning("Validation Warning", message, 4000);
  };

  return {
    validateForm,
    validateAndNotify,
    showValidationWarning,
  };
};

// Common validation rules
export const commonValidationRules = {
  required: (field: string, label: string): ValidationRule => ({
    field,
    label,
    required: true,
  }),

  email: (field: string, label: string = "Email"): ValidationRule => ({
    field,
    label,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  }),

  url: (field: string, label: string = "URL"): ValidationRule => ({
    field,
    label,
    pattern: /^https?:\/\/.+/,
  }),

  minLength: (field: string, label: string, min: number): ValidationRule => ({
    field,
    label,
    minLength: min,
  }),

  maxLength: (field: string, label: string, max: number): ValidationRule => ({
    field,
    label,
    maxLength: max,
  }),

  date: (field: string, label: string = "Date"): ValidationRule => ({
    field,
    label,
    custom: (value: unknown) => {
      if (value && typeof value === "string" && isNaN(Date.parse(value))) {
        return `${label} must be a valid date`;
      }
      return null;
    },
  }),

  positiveNumber: (field: string, label: string): ValidationRule => ({
    field,
    label,
    custom: (value: unknown) => {
      const num = Number(value);
      if (value && (isNaN(num) || num < 0)) {
        return `${label} must be a positive number`;
      }
      return null;
    },
  }),
};
