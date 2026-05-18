"use client";
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Brain } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactElement } from "react";

const HeroSection = (): ReactElement => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/metro.mp4" // 🔹 place metro video in public/videos/metro.mp4
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-blue-900/30 z-0" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 bg-blue-100/80 text-blue-700 border border-blue-200 shadow-md"
            >
              <Brain className="h-3 w-3 mr-1" />
              Next-Generation AI Technology
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-teal-200 bg-clip-text text-transparent leading-tight drop-shadow-lg"
          >
            AI-Driven Train Induction
            <span className="block">Planning & Scheduling</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-md"
          >
            Revolutionizing Kochi Metro operations with intelligent scheduling,
            predictive analytics, and seamless role-based management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            {/* 🔹 Redirect to /login */}
            <Link href="/login" passHref>
              <Button
                size="lg"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Zap className="h-5 w-5 mr-2" />
                Get Started
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              className="cursor-pointer border border-blue-300 hover:bg-blue-100 text-white hover:text-blue-700 bg-white/10 backdrop-blur-md"
            >
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
