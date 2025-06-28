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
  FileText
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
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function FacultyProfilePage() {
  const params = useParams();
  const { data: faculty = [], isLoading, error } = useActiveFaculty();
  
  const slug = params.slug as string;
  
  // Find faculty member by slug (name converted to URL-friendly format)
  const facultyMember = faculty.find(member => 
    member.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === slug
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-burgundy/20 rounded animate-pulse"></div>
              <div className="w-32 h-6 bg-burgundy/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="w-full h-64 bg-burgundy/10 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="w-full h-32 bg-burgundy/10 rounded animate-pulse"></div>
                <div className="w-full h-24 bg-burgundy/10 rounded animate-pulse"></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="w-full h-20 bg-burgundy/10 rounded animate-pulse"></div>
                <div className="w-full h-32 bg-burgundy/10 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !facultyMember) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-burgundy/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-burgundy" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Faculty Member Not Found</h1>
          <p className="text-gray-600 mb-6">
            The faculty member you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/faculty">
            <Button className="bg-burgundy hover:bg-burgundy/90 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
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
        <div className="max-w-6xl mx-auto">
          
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href="/faculty"
              className="inline-flex items-center gap-2 text-burgundy hover:text-burgundy/80 transition-colors font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Faculty
            </Link>
          </div>
          
          {/* Hero Section */}
          <motion.div 
            variants={sectionVariants}
            className="bg-gradient-to-r from-burgundy to-burgundy/90 rounded-2xl p-8 mb-8 text-white"
          >
            <div className="flex flex-col lg:flex-row items-start gap-8">
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
                  <div className="w-[200px] h-[200px] rounded-2xl bg-white/20 border-4 border-white/20 flex items-center justify-center">
                    <User className="h-20 w-20 text-white/60" />
                  </div>
                )}
              </div>
              
              {/* Basic Info */}
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold mb-3">{facultyMember.name}</h1>
                <p className="text-xl text-white/90 mb-4">{facultyMember.designation}</p>
                
                {/* Experience Badge */}
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{facultyMember.experience}+ years experience</span>
                </div>
                
                {/* Specializations */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {facultyMember.specialization.map((spec, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gold">{facultyMember.publications.length}</div>
                    <div className="text-sm text-white/80">Publications</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gold">{facultyMember.achievements.length}</div>
                    <div className="text-sm text-white/80">Achievements</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gold">{facultyMember.research_areas.length}</div>
                    <div className="text-sm text-white/80">Research Areas</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-gold">{facultyMember.education.length}</div>
                    <div className="text-sm text-white/80">Degrees</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sidebar - Contact & Links */}
            <motion.div 
              variants={sectionVariants}
              className="lg:col-span-1 space-y-6"
            >
              {/* Contact Information */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-burgundy">
                    <Mail className="h-5 w-5 mr-2 text-burgundy" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    {facultyMember.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <a 
                          href={`mailto:${facultyMember.email}`} 
                          className="text-blue-600 hover:underline text-sm break-all"
                        >
                          {facultyMember.email}
                        </a>
                      </div>
                    )}
                    
                    {facultyMember.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <a 
                          href={`tel:${facultyMember.phone}`} 
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {facultyMember.phone}
                        </a>
                      </div>
                    )}
                    
                    {facultyMember.office_location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{facultyMember.office_location}</span>
                      </div>
                    )}
                    
                    {facultyMember.office_hours && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{facultyMember.office_hours}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Professional Links */}
              {(facultyMember.linkedin_url || facultyMember.google_scholar_url || facultyMember.personal_website || facultyMember.research_gate_url) && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center text-burgundy">
                      <Globe className="h-5 w-5 mr-2 text-burgundy" />
                      Professional Links
                    </h3>
                    <div className="space-y-3">
                      {facultyMember.linkedin_url && (
                        <a
                          href={facultyMember.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-blue-600 hover:underline text-sm"
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
                          className="flex items-center gap-3 text-blue-600 hover:underline text-sm"
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
                          className="flex items-center gap-3 text-blue-600 hover:underline text-sm"
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
                          className="flex items-center gap-3 text-blue-600 hover:underline text-sm"
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
            <motion.div 
              variants={sectionVariants}
              className="lg:col-span-2 space-y-8"
            >
              
              {/* Biography */}
              {facultyMember.bio && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 text-burgundy">About</h3>
                    <p className="text-gray-700 leading-relaxed">{facultyMember.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {facultyMember.education.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-burgundy">
                      <GraduationCap className="h-5 w-5 mr-2 text-burgundy" />
                      Education
                    </h3>
                    <ul className="space-y-3">
                      {facultyMember.education.map((edu, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-burgundy rounded-full mt-2 flex-shrink-0"></div>
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
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-burgundy">
                      <BookOpen className="h-5 w-5 mr-2 text-burgundy" />
                      Research Areas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {facultyMember.research_areas.map((area, index) => (
                        <span 
                          key={index}
                          className="px-3 py-2 bg-burgundy/10 text-burgundy rounded-lg text-sm font-medium border border-burgundy/20"
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
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-burgundy">
                      <Award className="h-5 w-5 mr-2 text-burgundy" />
                      Achievements & Awards
                    </h3>
                    <ul className="space-y-3">
                      {facultyMember.achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
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
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-burgundy">
                      <FileText className="h-5 w-5 mr-2 text-burgundy" />
                      Publications ({facultyMember.publications.length})
                    </h3>
                    <div className="space-y-4">
                      {facultyMember.publications.map((pub, index) => (
                        <div key={index} className="border-l-4 border-burgundy/30 pl-4 py-3 bg-burgundy/5 rounded-r-lg">
                          <h4 className="font-medium text-gray-900 mb-1">{pub.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">{pub.journal}</span> • {pub.year}
                          </p>
                          {pub.url && (                              <a
                                href={pub.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-burgundy hover:text-burgundy/80 hover:underline font-medium"
                              >
                              <ExternalLink className="h-3 w-3 mr-1" />
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
