"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { useFeaturedAchievements, useAchievementStats } from "@/hooks/useAchievements";
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
              {" "}
              <Image
                src={achievement.image_url}
                alt={achievement.title}
                width={400}
                height={225}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            </div>
          )}
          {/* Category Icon and Type Badge */}{" "}
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

export const AchievementsSection: React.FC = () => {
  const {
    data: achievements = [],
    isLoading: achievementsLoading,
    error: achievementsError,
  } = useFeaturedAchievements(6);
  const { data: stats, isLoading: statsLoading } = useAchievementStats();

  // Show loading state
  if (achievementsLoading || statsLoading) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="font-primary text-burgundy mb-6 text-4xl font-bold md:text-5xl">
              Our Achievements
            </h2>
            <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
              Loading our latest achievements...
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
      </section>
    );
  }

  // Show error state
  if (achievementsError) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="font-primary text-burgundy mb-6 text-4xl font-bold md:text-5xl">
            Our Achievements
          </h2>
          <p className="text-gray-600">
            We're currently updating our achievements. Please check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-burgundy font-script absolute top-20 left-10 text-8xl">🏆</div>
        <div className="text-gold absolute right-10 bottom-20 text-6xl">⭐</div>
        <div className="bg-burgundy absolute top-1/2 left-1/4 h-40 w-32 rotate-12 transform rounded-lg opacity-10"></div>
        <div className="bg-gold absolute right-1/3 bottom-1/4 h-32 w-24 -rotate-12 transform rounded-lg opacity-10"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-primary text-burgundy mb-6 text-4xl font-bold md:text-5xl">
            Our Achievements
          </h2>
          <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            Celebrating the remarkable accomplishments of our students, faculty, and institution in
            academic excellence, research, and beyond.
          </p>
        </motion.div>

        {/* Statistics Row */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4"
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
              <div className="text-burgundy text-3xl font-bold">{stats.faculty_achievements}+</div>
              <div className="text-sm text-gray-600">Faculty Recognition</div>
            </div>
            <div className="text-center">
              <div className="text-gold text-3xl font-bold">{stats.recent_achievements}+</div>
              <div className="text-sm text-gray-600">This Year</div>
            </div>
          </motion.div>
        )}

        {/* Achievements Grid */}
        {achievements.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {" "}
            {achievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center text-gray-600">
            <div className="mb-4 text-6xl">🏆</div>
            <p className="text-xl">More achievements coming soon!</p>
            <p className="mt-2 text-sm">We're currently updating our achievement showcase.</p>
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="mb-4 text-lg text-gray-700">Ready to be part of our success story?</p>
          <Link
            href="/programs"
            className="bg-burgundy hover:bg-burgundy/90 inline-block rounded-lg px-8 py-3 font-semibold text-white transition-colors duration-300"
          >
            Explore Our Programs
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
