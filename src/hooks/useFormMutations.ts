import { useMutation } from "@tanstack/react-query";
import { ContactFormData, NewsletterData, ApplicationFormData } from "@/lib/validations";

// API functions (replace with actual API endpoints)
const submitContactForm = async (
  data: ContactFormData
): Promise<{ success: boolean; message: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real app, this would be an actual API call
  console.log("Contact form submitted:", data);

  // Simulate success response
  return {
    success: true,
    message: "Thank you for your inquiry! We will get back to you within 24 hours.",
  };
};

const submitNewsletterSubscription = async (
  data: NewsletterData
): Promise<{ success: boolean; message: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));

  console.log("Newsletter subscription:", data);

  return {
    success: true,
    message: "Successfully subscribed to our newsletter!",
  };
};

const submitApplication = async (
  data: ApplicationFormData
): Promise<{ success: boolean; message: string; applicationId?: string }> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log("Application submitted:", data);

  return {
    success: true,
    message: "Your application has been submitted successfully!",
    applicationId: `APP-${Date.now()}`,
  };
};

// Custom hooks for form submissions
export const useContactFormMutation = () => {
  return useMutation({
    mutationFn: submitContactForm,
    onSuccess: data => {
      console.log("Contact form success:", data);
    },
    onError: error => {
      console.error("Contact form error:", error);
    },
  });
};

export const useNewsletterMutation = () => {
  return useMutation({
    mutationFn: submitNewsletterSubscription,
    onSuccess: data => {
      console.log("Newsletter subscription success:", data);
    },
    onError: error => {
      console.error("Newsletter subscription error:", error);
    },
  });
};

export const useApplicationMutation = () => {
  return useMutation({
    mutationFn: submitApplication,
    onSuccess: data => {
      console.log("Application success:", data);
    },
    onError: error => {
      console.error("Application error:", error);
    },
  });
};
