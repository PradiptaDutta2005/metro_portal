"use client";
import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

type Job = {
  id: string;
  rakeId: string;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Completed";
};

const mockJobs: Job[] = [
  {
    id: "1",
    rakeId: "R001",
    title: "Brake Inspection",
    description: "Check and report brake system performance.",
    status: "Pending",
  },
  {
    id: "2",
    rakeId: "R001",
    title: "Door Maintenance",
    description: "Lubricate and test all coach doors.",
    status: "In Progress",
  },
  {
    id: "3",
    rakeId: "R002",
    title: "AC Unit Check",
    description: "Verify AC performance and filters.",
    status: "Pending",
  },
  {
    id: "4",
    rakeId: "R003",
    title: "Wheel Alignment",
    description: "Inspect wheel alignment and wear.",
    status: "Completed",
  },
];

export default function EmployeeJobsClient() {
  const [rakeId, setRakeId] = useState<string>("");
  const [jobs, setJobs] = useState<Job[]>([]);

  const handleSearch = (): void => {
    const filtered = mockJobs.filter(
      (job) => job.rakeId.toLowerCase() === rakeId.toLowerCase()
    );
    setJobs(filtered);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRakeId(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-800 dark:via-blue-900 dark:to-blue-950 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
            <ClipboardList className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            Employee Job Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter a Rake ID to view assigned jobs
          </p>
        </div>

        {/* Search Box */}
        <div className="flex gap-4 justify-center">
          <Input
            placeholder="Enter Rake ID (e.g. R001)"
            value={rakeId}
            onChange={handleInputChange}
            className="max-w-xs"
          />
          <Button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Search
          </Button>
        </div>

        {/* Job List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <Card
                key={job.id}
                className="shadow-lg border-0 bg-white dark:bg-gray-800"
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {job.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {job.description}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : job.status === "In Progress"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    }`}
                  >
                    {job.status}
                  </span>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 dark:text-gray-300">
              No jobs found. Please enter a valid Rake ID.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
