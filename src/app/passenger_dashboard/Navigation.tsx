"use client";

import { ReactElement } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, FileText, Ticket, Calendar, Menu, X } from "lucide-react";

const Navigation = (): ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

export default Navigation;
