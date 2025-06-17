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
import {
  useContactEmail,
  useAdmissionsEmail,
  useContactPhones,
  useContactAddress,
  useSupportHours,
} from "@/contexts/PublicSettingsContext";
import { useContactFormMutation } from "@/hooks/useFormMutations";
import { PROGRAM_OPTIONS, SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/lib/constants";
import { contactFormSchema, ContactFormData } from "@/lib/validations";

export const ContactSection: React.FC = () => {
  const contactMutation = useContactFormMutation();
  const { message: announcementMessage, announce } = useAnnouncement();
  // Get dynamic contact information from settings
  const contactEmailFromSettings = useContactEmail();
  const admissionsEmail = useAdmissionsEmail();
  const contactPhones = useContactPhones();
  const contactAddress = useContactAddress();
  const supportHours = useSupportHours();
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

  // Handler functions for contact actions
  const handleContactAction = (actionType: string, details: string[]) => {
    switch (actionType) {
      case "Send Email":
        // Open email client with multiple recipients
        const emailAddresses = details.filter(email => email.includes("@")).join(",");
        window.open(`mailto:${emailAddresses}`, "_blank");
        break;

      case "Call Now":
        // Open phone dialer with the first phone number
        const phoneNumber = details[0]?.replace(/\s+/g, "");
        window.open(`tel:${phoneNumber}`, "_blank");
        break;

      case "Get Directions":
        // Open Google Maps with the address
        const address = details.join(", ");
        const encodedAddress = encodeURIComponent(address);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
        break;

      case "Start Chat":
        // You can replace this with your actual chat system
        // For now, it opens WhatsApp or a contact form
        window.open(`https://wa.me/+91${contactPhones[0]?.replace(/\D/g, "")}`, "_blank");
        break;

      default:
        console.log("Unknown action:", actionType);
    }
  };

  const contactInfo = [
    {
      icon: "📧",
      title: "Email Us",
      details: [admissionsEmail, contactEmailFromSettings],
      action: "Send Email",
    },
    {
      icon: "📞",
      title: "Call Us",
      details: contactPhones,
      action: "Call Now",
    },
    {
      icon: "📍",
      title: "Visit Us",
      details: [contactAddress.line1, `${contactAddress.line2}, ${contactAddress.zipCode}`],
      action: "Get Directions",
    },
    {
      icon: "💬",
      title: "Live Chat",
      details: ["Available " + supportHours],
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
                      </div>{" "}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => handleContactAction(item.action, item.details)}
                      >
                        {item.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>{" "}
            {/* Interactive Map */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1646.2208816060772!2d85.05315423195918!3d25.612297587570414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed56457e773c5d%3A0x26f4637f762e3747!2sAmity%20University%2C%20Patna!5e1!3m2!1sen!2sin!4v1749872426543!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  className="border-0"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Amity University Patna Campus Location"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
