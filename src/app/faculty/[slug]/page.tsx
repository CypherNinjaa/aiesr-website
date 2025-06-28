// ============================================
// FACULTY PROFILE PAGE - Individual faculty member profile
// ============================================

"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  BookOpen,
  Award,
  GraduationCap,
  User,
  Calendar,
  Globe,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useActiveFaculty } from "@/hooks/useFaculty";
import { getPublicPhotoUrl } from "@/services/faculty";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function FacultyProfilePage() {
  const params = useParams();
  const { data: faculty = [], isLoading, error } = useActiveFaculty();

  const slug = params.slug as string;

  // Find faculty member by slug (name converted to URL-friendly format)
  const facultyMember = faculty.find(
    member =>
      member.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") === slug
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="border-b bg-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-burgundy/20 h-8 w-8 animate-pulse rounded"></div>
              <div className="bg-burgundy/20 h-6 w-32 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="bg-burgundy/10 h-64 w-full animate-pulse rounded-lg"></div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="space-y-4">
                <div className="bg-burgundy/10 h-32 w-full animate-pulse rounded"></div>
                <div className="bg-burgundy/10 h-24 w-full animate-pulse rounded"></div>
              </div>
              <div className="space-y-4 lg:col-span-2">
                <div className="bg-burgundy/10 h-20 w-full animate-pulse rounded"></div>
                <div className="bg-burgundy/10 h-32 w-full animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !facultyMember) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="bg-burgundy/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <User className="text-burgundy h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Faculty Member Not Found</h1>
          <p className="mb-6 text-gray-600">
            The faculty member you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/faculty">
            <Button className="bg-burgundy hover:bg-burgundy/90 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Faculty
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const profileImageUrl = facultyMember.profile_image_url
    ? getPublicPhotoUrl(facultyMember.profile_image_url)
    : null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-gray-50 pt-20"
    >
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link
              href="/faculty"
              className="text-burgundy hover:text-burgundy/80 inline-flex items-center gap-2 font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Faculty
            </Link>
          </div>

          {/* Hero Section */}
          <motion.div
            variants={sectionVariants}
            className="from-burgundy to-burgundy/90 mb-8 rounded-2xl bg-gradient-to-r p-8 text-white"
          >
            <div className="flex flex-col items-start gap-8 lg:flex-row">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt={facultyMember.name}
                    width={200}
                    height={200}
                    className="rounded-2xl border-4 border-white/20 object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-[200px] w-[200px] items-center justify-center rounded-2xl border-4 border-white/20 bg-white/20">
                    <User className="h-20 w-20 text-white/60" />
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="mb-3 text-4xl font-bold lg:text-5xl">{facultyMember.name}</h1>
                <p className="mb-4 text-xl text-white/90">{facultyMember.designation}</p>

                {/* Experience Badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">{facultyMember.experience}+ years experience</span>
                </div>

                {/* Specializations */}
                <div className="mb-6 flex flex-wrap gap-2">
                  {facultyMember.specialization.map((spec, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div className="text-center lg:text-left">
                    <div className="text-gold text-2xl font-bold">
                      {facultyMember.publications.length}
                    </div>
                    <div className="text-sm text-white/80">Publications</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-gold text-2xl font-bold">
                      {facultyMember.achievements.length}
                    </div>
                    <div className="text-sm text-white/80">Achievements</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-gold text-2xl font-bold">
                      {facultyMember.research_areas.length}
                    </div>
                    <div className="text-sm text-white/80">Research Areas</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-gold text-2xl font-bold">
                      {facultyMember.education.length}
                    </div>
                    <div className="text-sm text-white/80">Degrees</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Sidebar - Contact & Links */}
            <motion.div variants={sectionVariants} className="space-y-6 lg:col-span-1">
              {/* Contact Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-burgundy mb-4 flex items-center text-lg font-semibold">
                    <Mail className="text-burgundy mr-2 h-5 w-5" />
                    Contact Information
                  </h3>

                  <div className="space-y-4">
                    {facultyMember.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <a
                          href={`mailto:${facultyMember.email}`}
                          className="text-sm break-all text-blue-600 hover:underline"
                        >
                          {facultyMember.email}
                        </a>
                      </div>
                    )}

                    {facultyMember.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <a
                          href={`tel:${facultyMember.phone}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {facultyMember.phone}
                        </a>
                      </div>
                    )}

                    {facultyMember.office_location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {facultyMember.office_location}
                        </span>
                      </div>
                    )}

                    {facultyMember.office_hours && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        <span className="text-sm text-gray-700">{facultyMember.office_hours}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Links */}
              {(facultyMember.linkedin_url ||
                facultyMember.google_scholar_url ||
                facultyMember.personal_website ||
                facultyMember.research_gate_url) && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-burgundy mb-4 flex items-center text-lg font-semibold">
                      <Globe className="text-burgundy mr-2 h-5 w-5" />
                      Professional Links
                    </h3>
                    <div className="space-y-3">
                      {facultyMember.linkedin_url && (
                        <a
                          href={facultyMember.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          LinkedIn Profile
                        </a>
                      )}
                      {facultyMember.google_scholar_url && (
                        <a
                          href={facultyMember.google_scholar_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Google Scholar
                        </a>
                      )}
                      {facultyMember.research_gate_url && (
                        <a
                          href={facultyMember.research_gate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          ResearchGate
                        </a>
                      )}
                      {facultyMember.personal_website && (
                        <a
                          href={facultyMember.personal_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Personal Website
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Main Content */}
            <motion.div variants={sectionVariants} className="space-y-8 lg:col-span-2">
              {/* Biography */}
              {facultyMember.bio && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-burgundy mb-4 text-xl font-semibold">About</h3>
                    <p className="leading-relaxed text-gray-700">{facultyMember.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {facultyMember.education.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-burgundy mb-4 flex items-center text-xl font-semibold">
                      <GraduationCap className="text-burgundy mr-2 h-5 w-5" />
                      Education
                    </h3>
                    <ul className="space-y-3">
                      {facultyMember.education.map((edu, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="bg-burgundy mt-2 h-2 w-2 flex-shrink-0 rounded-full"></div>
                          <span className="text-gray-700">{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Research Areas */}
              {facultyMember.research_areas.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-burgundy mb-4 flex items-center text-xl font-semibold">
                      <BookOpen className="text-burgundy mr-2 h-5 w-5" />
                      Research Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {facultyMember.research_areas.map((area, index) => (
                        <span
                          key={index}
                          className="bg-burgundy/10 text-burgundy border-burgundy/20 rounded-lg border px-3 py-2 text-sm font-medium"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Achievements */}
              {facultyMember.achievements.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-burgundy mb-4 flex items-center text-xl font-semibold">
                      <Award className="text-burgundy mr-2 h-5 w-5" />
                      Achievements & Awards
                    </h3>
                    <ul className="space-y-3">
                      {facultyMember.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="bg-gold mt-2 h-2 w-2 flex-shrink-0 rounded-full"></div>
                          <span className="text-gray-700">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Publications */}
              {facultyMember.publications.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-burgundy mb-4 flex items-center text-xl font-semibold">
                      <FileText className="text-burgundy mr-2 h-5 w-5" />
                      Publications ({facultyMember.publications.length})
                    </h3>
                    <div className="space-y-4">
                      {facultyMember.publications.map((pub, index) => (
                        <div
                          key={index}
                          className="border-burgundy/30 bg-burgundy/5 rounded-r-lg border-l-4 py-3 pl-4"
                        >
                          <h4 className="mb-1 font-medium text-gray-900">{pub.title}</h4>
                          <p className="mb-2 text-sm text-gray-600">
                            <span className="font-medium">{pub.journal}</span> • {pub.year}
                          </p>
                          {pub.url && (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-burgundy hover:text-burgundy/80 inline-flex items-center text-xs font-medium hover:underline"
                            >
                              <ExternalLink className="mr-1 h-3 w-3" />
                              View Publication
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
