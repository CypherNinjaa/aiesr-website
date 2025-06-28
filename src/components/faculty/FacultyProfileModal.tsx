// ============================================
// FACULTY PROFILE MODAL - Modern faculty profile viewer
// ============================================

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ExternalLink, 
  BookOpen, 
  Award, 
  GraduationCap,
  User
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/Button";
import { getPublicPhotoUrl } from "@/services/faculty";
import type { Faculty } from "@/types";

interface FacultyProfileModalProps {
  faculty: Faculty | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FacultyProfileModal({ faculty, isOpen, onClose }: FacultyProfileModalProps) {
  if (!faculty) return null;

  const profileImageUrl = faculty.profile_image_url 
    ? getPublicPhotoUrl(faculty.profile_image_url)
    : null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close profile"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="flex items-start gap-6">
                <div className="relative flex-shrink-0">
                  {profileImageUrl ? (
                    <Image
                      src={profileImageUrl}
                      alt={faculty.name}
                      width={120}
                      height={120}
                      className="rounded-full border-4 border-white/20 object-cover"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] rounded-full bg-white/20 border-4 border-white/20 flex items-center justify-center">
                      <User className="h-12 w-12 text-white/60" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{faculty.name}</h2>
                  <p className="text-xl text-white/90 mb-2">{faculty.designation}</p>
                  <div className="flex flex-wrap gap-2">
                    {faculty.specialization.slice(0, 3).map((spec, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Contact & Basic Info */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-indigo-600" />
                    Contact Information
                  </h3>
                  
                  <div className="space-y-3">
                    {faculty.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-3 text-gray-400" />
                        <a href={`mailto:${faculty.email}`} className="text-blue-600 hover:underline">
                          {faculty.email}
                        </a>
                      </div>
                    )}
                    
                    {faculty.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-3 text-gray-400" />
                        <a href={`tel:${faculty.phone}`} className="text-blue-600 hover:underline">
                          {faculty.phone}
                        </a>
                      </div>
                    )}
                    
                    {faculty.office_location && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-gray-700">{faculty.office_location}</span>
                      </div>
                    )}
                    
                    {faculty.office_hours && (
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-gray-700">{faculty.office_hours}</span>
                      </div>
                    )}
                  </div>

                  {/* External Links */}
                  {(faculty.linkedin_url || faculty.google_scholar_url || faculty.personal_website || faculty.research_gate_url) && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold mb-3">Professional Links</h4>
                      <div className="space-y-2">
                        {faculty.linkedin_url && (
                          <a
                            href={faculty.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            LinkedIn Profile
                          </a>
                        )}
                        {faculty.google_scholar_url && (
                          <a
                            href={faculty.google_scholar_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Google Scholar
                          </a>
                        )}
                        {faculty.research_gate_url && (
                          <a
                            href={faculty.research_gate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            ResearchGate
                          </a>
                        )}
                        {faculty.personal_website && (
                          <a
                            href={faculty.personal_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-sm text-blue-600 hover:underline"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Personal Website
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Detailed Information */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Bio */}
                  {faculty.bio && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">About</h3>
                      <p className="text-gray-700 leading-relaxed">{faculty.bio}</p>
                    </div>
                  )}

                  {/* Education */}
                  {faculty.education.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-indigo-600" />
                        Education
                      </h3>
                      <ul className="space-y-2">
                        {faculty.education.map((edu, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{edu}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Research Areas */}
                  {faculty.research_areas.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                        Research Areas
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {faculty.research_areas.map((area, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Achievements */}
                  {faculty.achievements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <Award className="h-5 w-5 mr-2 text-indigo-600" />
                        Achievements
                      </h3>
                      <ul className="space-y-2">
                        {faculty.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Publications */}
                  {faculty.publications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Publications</h3>
                      <div className="space-y-3">
                        {faculty.publications.slice(0, 5).map((pub, index) => (
                          <div key={index} className="border-l-4 border-indigo-200 pl-4 py-2">
                            <h4 className="font-medium text-gray-900">{pub.title}</h4>
                            <p className="text-sm text-gray-600">
                              {pub.journal} • {pub.year}
                            </p>
                            {pub.url && (
                              <a
                                href={pub.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center mt-1"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Publication
                              </a>
                            )}
                          </div>
                        ))}
                        {faculty.publications.length > 5 && (
                          <p className="text-sm text-gray-500 italic">
                            ... and {faculty.publications.length - 5} more publications
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t bg-gray-50 px-6 py-4 flex justify-end">
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
