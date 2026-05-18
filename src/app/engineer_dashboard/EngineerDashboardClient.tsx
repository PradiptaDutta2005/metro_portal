'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Search, FileText, LogOut, Wrench, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Navigation from '../navigation/page';

interface Jobcard {
  id: number;
  dl_input_id: number;
  created_at: string;
  status: string;
  assigned_to: number | null;
  priority: number;
  title: string;
  description: string;
  reasons: any;
  suggested_actions: any;
  meta_info: any;
}

export default function EngineerDashboardClient() {
  const [jobcards, setJobcards] = useState<Jobcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<Jobcard | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:8000/api/jobcards/')
      .then((res) => res.json())
      .then((data) => {
        setJobcards(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching jobcards:', err);
        setLoading(false);
      });
  }, []);

  const filteredJobcards = jobcards.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Helper function to format object/array values into natural language
  const formatData = (data: any, label: string) => {
    if (!data) return null;
    try {
      if (Array.isArray(data)) {
        return (
          <ul className="list-disc list-inside space-y-1 text-sm">
            {data.map((item, i) => (
              <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</li>
            ))}
          </ul>
        );
      } else if (typeof data === 'object') {
        return (
          <div className="space-y-1 text-sm">
            {Object.entries(data).map(([k, v], i) => (
              <p key={i}>
                <strong className="capitalize">{k.replace(/_/g, ' ')}:</strong> {String(v)}
              </p>
            ))}
          </div>
        );
      }
      return <p>{String(data)}</p>;
    } catch (e) {
      return <p>{JSON.stringify(data)}</p>;
    }
  };

  return (
    <div className=" min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900 dark:via-blue-950 dark:to-gray-900">
      <Navigation />
      {/* Header */}
      <div className="p-8 flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-800 dark:text-gray-200">
          <Wrench className="h-7 w-7 text-blue-600" /> Engineer Dashboard
        </h1>
      </div>

      {/* Actions */}
      <div className="p-8 flex gap-4 mb-6">
        <Button onClick={() => router.push('/predictor')} className="rounded-xl px-6 py-2 shadow-md">
          <FileText className="mr-2 h-4 w-4" /> Predict Fitness
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-8 mx-8 flex items-center gap-2 max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-sm px-3 py-2">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          placeholder="Search jobcards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-0 focus-visible:ring-0 bg-transparent"
        />
      </div>

      {/* Jobcards Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobcards.map((job) => (
          <motion.div
            key={job.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedJob(job)}
            className="cursor-pointer"
          >
            <Card className="shadow-xl rounded-2xl hover:shadow-2xl transition-all bg-white dark:bg-gray-800">
              <CardContent className="p-5">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[70%]">
                    {job.title}
                  </h2>
                  <Badge
                    variant={
                      job.status === 'open'
                        ? 'destructive'
                        : job.status === 'in_progress'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {job.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                  {job.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>Priority {job.priority}</Badge>
                  {job.assigned_to && (
                    <Badge variant="outline">Assigned to {job.assigned_to}</Badge>
                  )}
                </div>
                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Created: {new Date(job.created_at).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredJobcards.length === 0 && (
        <p className="text-gray-500 text-center mt-10">No jobcards found.</p>
      )}

      {/* Modal for job details */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-lg w-full relative"
          >
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-3 text-gray-800 dark:text-gray-100">
              {selectedJob.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {selectedJob.description}
            </p>

            <div className="flex flex-col gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span><strong>Status:</strong> {selectedJob.status}</span>
              <span><strong>Priority:</strong> {selectedJob.priority}</span>
              {selectedJob.assigned_to && (
                <span><strong>Assigned To:</strong> {selectedJob.assigned_to}</span>
              )}
              <span><strong>Created At:</strong> {new Date(selectedJob.created_at).toLocaleString()}</span>
            </div>

            {selectedJob.reasons && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Reasons</h3>
                {formatData(selectedJob.reasons, 'Reasons')}
              </div>
            )}

            {selectedJob.suggested_actions && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Suggested Actions</h3>
                {formatData(selectedJob.suggested_actions, 'Suggested Actions')}
              </div>
            )}

            {selectedJob.meta_info && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Meta Info</h3>
                {formatData(selectedJob.meta_info, 'Meta Info')}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}