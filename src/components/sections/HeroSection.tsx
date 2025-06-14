"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState, useMemo } from "react";
import { useHeroTexts } from "@/contexts/PublicSettingsContext";

export const HeroSection: React.FC = () => {
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get hero texts from settings
  const heroTextsFromSettings = useHeroTexts();

  const texts = useMemo(() => heroTextsFromSettings, [heroTextsFromSettings]);

  useEffect(() => {
    const currentFullText = texts[textIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 500 : 2000;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentFullText.length) {
          setCurrentText(currentFullText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        if (charIndex > 0) {
          setCurrentText(currentFullText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };
  return (
    <section className="from-cream relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br via-white to-gray-50 pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Books */}
        <div className="floating-books absolute top-20 left-10 opacity-20">
          <div className="bg-burgundy h-20 w-16 -rotate-12 transform rounded shadow-lg"></div>
        </div>
        <div className="floating-books animation-delay-2000 absolute top-40 right-20 opacity-15">
          <div className="bg-gold h-16 w-12 rotate-12 transform rounded shadow-lg"></div>
        </div>
        <div className="floating-books animation-delay-4000 absolute bottom-40 left-20 opacity-25">
          <div className="h-18 w-14 rotate-6 transform rounded bg-gray-600 shadow-lg"></div>
        </div>

        {/* Decorative Elements */}
        <div className="bg-gold absolute top-1/4 right-1/4 h-2 w-2 rounded-full opacity-40"></div>
        <div className="bg-burgundy absolute bottom-1/3 left-1/3 h-3 w-3 rounded-full opacity-30"></div>
        <div className="absolute top-2/3 right-1/3 h-1 w-1 rounded-full bg-gray-400 opacity-50"></div>

        {/* Ink Blot Effect */}
        <div className="bg-burgundy absolute top-0 right-0 h-96 w-96 rounded-full opacity-5 blur-3xl"></div>
        <div className="bg-gold absolute bottom-0 left-0 h-80 w-80 rounded-full opacity-5 blur-3xl"></div>
      </div>{" "}
      {/* Main Content */}
      <motion.div
        className="relative z-10 container mx-auto mt-8 px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="mx-auto max-w-4xl">
          {/* Main Heading */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="font-primary text-burgundy mb-4 text-5xl font-bold md:text-6xl lg:text-7xl">
              <span className="block">
                {currentText}
                <span className="border-gold ml-1 animate-pulse border-r-3">|</span>
              </span>
            </h1>
            <div className="bg-gold mx-auto h-1 w-24 rounded-full"></div>
          </motion.div>{" "}
          {/* Subtitle */}{" "}
          <motion.p
            variants={itemVariants}
            className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-700 md:text-2xl"
          >
            Shape your future in English Studies and Research at one of India&apos;s premier
            institutes. Join a community of scholars, writers, and researchers passionate about
            literature.
          </motion.p>
          {/* Call-to-Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            {/* <Link href="/events">
              <Button size="lg" className="px-8 py-4 text-lg">
                Upcoming Events
              </Button>
            </Link> */}
            {/* <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Virtual Campus Tour
            </Button>{" "} */}
          </motion.div>
        </div>
      </motion.div>{" "}
      {/* Quote Section */}
      <div className="absolute right-8 -bottom-0 left-8 md:right-20 md:left-20">
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center"
        >
          {" "}
          <p className="font-script text-lg text-gray-600 italic md:text-xl">
            &ldquo;Literature is the most agreeable way of ignoring life.&rdquo;
          </p>
          <cite className="mt-2 block text-sm text-gray-500">— Fernando Pessoa</cite>
        </motion.blockquote>
      </div>
    </section>
  );
};
