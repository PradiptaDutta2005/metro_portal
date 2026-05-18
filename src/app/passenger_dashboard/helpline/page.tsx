"use client";
export const dynamic = "force-dynamic";

import { ReactElement } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  AlertTriangle,
  Users,
  Shield,
  Train,
  Twitter,
  Instagram,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import Navigation from "../Navigation";

// ✅ Types
type ContactInfo = {
  icon: React.ElementType;
  title: string;
  primary: string;
  secondary: string;
  description: string;
  color: string;
};

type ServiceInfo = {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
};

type OfficeInfo = {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
};

const Helpline = (): ReactElement => {
  const contactInfo: ContactInfo[] = [
    {
      icon: Phone,
      title: "Emergency Helpline",
      primary: "+91 484 2690620",
      secondary: "Available 24/7",
      description: "For urgent assistance and emergencies",
      color: "from-red-600 to-orange-500",
    },
    {
      icon: Phone,
      title: "Customer Care",
      primary: "+91 484 2690621",
      secondary: "6:00 AM - 10:00 PM",
      description: "General inquiries and support",
      color: "from-sky-600 to-blue-500",
    },
    {
      icon: Mail,
      title: "Email Support",
      primary: "info@kochimetro.org",
      secondary: "Response within 24 hours",
      description: "Non-urgent queries and feedback",
      color: "from-emerald-600 to-teal-500",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      primary: "+91 90488 90488",
      secondary: "8:00 AM - 8:00 PM",
      description: "Quick support via WhatsApp",
      color: "from-green-600 to-emerald-500",
    },
  ];

  const handleContactClick = (type: string, value: string): void => {
    if (type.includes("Phone") || type.includes("WhatsApp")) {
      window.open(`tel:${value}`);
      toast.success(`Initiating call to ${value}`);
    } else if (type.includes("Email")) {
      window.open(`mailto:${value}`);
      toast.success(`Opening email to ${value}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-950">
      <Navigation />
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Kochi Metro{" "}
            <span className="bg-gradient-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent">
              Helpline
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We’re here to assist you! Reach our team for any inquiries or
            emergencies.
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-700 dark:text-gray-200">
            Contact Us
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-md hover:shadow-xl bg-white dark:bg-slate-900 transition-all duration-300">
                  <CardHeader>
                    <div
                      className={`w-14 h-14 mb-4 rounded-full bg-gradient-to-r ${contact.color} flex items-center justify-center shadow-md`}
                    >
                      <contact.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-lg text-gray-700 dark:text-gray-200">
                      {contact.title}
                    </CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      {contact.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold text-sky-600 dark:text-emerald-400 break-words">
                      {contact.primary}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.secondary}
                    </p>
                    <Button
                      className="w-full mt-4 bg-gradient-to-r from-sky-600 to-emerald-500 hover:opacity-90"
                      onClick={() =>
                        handleContactClick(contact.title, contact.primary)
                      }
                    >
                      {contact.title.includes("Email")
                        ? "Send Email"
                        : "Contact Now"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Services */}
        <section className="py-16 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-red-950">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10 text-gray-700 dark:text-gray-200">
              Emergency Services
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: AlertTriangle,
                  title: "Security",
                  desc: "On-ground security support across all stations",
                  color: "from-red-600 to-orange-500",
                },
                {
                  icon: Shield,
                  title: "Lost & Found",
                  desc: "Report and recover lost belongings",
                  color: "from-sky-600 to-blue-500",
                },
                {
                  icon: Users,
                  title: "Women Helpdesk",
                  desc: "Dedicated support for women passengers",
                  color: "from-emerald-600 to-teal-500",
                },
              ].map((service: ServiceInfo, index: number) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-md hover:shadow-xl bg-white dark:bg-slate-900 transition-all duration-300">
                    <CardHeader>
                      <div
                        className={`w-14 h-14 mb-4 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center shadow-md`}
                      >
                        <service.icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-lg text-gray-700 dark:text-gray-200">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        {service.desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Metro Offices */}
        <section className="py-16 bg-gradient-to-r from-sky-50 via-emerald-50 to-blue-50 dark:from-slate-900 dark:via-slate-950 dark:to-emerald-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-10 text-gray-700 dark:text-gray-200">
              Metro Offices
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: MapPin,
                  title: "Head Office",
                  desc: "Kochi Metro Rail Limited, Revenue Tower, Kochi",
                  color: "from-sky-600 to-emerald-500",
                },
                {
                  icon: Train,
                  title: "Operations Office",
                  desc: "Metro Operations Control Centre, Muttom Yard",
                  color: "from-indigo-600 to-sky-500",
                },
                {
                  icon: Clock,
                  title: "Working Hours",
                  desc: "Mon - Sat, 9:00 AM - 6:00 PM",
                  color: "from-emerald-600 to-teal-500",
                },
              ].map((office: OfficeInfo, index: number) => (
                <motion.div
                  key={office.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-0 shadow-md hover:shadow-xl bg-white dark:bg-slate-900 transition-all duration-300">
                    <CardHeader>
                      <div
                        className={`w-14 h-14 mb-4 rounded-full bg-gradient-to-r ${office.color} flex items-center justify-center shadow-md`}
                      >
                        <office.icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-lg text-gray-700 dark:text-gray-200">
                        {office.title}
                      </CardTitle>
                      <CardDescription className="text-gray-500 dark:text-gray-400">
                        {office.desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-gray-300 py-8">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Kochi Metro Rail Limited. All rights
              reserved.
            </p>
            <div className="flex gap-4">
              <Link href="https://twitter.com" target="_blank">
                <Twitter className="h-6 w-6 text-sky-400 hover:text-sky-300 transition" />
              </Link>
              <Link href="https://instagram.com" target="_blank">
                <Instagram className="h-6 w-6 text-pink-400 hover:text-pink-300 transition" />
              </Link>
              <Link href="mailto:info@kochimetro.org">
                <Mail className="h-6 w-6 text-emerald-400 hover:text-emerald-300 transition" />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Helpline;
