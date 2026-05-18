"use client";
export const dynamic = "force-dynamic";

import { useState, ReactElement } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  User,
  Settings,
  Calendar,
  BarChart3,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";

const Navigation = (): ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { theme, setTheme } = useTheme(); // ✅ keeping since you may add dark mode toggle later
  const router = useRouter();

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-gray-700 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="MetroRail Logo"
                width={180}
                height={180}
                className="cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center text-gray-200">
                <BarChart3 className="h-4 w-4 mr-2" />
                Admin Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/schedule" className="flex items-center text-gray-200">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/maintainer_dashboard"
                className="flex items-center text-gray-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Maintenance
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/locopilot_dashboard"
                className="flex items-center text-gray-200"
              >
                <Users className="h-4 w-4 mr-2" />
                Crew Management
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/passenger_dashboard"
                className="flex items-center text-gray-200"
              >
                <Users className="h-4 w-4 mr-2" />
                Passenger Portal
              </Link>
            </Button>

            {/* Login button */}
            <Button
              variant="default"
              size="sm"
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4"
              onClick={() => router.push("/login")}
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-gray-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
