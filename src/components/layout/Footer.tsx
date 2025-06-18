"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/Button";
import { useContactEmail, useSocialMedia } from "@/contexts/PublicSettingsContext";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const contactEmail = useContactEmail();
  const socialMedia = useSocialMedia();
  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Academic Programs", href: "/programs" },
    { label: "Faculty", href: "/faculty" },
    { label: "Research", href: "/research" },
    { label: "Student Life", href: "/student-life" },
  ];

  const programs = [
    {
      label: "B.A. English Literature",
      href: "/programs/ba-english-literature",
    },
    {
      label: "M.A. English Literature",
      href: "/programs/ma-english-literature",
    },
    { label: "Ph.D. Programs", href: "/programs/doctoral" },
    { label: "Certificate Courses", href: "/programs/certificate" },
  ];

  const resources = [
    { label: "Library", href: "/library" },
    { label: "Research Publications", href: "/research/publications" },
    { label: "Academic Calendar", href: "/academic-calendar" },
    { label: "Career Services", href: "/career-services" },
    { label: "Alumni Network", href: "/alumni" },
    { label: "News & Events", href: "/news" },
  ];
  return (
    <footer
      id="footer"
      className="bg-charcoal relative overflow-hidden text-gray-300"
      role="contentinfo"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="bg-gold absolute top-10 left-10 h-32 w-24 rotate-12 transform rounded"></div>
        <div className="bg-burgundy absolute right-20 bottom-20 h-24 w-20 -rotate-12 transform rounded"></div>
        <div className="text-gold font-script absolute top-1/2 left-1/4 text-6xl">❝</div>
        <div className="text-burgundy absolute right-1/3 bottom-1/4 text-4xl">📚</div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {" "}
            {/* Institute Information */}{" "}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <Image
                  src="/AIESR logo .png"
                  alt="AIESR Logo"
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </div>
              <p className="mb-6 leading-relaxed text-gray-400">
                Nurturing literary excellence and critical thinking through comprehensive programs
                in English Studies, Literature, and Creative Writing since our establishment.
              </p>
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="text-gold mt-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-gray-300">Amity University Campus</p>
                    <p className="text-sm text-gray-400">Patna, Bihar, India</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="text-gold h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <p className="text-sm text-gray-300">+91 612 2346789</p>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="text-gold h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <p className="text-sm text-gray-300">{contactEmail}</p>
                </div>
              </div>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="mb-6 text-lg font-semibold text-white">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-gold text-sm text-gray-400 transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Academic Programs */}
            <div>
              <h4 className="mb-6 text-lg font-semibold text-white">Programs</h4>
              <ul className="space-y-3">
                {programs.map(program => (
                  <li key={program.href}>
                    <Link
                      href={program.href}
                      className="hover:text-gold text-sm text-gray-400 transition-colors duration-200"
                    >
                      {program.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Resources & Newsletter */}
            <div>
              <h4 className="mb-6 text-lg font-semibold text-white">Resources</h4>
              <ul className="mb-8 space-y-3">
                {resources.slice(0, 4).map(resource => (
                  <li key={resource.href}>
                    <Link
                      href={resource.href}
                      className="hover:text-gold text-sm text-gray-400 transition-colors duration-200"
                    >
                      {resource.label}
                    </Link>
                  </li>
                ))}
              </ul>{" "}
              {/* Newsletter Signup */}
              <div className="rounded-lg bg-gray-800 p-4">
                <h5 className="mb-3 text-sm font-semibold text-white">Stay Updated</h5>
                <p className="mb-4 text-xs text-gray-400">
                  Get the latest news, events, and academic updates.
                </p>
                <form className="flex flex-col space-y-2" aria-label="Newsletter subscription">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address for newsletter
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter your email"
                    className="focus:ring-gold rounded bg-gray-700 px-3 py-2 text-sm text-white focus:ring-2 focus:outline-none"
                    required
                    aria-describedby="newsletter-description"
                  />
                  <Button size="sm" className="w-full" type="submit">
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              {" "}
              {/* Social Media Links */}{" "}
              <div className="flex space-x-6" role="list" aria-label="Social media links">
                {" "}
                <a
                  href={socialMedia.twitter || "https://twitter.com/aiesr_official"}
                  className="hover:text-gold text-gray-400 transition-colors"
                  aria-label="Follow us on Twitter"
                  role="listitem"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>{" "}
                <a
                  href={socialMedia.facebook || "https://facebook.com/aiesr.official"}
                  className="hover:text-gold text-gray-400 transition-colors"
                  aria-label="Follow us on Facebook"
                  role="listitem"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>{" "}
                <a
                  href={socialMedia.linkedin || "https://linkedin.com/school/aiesr"}
                  className="hover:text-gold text-gray-400 transition-colors"
                  aria-label="Connect with us on LinkedIn"
                  role="listitem"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>{" "}
                <a
                  href={socialMedia.instagram || "https://instagram.com/aiesr_official"}
                  className="hover:text-gold text-gray-400 transition-colors"
                  aria-label="Follow us on Instagram"
                  role="listitem"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.747 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.99C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
              </div>
              {/* Copyright */}
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-400">
                  © {currentYear} Amity Institute of English Studies and Research. All rights
                  reserved.
                </p>
                <div className="mt-2 flex flex-wrap justify-center space-x-4 md:justify-end">
                  <Link
                    href="/privacy"
                    className="hover:text-gold text-xs text-gray-500 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:text-gold text-xs text-gray-500 transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/accessibility"
                    className="hover:text-gold text-xs text-gray-500 transition-colors"
                  >
                    Accessibility
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Literary Quote */}
        <div className="bg-burgundy py-6">
          {" "}
          <div className="container mx-auto px-4 text-center">
            <blockquote className="text-gold font-script text-lg italic">
              &ldquo;The only way to do great work is to love what you do.&rdquo;
            </blockquote>
            <cite className="mt-2 block text-sm text-gray-300">— Steve Jobs</cite>
          </div>
        </div>
      </div>
    </footer>
  );
};
