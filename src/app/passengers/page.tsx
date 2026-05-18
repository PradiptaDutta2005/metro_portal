'use client';
export const dynamic = "force-dynamic";

import { useState, ReactElement } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  FileText,
  Sparkles,
  Clock,
  Users,
  ClipboardList,
  Train,
  Mail,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import Navigation from '../navigation/page';
import Link from 'next/link';
import { toast } from 'sonner';

/* ---------------------
   Types
   --------------------- */
type Role = 'admin' | 'locopilot' | 'engineer' | 'employee';

interface DutyForm {
  station: string;
  details: string;
}

interface MaintenanceForm {
  area: string;
  details: string;
  priority: string;
}

/* ---------------------
   Component
   --------------------- */
const Inhouse = (): ReactElement => {
  const [role, setRole] = useState<Role>('employee');
  const [dutyForm, setDutyForm] = useState<DutyForm>({ station: '', details: '' });
  const [maintenanceForm, setMaintenanceForm] = useState<MaintenanceForm>({
    area: '',
    details: '',
    priority: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDutySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/duty_reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...dutyForm, role }),
      });
      if (res.ok) {
        toast.success('Duty Report Submitted', {
          description: 'Your report has been sent to the concerned department.',
        });
        setDutyForm({ station: '', details: '' });
      } else {
        toast.error('Failed to submit duty report');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaintenanceSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/maintenance_logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...maintenanceForm, role }),
      });
      if (res.ok) {
        toast.success('Maintenance Log Submitted', {
          description: 'Your log has been sent to the concerned department.',
        });
        setMaintenanceForm({ area: '', details: '', priority: '' });
      } else {
        toast.error('Failed to submit maintenance log');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactClick = (type: 'phone' | 'email', value: string) => {
    if (type === 'phone') {
      window.open(`tel:${value}`);
      toast.success(`Initiating call to ${value}`);
    } else if (type === 'email') {
      window.open(`mailto:${value}`);
      toast.success(`Opening email to ${value}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900 dark:via-blue-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-400 py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">In-House Services</h1>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Tools and resources for KMRL staff to manage operations, maintenance, and
              communication effectively.
            </p>
            <div className="max-w-xs mx-auto">
              <Label htmlFor="role-select" className="text-white">
                Select Your Role
              </Label>
              <Select value={role} onValueChange={(value: Role) => setRole(value)}>
                <SelectTrigger
                  id="role-select"
                  className="border-blue-400 text-white bg-blue-500/50"
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="locopilot">Locopilot</SelectItem>
                  <SelectItem value="engineer">Engineer</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* HR Support */}
            <motion.div whileHover={{ y: -5 }}>
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-950 rounded-full w-16 h-16 flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-blue-600 dark:text-blue-400">HR Support</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Employee queries, leave, payroll assistance
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    hr@kmrl.org
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                    onClick={() => handleContactClick('email', 'hr@kmrl.org')}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Contact HR
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Duty Schedules */}
            <motion.div whileHover={{ y: -5 }}>
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-950 rounded-full w-16 h-16 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-blue-600 dark:text-blue-400">Duty Schedules</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    View upcoming rosters and shift allocations
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950"
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />
                    View Schedule
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emergency Protocols */}
            <motion.div whileHover={{ y: -5 }}>
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-red-100 dark:bg-red-950 rounded-full w-16 h-16 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-red-600 dark:text-red-400">
                    Emergency Protocols
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Quick response contacts and safety procedures
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-2">
                  <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Security: 101
                  </div>
                  <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Medical: 108
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Internal Reporting */}
      <section className="py-16 bg-blue-50 dark:bg-blue-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-600 dark:text-gray-300">
            Internal Reporting
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Duty Report Form */}
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600 dark:text-blue-400">
                  <FileText className="mr-2 h-5 w-5" />
                  Submit Duty Report
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  File daily duty completion and shift handover notes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleDutySubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="duty-station">Station/Section *</Label>
                    <Input
                      id="duty-station"
                      placeholder="Enter your station or section"
                      value={dutyForm.station}
                      onChange={(e) =>
                        setDutyForm({ ...dutyForm, station: e.target.value })
                      }
                      className="text-gray-600 dark:text-gray-300"
                      required
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="duty-details">Report Details *</Label>
                    <Textarea
                      id="duty-details"
                      placeholder="Describe completed tasks, issues faced..."
                      value={dutyForm.details}
                      onChange={(e) =>
                        setDutyForm({ ...dutyForm, details: e.target.value })
                      }
                      className="min-h-[120px] text-gray-600 dark:text-gray-300"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                  >
                    Submit Report
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Maintenance Log */}
            {['engineer', 'admin'].includes(role) && (
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="flex items-center text-blue-600 dark:text-blue-400">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Maintenance Log
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    Record maintenance activities and pending work
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleMaintenanceSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="maintenance-area">Area/Equipment *</Label>
                      <Input
                        id="maintenance-area"
                        placeholder="Enter equipment or location"
                        value={maintenanceForm.area}
                        onChange={(e) =>
                          setMaintenanceForm({ ...maintenanceForm, area: e.target.value })
                        }
                        className="text-gray-600 dark:text-gray-300"
                        required
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="maintenance-details">Details *</Label>
                      <Textarea
                        id="maintenance-details"
                        placeholder="Describe work done or issues found..."
                        value={maintenanceForm.details}
                        onChange={(e) =>
                          setMaintenanceForm({ ...maintenanceForm, details: e.target.value })
                        }
                        className="min-h-[120px] text-gray-600 dark:text-gray-300"
                        required
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <Label htmlFor="maintenance-priority">Priority *</Label>
                      <Select
                        value={maintenanceForm.priority}
                        onValueChange={(value) =>
                          setMaintenanceForm({ ...maintenanceForm, priority: value })
                        }
                      >
                        <SelectTrigger className="border-blue-600 dark:border-blue-400 text-gray-600 dark:text-gray-300">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                    >
                      Submit Log
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Department Contacts */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-gray-600 dark:text-gray-300">
              Department Contacts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* HR */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">HR</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p className="flex items-center justify-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <a
                      href="mailto:hr@kmrl.org"
                      onClick={() => handleContactClick('email', 'hr@kmrl.org')}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      hr@kmrl.org
                    </a>
                  </p>
                  <p className="flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    +91 484 2422200
                  </p>
                  <p>Timings: 9 AM - 6 PM</p>
                </div>
              </div>

              {/* Ops */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                  Operations Control
                </h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                  <p className="flex items-center justify-center">
                    <Mail className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    <a
                      href="mailto:ops@kmrl.org"
                      onClick={() => handleContactClick('email', 'ops@kmrl.org')}
                      className="hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      ops@kmrl.org
                    </a>
                  </p>
                  <p className="flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                    +91 484 2422250
                  </p>
                  <p>Available: 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900 dark:via-blue-950 dark:to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Branding */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Train className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-bold text-gray-600 dark:text-gray-300">
                  Kochi Metro
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Empowering our team with efficient tools for seamless operations.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Kochi Metro Rail Ltd. Internal Use Only.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/inhouse"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/inhouse/reports"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Reports
                  </Link>
                </li>
                <li>
                  <Link
                    href="/inhouse/schedules"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Schedules
                  </Link>
                </li>
                {['admin', 'engineer'].includes(role) && (
                  <li>
                    <Link
                      href="/inhouse/management"
                      className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      Management
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/login"
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Internal Helpdesk: ext. 100
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <a
                    href="mailto:it@kmrl.org"
                    onClick={() => handleContactClick('email', 'it@kmrl.org')}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    it@kmrl.org
                  </a>
                </li>
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Emergency: 101 (Security), 108 (Medical)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Inhouse;
