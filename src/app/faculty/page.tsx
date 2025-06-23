"use client";

import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Mail,
  MapPin,
  ExternalLink,
  BookOpen,
  Award,
  Users,
  Clock,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useActiveFaculty } from "@/hooks/useFaculty";
import { getPublicPhotoUrl } from "@/services/faculty";
import { Faculty } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function FacultyPage() {
  const { data: faculty = [], isLoading, error } = useActiveFaculty();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter faculty based on search and specialization
  const filteredFaculty = faculty.filter(member => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialization =
      !selectedSpecialization || member.specialization.includes(selectedSpecialization);

    return matchesSearch && matchesSpecialization;
  });

  // Get all unique specializations for filter
  const allSpecializations = [...new Set(faculty.flatMap(member => member.specialization))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="from-burgundy to-burgundy/90 bg-gradient-to-r py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-white/90">Loading our distinguished faculty...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="from-burgundy to-burgundy/90 bg-gradient-to-r py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-primary mb-6 text-5xl font-bold">Our Faculty</h1>
            <p className="text-red-200">Failed to load faculty members. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="from-burgundy to-burgundy/90 bg-gradient-to-r py-20 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-primary mb-6 text-5xl font-bold md:text-6xl">
              Our Distinguished Faculty
            </h1>
            <div className="bg-gold mx-auto mb-6 h-1 w-32 rounded-full"></div>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/90">
              Meet our world-class educators, researchers, and mentors who are shaping the future of
              literature and academia.
            </p>

            {/* Stats */}
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="text-gold text-3xl font-bold">{faculty.length}</div>
                <div className="text-white/80">Faculty Members</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-3xl font-bold">
                  {faculty.reduce((sum, f) => sum + f.experience, 0)}+
                </div>
                <div className="text-white/80">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-3xl font-bold">
                  {faculty.reduce((sum, f) => sum + f.publications.length, 0)}
                </div>
                <div className="text-white/80">Publications</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-3xl font-bold">{allSpecializations.length}</div>
                <div className="text-white/80">Specializations</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="sticky top-0 z-10 border-b bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search faculty by name, designation, or specialization..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="focus:ring-burgundy w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2"
              />
            </div>{" "}
            {/* Specialization Filter */}
            <div className="relative">
              <Filter className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <select
                value={selectedSpecialization}
                onChange={e => setSelectedSpecialization(e.target.value)}
                className="focus:ring-burgundy min-w-[200px] appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-8 pl-10 focus:border-transparent focus:ring-2"
                title="Filter by specialization"
              >
                <option value="">All Specializations</option>
                {allSpecializations.map(spec => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
            {/* View Mode Toggle */}
            <div className="flex overflow-hidden rounded-lg border">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === "grid"
                    ? "bg-burgundy text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 text-sm font-medium ${
                  viewMode === "list"
                    ? "bg-burgundy text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredFaculty.length} of {faculty.length} faculty members
          </div>
        </div>
      </div>

      {/* Faculty Grid/List */}
      <div className="container mx-auto px-4 py-12">
        {filteredFaculty.length === 0 ? (
          <div className="py-12 text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-medium text-gray-900">No faculty found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-6"
            }
          >
            {filteredFaculty.map(member => (
              <FacultyCard
                key={member.id}
                member={member}
                viewMode={viewMode}
                cardVariants={cardVariants}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Faculty Card Component
interface FacultyCardProps {
  member: Faculty;
  viewMode: "grid" | "list";
  cardVariants: {
    hidden: {
      opacity: number;
      y: number;
      scale: number;
    };
    visible: {
      opacity: number;
      y: number;
      scale: number;
      transition: {
        duration: number;
        ease: string;
      };
    };
  };
}

function FacultyCard({ member, viewMode, cardVariants }: FacultyCardProps) {
  if (viewMode === "list") {
    return (
      <motion.div variants={cardVariants}>
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              {/* Photo */}
              <div className="from-burgundy to-gold relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br">
                {member.profile_image_url ? (
                  <Image
                    src={getPublicPhotoUrl(member.profile_image_url)}
                    alt={`${member.name} - Faculty Photo`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {member.name
                        .split(" ")
                        .map(n => n[0])
                        .join("")}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-primary text-xl font-bold text-gray-900">{member.name}</h3>
                    <p className="text-burgundy font-medium">{member.designation}</p>
                    <p className="mt-1 text-gray-600">
                      <Clock className="mr-1 inline h-4 w-4" />
                      {member.experience}+ years experience
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {member.publications.length} publications
                    </div>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {member.specialization.slice(0, 4).map((spec, idx) => (
                    <span
                      key={idx}
                      className="bg-burgundy/10 text-burgundy rounded-full px-2 py-1 text-xs"
                    >
                      {spec}
                    </span>
                  ))}
                  {member.specialization.length > 4 && (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                      +{member.specialization.length - 4} more
                    </span>
                  )}
                </div>

                {/* Contact */}
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="mr-1 h-4 w-4" />
                    {member.email}
                  </div>
                  {member.office_location && (
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-4 w-4" />
                      {member.office_location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div variants={cardVariants}>
      <Card className="group h-full overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-xl">
        {/* Faculty Photo */}
        <div className="from-burgundy to-gold relative h-64 overflow-hidden bg-gradient-to-br">
          {member.profile_image_url ? (
            <Image
              src={getPublicPhotoUrl(member.profile_image_url)}
              alt={`${member.name} - Faculty Photo`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="from-burgundy to-gold absolute inset-0 bg-gradient-to-br"></div>
          )}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute right-4 bottom-4 left-4">
            <div className="text-white">
              <h3 className="font-primary mb-1 text-lg font-bold">{member.name}</h3>
              <p className="text-sm opacity-90">{member.designation}</p>
            </div>
          </div>
          {/* Experience Badge */}
          <div className="absolute top-4 right-4">
            <div className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
              <span className="text-sm font-medium text-white">{member.experience}+ years</span>
            </div>
          </div>
        </div>

        {/* Faculty Details */}
        <CardContent className="p-6">
          {/* Specialization */}
          <div className="mb-4">
            <h4 className="mb-2 flex items-center text-sm font-semibold text-gray-800">
              <BookOpen className="mr-1 h-4 w-4" />
              Specializations
            </h4>
            <div className="flex flex-wrap gap-1">
              {member.specialization.slice(0, 2).map((spec, idx) => (
                <span
                  key={idx}
                  className="bg-burgundy/10 text-burgundy rounded-full px-2 py-1 text-xs"
                >
                  {spec}
                </span>
              ))}
              {member.specialization.length > 2 && (
                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                  +{member.specialization.length - 2} more
                </span>
              )}
            </div>
          </div>

          {/* Publications */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Award className="mr-1 h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-600">Publications</span>
              </div>
              <span className="text-gold font-semibold">{member.publications.length}</span>
            </div>
          </div>

          {/* Research Areas Preview */}
          {member.research_areas && member.research_areas.length > 0 && (
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-semibold text-gray-800">Research Focus</h4>
              <p className="text-xs text-gray-600">
                {member.research_areas.slice(0, 2).join(", ")}
                {member.research_areas.length > 2 && "..."}
              </p>
            </div>
          )}

          {/* Contact Info */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="mr-2 h-4 w-4" />
              <span className="truncate">{member.email}</span>
            </div>
            {member.office_location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{member.office_location}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="group-hover:bg-burgundy flex-1 transition-colors group-hover:text-white"
            >
              View Profile
            </Button>
            {(member.linkedin_url || member.google_scholar_url || member.personal_website) && (
              <Button variant="ghost" size="sm" className="px-3">
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
