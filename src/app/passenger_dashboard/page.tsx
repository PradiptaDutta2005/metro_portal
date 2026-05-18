"use client";
export const dynamic = "force-dynamic";

import { ReactElement } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import Chatbot from "../chat/page";
import { useRouter } from "next/navigation";
import {
  Train,
  Clock,
  Ticket,
  Phone,
  FileText,
  Calendar,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

/* ----------------------
   Navigation Component
   ---------------------- */
const Navigation = (): ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <nav className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 border-b border-blue-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Kochi Metro Logo"
                width={160}
                height={160}
                priority
                className="cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/passenger_dashboard/helpline"
                className="flex items-center text-white"
              >
                <Phone className="h-4 w-4 mr-2" />
                Helpline
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/passenger_dashboard/complaints"
                className="flex items-center text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Complaints
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/passenger_dashboard/services"
                className="flex items-center text-white"
              >
                <Ticket className="h-4 w-4 mr-2" />
                Services
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/schedule" className="flex items-center text-white">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-600 px-4 py-3 space-y-3">
          <Link href="/passenger_dashboard/helpline" className="block text-white">
            Helpline
          </Link>
          <Link href="/passenger_dashboard/complaints" className="block text-white">
            Complaints
          </Link>
          <Link href="/passenger_dashboard/services" className="block text-white">
            Services
          </Link>
          <Link href="/schedule" className="block text-white">
            Schedule
          </Link>
        </div>
      )}
    </nav>
  );
};

/* ----------------------
   Home Component
   ---------------------- */
const Home = (): ReactElement => {
  type Service = {
    icon: React.ElementType;
    title: string;
    description: string;
    link: string;
    color: string;
  };

  type Stat = {
    number: string;
    label: string;
    suffix?: string;
  };

  const services: Service[] = [
    {
      icon: Ticket,
      title: "Ticketing Services",
      description: "Buy tickets, check fares, and manage your Kochi1 card",
      link: "/passenger_dashboard/services",
      color: "from-indigo-600 to-blue-500",
    },
    {
      icon: Clock,
      title: "Train Schedules",
      description: "Real-time train schedules and route information",
      link: "/passenger_dashboard/schedule",
      color: "from-teal-600 to-cyan-500",
    },
    {
      icon: FileText,
      title: "File Complaint",
      description: "Report issues and provide feedback about your journey",
      link: "/passenger_dashboard/complaints",
      color: "from-pink-600 to-rose-500",
    },
    {
      icon: Phone,
      title: "Helpline Support",
      description: "24/7 customer support for all your metro needs",
      link: "/passenger_dashboard/helpline",
      color: "from-purple-600 to-fuchsia-500",
    },
  ];

  const stats: Stat[] = [
    { number: "22", label: "Stations" },
    { number: "25.6", label: "Total Route", suffix: "km" },
    { number: "50,000+", label: "Daily Passengers" },
    { number: "6 AM - 10 PM", label: "Operating Hours" },
  ];

  return (
    <div className="min-h-screen font-inter">
      {/* Navbar */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-100 to-white dark:from-gray-900 dark:via-blue-950 dark:to-gray-950">
        <Chatbot />
        <div className="container mx-auto px-6 lg:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                  Kochi Metro
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Experience modern, efficient, and sustainable public
                transportation. Your gateway to seamless urban mobility in God's
                Own Country.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600"
                >
                  <Link href="/passenger_dashboard/services">
                    <Train className="mr-2 h-5 w-5" />
                    Explore Services
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950"
                >
                  <Link href="/passenger_dashboard/complaints">
                    <FileText className="mr-2 h-5 w-5" />
                    File Complaint
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Right content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-indigo-200 to-blue-100 dark:from-indigo-800 dark:to-blue-900 rounded-3xl p-10 shadow-xl">
                <motion.div
                  animate={{ y: [-12, 12, -12] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-full h-48 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl"
                >
                  <Train className="h-24 w-24 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="space-y-2"
              >
                <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-blue-400 bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive metro services designed to make your journey
              comfortable and convenient
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl rounded-2xl transition-all duration-300 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm">
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center shadow-lg`}
                    >
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="mb-6 text-sm text-gray-600 dark:text-gray-300">
                      {service.description}
                    </CardDescription>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950"
                    >
                      <Link href={service.link}>Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
