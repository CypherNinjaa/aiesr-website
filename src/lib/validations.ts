import { z } from "zod";

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),

  phone: z
    .string()
    .optional()
    .refine(val => {
      if (!val) return true; // Optional field
      // Indian phone number validation
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      return phoneRegex.test(val.replace(/\s+/g, ""));
    }, "Please enter a valid phone number"),

  program: z.string().optional(),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must not exceed 1000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must not exceed 100 characters"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .optional(),
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

// Application form schema (for admissions)
export const applicationFormSchema = z.object({
  // Personal Information
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must not exceed 30 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must not exceed 30 characters"),

  email: z.string().email("Please enter a valid email address"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian phone number"),

  dateOfBirth: z.string().refine(date => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 16 && age <= 100;
  }, "You must be between 16 and 100 years old"),

  // Academic Information
  program: z.string().min(1, "Please select a program"),

  previousEducation: z.string().min(1, "Please select your highest qualification"),

  institution: z
    .string()
    .min(2, "Institution name must be at least 2 characters")
    .max(100, "Institution name must not exceed 100 characters"),

  percentage: z
    .number()
    .min(0, "Percentage must be between 0 and 100")
    .max(100, "Percentage must be between 0 and 100"),

  // Address
  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must not exceed 200 characters"),

  city: z
    .string()
    .min(2, "City name must be at least 2 characters")
    .max(50, "City name must not exceed 50 characters"),

  state: z
    .string()
    .min(2, "State name must be at least 2 characters")
    .max(50, "State name must not exceed 50 characters"),

  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Please enter a valid 6-digit pincode"),

  // Additional Information
  statement: z
    .string()
    .min(100, "Statement of purpose must be at least 100 characters")
    .max(2000, "Statement of purpose must not exceed 2000 characters"),

  agreeTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
});

export type ApplicationFormData = z.infer<typeof applicationFormSchema>;

// Search form schema
export const searchFormSchema = z.object({
  query: z
    .string()
    .min(1, "Search query cannot be empty")
    .max(100, "Search query must not exceed 100 characters"),

  category: z.enum(["all", "programs", "faculty", "news", "events"]).default("all"),
});

export type SearchFormData = z.infer<typeof searchFormSchema>;
