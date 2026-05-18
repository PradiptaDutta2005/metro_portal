"use client";
export const dynamic = "force-dynamic";

import { ReactElement } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  Clock,
  MapPin,
  CreditCard,
  Smartphone,
  Users,
  Accessibility,
  Wifi,
  Car,
  ShoppingBag,
  LucideIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navigation from "../Navigation";

// ✅ Types
type MainService = {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  color: string;
};

type AdditionalService = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const mainServices: MainService[] = [
  {
    icon: Ticket,
    title: "Ticketing Services",
    description:
      "Multiple convenient ways to purchase and manage your metro tickets",
    features: [
      "Counter Tickets",
      "Kochi1 Smart Card",
      "Mobile App Booking",
      "Group Bookings",
    ],
    color: "from-blue-600 to-blue-400",
  },
  {
    icon: Clock,
    title: "Train Schedules",
    description: "Real-time information about train timings and frequencies",
    features: [
      "Live Train Tracking",
      "Schedule Updates",
      "Delay Notifications",
      "Peak Hour Info",
    ],
    color: "from-blue-500 to-blue-300",
  },
  {
    icon: MapPin,
    title: "Route Information",
    description: "Comprehensive route planning and station details",
    features: [
      "22 Stations Coverage",
      "Route Maps",
      "Transfer Points",
      "Distance Calculator",
    ],
    color: "from-blue-700 to-blue-500",
  },
  {
    icon: CreditCard,
    title: "Payment Options",
    description: "Flexible payment methods for all passengers",
    features: [
      "Cash Payments",
      "Digital Wallets",
      "UPI Payments",
      "Card Payments",
    ],
    color: "from-blue-800 to-blue-600",
  },
];

const additionalServices: AdditionalService[] = [
  {
    icon: Accessibility,
    title: "Accessibility Services",
    description: "Barrier-free travel for passengers with special needs",
  },
  {
    icon: Wifi,
    title: "Free Wi-Fi",
    description: "Complimentary internet access at all metro stations",
  },
  {
    icon: Car,
    title: "Park & Ride",
    description: "Convenient parking facilities at select metro stations",
  },
  {
    icon: ShoppingBag,
    title: "Station Amenities",
    description: "Shopping, dining, and convenience stores at major stations",
  },
  {
    icon: Users,
    title: "Group Travel",
    description: "Special arrangements and discounts for group bookings",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Official Kochi Metro app for tickets and real-time updates",
  },
];

const stations: string[] = [
  "Aluva",
  "Pulinchodu",
  "Companypady",
  "Ambattukavu",
  "Muttom",
  "Kalamassery",
  "Cunat",
  "Pathalam",
  "Edappally",
  "Changampuzha Park",
  "Palarivattom",
  "JLN Stadium",
  "Kaloor",
  "Town Hall",
  "Maharaja's College",
  "Ernakulam South",
  "Kadavanthra",
  "Elamkulam",
  "Vyttila",
  "Thaikoodam",
  "Petta",
  "Maharaja's College Ground",
];

const operatingInfo = {
  hours: "6:00 AM - 10:00 PM",
  frequency: "3-5 minutes (Peak), 7-10 minutes (Off-peak)",
  totalRoute: "25.6 km",
  totalStations: "22 stations",
};

const Services = (): ReactElement => {
  return (
    <div className="min-h-screen py-8">
      <Navigation />
      <div className="container mt-15 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Services
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover comprehensive metro services designed to make your journey
            comfortable, convenient, and connected
          </p>
        </motion.div>

        {/* Operating Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900 dark:via-blue-950 dark:to-blue-900 border-0">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Operating Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
                    <Clock className="h-6 w-6 mx-auto mb-2" />
                    {operatingInfo.hours}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Operating Hours
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
                    <Ticket className="h-6 w-6 mx-auto mb-2" />
                    {operatingInfo.frequency}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Train Frequency
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
                    <MapPin className="h-6 w-6 mx-auto mb-2" />
                    {operatingInfo.totalRoute}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Total Route
                  </p>
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    {operatingInfo.totalStations}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Total Stations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Core Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Core Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900 dark:via-gray-900 dark:to-blue-900">
                  <CardHeader>
                    <div
                      className={`w-16 h-16 mb-4 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center shadow-lg`}
                    >
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {service.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Additional Amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="text-center h-full border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900 dark:via-gray-900 dark:to-blue-900">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Metro Stations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-900 dark:via-gray-900 dark:to-blue-900">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Metro Stations
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                All 22 stations along the Kochi Metro route from Aluva to Petta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 justify-center">
                {stations.map((station, index) => (
                  <motion.div
                    key={station}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Badge
                      variant="outline"
                      className="text-sm py-1 px-3 border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950 transition-colors cursor-pointer"
                    >
                      {station}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900 dark:via-blue-950 dark:to-blue-900 rounded-lg p-8"
        >
          <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Contact our helpline or file a complaint for any queries about our
            services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
            >
              <Link href="/passenger_dashboard/helpline">Contact Helpline</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
            >
              <Link href="/passenger_dashboard/complaints">File Complaint</Link>
            </Button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-8 pb-6 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          <div className="container mx-auto px-4">
            <p className="mb-2">
              © {new Date().getFullYear()} Kochi Metro. All Rights Reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4"></div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Services;
