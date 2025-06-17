"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import {
  useAchievements,
  useAchievementStats,
  useCategoriesWithAchievements,
} from "@/hooks/useAchievements";
import { Achievement } from "@/types";

// Achievement type badges
const typeBadges = {
  award: { label: "Award", class: "bg-yellow-100 text-yellow-800" },
  publication: { label: "Publication", class: "bg-blue-100 text-blue-800" },
  recognition: { label: "Recognition", class: "bg-green-100 text-green-800" },
  milestone: { label: "Milestone", class: "bg-purple-100 text-purple-800" },
  collaboration: { label: "Collaboration", class: "bg-indigo-100 text-indigo-800" },
};

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
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const [imageError, setImageError] = useState(false);
  const typeBadge = typeBadges[achievement.type];

  return (
    <motion.div variants={cardVariants} className="group">
      <Card className="h-full overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardContent className="p-6">
          {/* Achievement Image */}
          {achievement.image_url && !imageError && (
            <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={achievement.image_url}
                alt={achievement.title}
                width={400}
                height={225}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            </div>
          )}{" "}
          {/* Category Icon and Type Badge */}
          <div className="mb-4 flex items-center justify-between">
            <div className="text-4xl transition-transform duration-300 group-hover:scale-110">
              {achievement.category?.icon_emoji || "🏆"}
            </div>
            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${typeBadge.class}`}>
              {typeBadge.label}
            </span>
          </div>
          {/* Achievement Title */}
          <h3 className="font-primary text-burgundy group-hover:text-gold mb-3 line-clamp-2 text-xl font-bold transition-colors duration-300">
            {achievement.title}
          </h3>
          {/* Achiever Information */}
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700">{achievement.achiever_name}</p>
            <p className="text-xs text-gray-500 capitalize">{achievement.achiever_type}</p>
          </div>
          {/* Description */}
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
            {achievement.description}
          </p>
          {/* Achievement Date */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {new Date(achievement.date_achieved).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
              })}
            </span>
            {achievement.details?.rank && (
              <span className="text-gold text-xs font-semibold">#{achievement.details.rank}</span>
            )}
          </div>
          {/* Additional Details */}
          {achievement.details && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              {achievement.details.institution && (
                <p className="mb-1 text-xs text-gray-500">
                  <span className="font-semibold">Institution:</span>{" "}
                  {achievement.details.institution}
                </p>
              )}
              {achievement.details.award_body && (
                <p className="mb-1 text-xs text-gray-500">
                  <span className="font-semibold">Awarded by:</span>{" "}
                  {achievement.details.award_body}
                </p>
              )}
              {achievement.details.amount && (
                <p className="text-xs font-semibold text-green-600">
                  Amount: {achievement.details.amount}
                </p>
              )}
            </div>
          )}
        </CardContent>

        {/* Hover Effect Overlay */}
        <div className="from-burgundy/5 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      </Card>
    </motion.div>
  );
};

export default function AchievementsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [achieverTypeFilter, setAchieverTypeFilter] = useState<string>("all");

  const { data: categories = [] } = useCategoriesWithAchievements();

  const {
    data: achievementsData,
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useAchievements({
    status: "published",
    category_id: activeFilter === "all" ? undefined : activeFilter,
    achiever_type: achieverTypeFilter === "all" ? undefined : achieverTypeFilter,
    limit: 50,
  });

  const { data: stats, isLoading: statsLoading } = useAchievementStats();

  const achievements = achievementsData?.data || []; // Filter options - now using categories with achievements only
  const categoryFilters = [
    { value: "all", label: "All Categories", icon: "🎯" },
    ...categories.map(
      (cat: { id: string; name: string; icon_emoji: string; achievement_count: number }) => ({
        value: cat.id,
        label: `${cat.name} (${cat.achievement_count})`,
        icon: cat.icon_emoji,
      })
    ),
  ];

  const achieverTypeFilters = [
    { value: "all", label: "All Types" },
    { value: "student", label: "Students" },
    { value: "faculty", label: "Faculty" },
    { value: "department", label: "Department" },
    { value: "institution", label: "Institution" },
  ];

  // Show loading state
  if (achievementsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-20">
          <div className="mb-16 text-center">
            <h1 className="font-primary text-burgundy mb-6 text-4xl font-bold md:text-5xl">
              Our Achievements
            </h1>
            <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
              Loading our achievements...
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-80 rounded-lg bg-gray-200"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (achievementsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-primary text-burgundy mb-6 text-4xl font-bold md:text-5xl">
            Our Achievements
          </h1>
          <p className="text-gray-600">
            We're currently updating our achievements. Please check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="from-burgundy to-burgundy/90 relative overflow-hidden bg-gradient-to-r py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-primary mb-6 text-4xl font-bold md:text-6xl">Our Achievements</h1>
            <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed">
              Celebrating the remarkable accomplishments of our students, faculty, and institution
              in academic excellence, research, and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      {stats && (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              <div className="text-center">
                <div className="text-burgundy text-3xl font-bold">{stats.total}+</div>
                <div className="text-sm text-gray-600">Total Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-3xl font-bold">{stats.student_achievements}+</div>
                <div className="text-sm text-gray-600">Student Awards</div>
              </div>
              <div className="text-center">
                <div className="text-burgundy text-3xl font-bold">
                  {stats.faculty_achievements}+
                </div>
                <div className="text-sm text-gray-600">Faculty Recognition</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-3xl font-bold">{stats.recent_achievements}+</div>
                <div className="text-sm text-gray-600">This Year</div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters Section */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeFilter === filter.value
                      ? "bg-burgundy text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {filter.icon} {filter.label}
                </button>
              ))}
            </div>

            {/* Achiever Type Filters */}
            <div className="flex flex-wrap gap-2">
              {achieverTypeFilters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setAchieverTypeFilter(filter.value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    achieverTypeFilter === filter.value
                      ? "bg-gold text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {achievements.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {achievements.map(achievement => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </motion.div>
          ) : (
            <div className="py-16 text-center">
              <div className="mb-4 text-6xl">🏆</div>
              <h3 className="mb-2 text-2xl font-bold text-gray-700">No achievements found</h3>
              <p className="text-gray-600">
                {activeFilter !== "all" || achieverTypeFilter !== "all"
                  ? "Try adjusting your filters to see more achievements."
                  : "Achievements are being updated. Please check back soon!"}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
