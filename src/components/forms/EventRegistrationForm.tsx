"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormComponents";
import { LoadingSpinner } from "@/components/ui/Loading";
import { PROGRAM_OPTIONS } from "@/lib/constants";

const eventRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  program: z.string().min(1, "Please select your program"),
  year: z.string().min(1, "Please select your year of study"),
  dietaryRequirements: z.string().optional(),
  specialAccommodations: z.string().optional(),
  emergencyContact: z.string().min(10, "Please enter emergency contact number"),
  emergencyContactName: z.string().min(2, "Please enter emergency contact name"),
});

type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  onSubmit: (data: EventRegistrationData) => Promise<void>;
  isLoading?: boolean;
}

export const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  eventId: _eventId,
  eventTitle,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EventRegistrationData>({
    resolver: zodResolver(eventRegistrationSchema),
    mode: "onChange",
  });

  const handleFormSubmit = async (data: EventRegistrationData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const yearOptions = [
    { value: "", label: "Select year of study" },
    { value: "1st-year", label: "1st Year" },
    { value: "2nd-year", label: "2nd Year" },
    { value: "3rd-year", label: "3rd Year" },
    { value: "masters-1st", label: "Masters 1st Year" },
    { value: "masters-2nd", label: "Masters 2nd Year" },
    { value: "phd", label: "Ph.D." },
    { value: "faculty", label: "Faculty" },
    { value: "external", label: "External Participant" },
  ];

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-burgundy">Register for Event</CardTitle>
        <p className="text-gray-600">{eventTitle}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>

            <FormField label="Full Name" error={errors.name?.message} required>
              <Input
                {...register("name")}
                error={!!errors.name}
                placeholder="Enter your full name"
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Email Address" error={errors.email?.message} required>
                <Input
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  placeholder="Enter your email"
                />
              </FormField>

              <FormField label="Phone Number" error={errors.phone?.message} required>
                <Input
                  type="tel"
                  {...register("phone")}
                  error={!!errors.phone}
                  placeholder="Enter your phone number"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Program/Department" error={errors.program?.message} required>
                <Select
                  {...register("program")}
                  error={!!errors.program}
                  options={PROGRAM_OPTIONS}
                  placeholder="Select your program"
                />
              </FormField>

              <FormField label="Year of Study" error={errors.year?.message} required>
                <Select
                  {...register("year")}
                  error={!!errors.year}
                  options={yearOptions}
                  placeholder="Select year"
                />
              </FormField>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Emergency Contact</h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                label="Emergency Contact Name"
                error={errors.emergencyContactName?.message}
                required
              >
                <Input
                  {...register("emergencyContactName")}
                  error={!!errors.emergencyContactName}
                  placeholder="Emergency contact name"
                />
              </FormField>

              <FormField
                label="Emergency Contact Number"
                error={errors.emergencyContact?.message}
                required
              >
                <Input
                  type="tel"
                  {...register("emergencyContact")}
                  error={!!errors.emergencyContact}
                  placeholder="Emergency contact number"
                />
              </FormField>
            </div>
          </div>

          {/* Special Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Special Requirements (Optional)</h3>

            <FormField label="Dietary Requirements" error={errors.dietaryRequirements?.message}>
              <Textarea
                {...register("dietaryRequirements")}
                error={!!errors.dietaryRequirements}
                rows={2}
                placeholder="Any dietary restrictions or preferences..."
              />
            </FormField>

            <FormField label="Special Accommodations" error={errors.specialAccommodations?.message}>
              <Textarea
                {...register("specialAccommodations")}
                error={!!errors.specialAccommodations}
                rows={2}
                placeholder="Any accessibility needs or special accommodations..."
              />
            </FormField>
          </div>

          <div className="border-t pt-4">
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || isLoading}>
              {isSubmitting || isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Registering...
                </div>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              * By registering, you agree to our terms and conditions. You will receive a
              confirmation email upon successful registration.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
