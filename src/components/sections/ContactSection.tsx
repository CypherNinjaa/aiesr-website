"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { useAnnouncement, LiveRegion } from "@/components/accessibility";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FormField, Input, Textarea, Select } from "@/components/ui/FormComponents";
import { LoadingSpinner } from "@/components/ui/Loading";
import { useContactFormMutation } from "@/hooks/useFormMutations";
import { PROGRAM_OPTIONS, SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/lib/constants";
import { contactFormSchema, ContactFormData } from "@/lib/validations";

export const ContactSection: React.FC = () => {
  const contactMutation = useContactFormMutation();
  const { message: announcementMessage, announce } = useAnnouncement();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      program: "",
      message: "",
    },
  });
  const onSubmit = async (data: ContactFormData) => {
    try {
      await contactMutation.mutateAsync(data);
      // Show success message
      announce(SUCCESS_MESSAGES.formSubmitted);
      reset(); // Reset form after successful submission
    } catch {
      // Error handling is done in the mutation hook
      announce(ERROR_MESSAGES.generic);
    }
  };

  const programOptions = [{ value: "", label: "Select a program" }, ...PROGRAM_OPTIONS];

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Us",
      details: ["admissions@aiesr.amity.edu", "info@aiesr.amity.edu"],
      action: "Send Email",
    },
    {
      icon: "📞",
      title: "Call Us",
      details: ["+91 612 2346789", "+91 612 2346790"],
      action: "Call Now",
    },
    {
      icon: "📍",
      title: "Visit Us",
      details: ["Amity University Campus", "Patna, Bihar 800014"],
      action: "Get Directions",
    },
    {
      icon: "💬",
      title: "Live Chat",
      details: ["Available 9 AM - 6 PM", "Monday to Saturday"],
      action: "Start Chat",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-primary text-burgundy mb-6 text-4xl font-bold md:text-5xl">
            Get in Touch
          </h2>
          <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>{" "}
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            Have questions about our programs? We&apos;re here to help you start your journey in
            English Studies and Research. Reach out to us today!
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-burgundy font-primary text-2xl">
                  Send us a Message
                </CardTitle>{" "}
                <p className="text-gray-600">
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </p>{" "}
              </CardHeader>
              <CardContent>
                <LiveRegion message={announcementMessage} />
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  aria-label="Contact form"
                  noValidate
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Full Name" error={errors.name?.message} required>
                      <Input
                        {...register("name")}
                        error={!!errors.name}
                        placeholder="Enter your full name"
                      />
                    </FormField>

                    <FormField label="Email Address" error={errors.email?.message} required>
                      <Input
                        type="email"
                        {...register("email")}
                        error={!!errors.email}
                        placeholder="Enter your email"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField label="Phone Number" error={errors.phone?.message}>
                      <Input
                        type="tel"
                        {...register("phone")}
                        error={!!errors.phone}
                        placeholder="Enter your phone number"
                      />
                    </FormField>

                    <FormField label="Program of Interest" error={errors.program?.message}>
                      <Select
                        {...register("program")}
                        error={!!errors.program}
                        options={programOptions.slice(1)} // Remove the first placeholder option
                        placeholder="Select a program"
                      />
                    </FormField>
                  </div>

                  <FormField label="Message" error={errors.message?.message} required>
                    <Textarea
                      {...register("message")}
                      error={!!errors.message}
                      rows={5}
                      placeholder="Tell us about your questions or interests..."
                    />
                  </FormField>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || contactMutation.isPending}
                  >
                    {isSubmitting || contactMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="sm" />
                        Sending Message...
                      </div>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-0 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 text-4xl">{item.icon}</div>
                      <h3 className="text-burgundy mb-3 font-semibold">{item.title}</h3>
                      <div className="mb-4 space-y-1">
                        {item.details.map((detail, idx) => (
                          <p key={idx} className="text-sm text-gray-600">
                            {detail}
                          </p>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        {item.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="from-burgundy to-gold relative h-64 bg-gradient-to-br">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="mb-4 text-4xl">🗺️</div>
                    <h3 className="mb-2 text-xl font-semibold">Campus Location</h3>
                    <p className="text-sm opacity-90">Interactive map coming soon</p>
                    <Button
                      variant="outline"
                      className="hover:text-burgundy mt-4 border-white text-white hover:bg-white"
                      size="sm"
                    >
                      View on Google Maps
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Info */}
            <Card className="bg-burgundy border-0 text-white">
              <CardContent className="p-6">
                <h3 className="font-primary mb-4 text-xl font-semibold">Office Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
                <div className="mt-6 border-t border-white/20 pt-4">
                  <p className="text-sm text-gray-200">
                    For urgent inquiries outside office hours, please email us at
                    <span className="text-gold"> urgent@aiesr.amity.edu</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
