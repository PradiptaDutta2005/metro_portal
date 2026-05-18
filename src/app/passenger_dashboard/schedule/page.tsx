"use client";
export const dynamic = "force-dynamic";

import { ReactElement } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Train, Clock, MapPin } from "lucide-react";
import Navigation from "../Navigation";

// ✅ Types
type Departure = {
  time: string;
  station: string;
};

type Schedule = {
  route: string;
  departures: Departure[];
};

const schedules: Schedule[] = [
  {
    route: "Aluva → Petta",
    departures: [
      { time: "06:00 AM", station: "Aluva" },
      { time: "06:15 AM", station: "Edapally" },
      { time: "06:45 AM", station: "M. G. Road" },
      { time: "07:20 AM", station: "Petta" },
    ],
  },
  {
    route: "Petta → Aluva",
    departures: [
      { time: "06:10 AM", station: "Petta" },
      { time: "06:35 AM", station: "M. G. Road" },
      { time: "07:05 AM", station: "Edapally" },
      { time: "07:30 AM", station: "Aluva" },
    ],
  },
];

const SchedulePage = (): ReactElement => {
  return (
    <div className="min-h-screen gap-15 bg-gradient-to-b from-emerald-50 to-blue-100 dark:from-gray-900 dark:to-gray-950 py-16">
      <Navigation />
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-15 mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Kochi Metro{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent">
              Train Schedule
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Real-time schedule and departure timings for all Kochi Metro routes.
          </p>
        </motion.div>

        {/* Schedule Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {schedules.map((schedule, index) => (
            <motion.div
              key={schedule.route}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md">
                <CardHeader className="flex items-center gap-2">
                  <Train className="h-6 w-6 text-emerald-500" />
                  <CardTitle>{schedule.route}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schedule.departures.map((d: Departure, i: number) => (
                      <div
                        key={`${schedule.route}-${i}`}
                        className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2"
                      >
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          {d.station}
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <Clock className="h-4 w-4" />
                          {d.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-sm text-gray-600 dark:text-gray-400">
          *Timings are indicative. Please check real-time updates at the station
          or on the Kochi Metro app.
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
