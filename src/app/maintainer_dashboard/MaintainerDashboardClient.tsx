"use client";
import { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/navigation";
import { Wrench, LogOut, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Navigation from "../navigation/page";

// ✅ Types
type Jobcard = {
  id: string;
  description: string;
  status: "available" | "assigned" | string;
};

type ValidationRecord = {
  id: number;
  rake_identifier: string;
  dl_probability: string;
  issues: string[];
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const MaintainerDashboardClient = (): ReactElement => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [jobcards, setJobcards] = useState<Jobcard[]>([]);
  const [rakeId, setRakeId] = useState<string>("");
  const [rakeJobcards, setRakeJobcards] = useState<Jobcard[] | null>(null);

  // ✅ new state for validations
  const [validations, setValidations] = useState<ValidationRecord[]>([]);
  const [loadingValidations, setLoadingValidations] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      // Load sample data
      setJobcards([
        {
          id: "JC101",
          description: "Brake inspection pending",
          status: "available",
        },
        { id: "JC102", description: "Oil leakage repair", status: "assigned" },
        {
          id: "JC103",
          description: "Door malfunction check",
          status: "available",
        },
      ]);
    }
  }, [router]);

  const handleRakeSearch = (): void => {
    if (!rakeId) {
      toast.error("Enter a Rake ID first");
      return;
    }

    if (rakeId === "R123") {
      setRakeJobcards([
        {
          id: "JC201",
          description: "Electrical system check",
          status: "available",
        },
        {
          id: "JC202",
          description: "TCMS software update",
          status: "assigned",
        },
      ]);
    } else if (rakeId === "R456") {
      setRakeJobcards([
        { id: "JC301", description: "Wheel alignment", status: "available" },
      ]);
    } else {
      setRakeJobcards([]);
      toast.error("No jobcards found for this Rake ID");
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // ✅ fetch pending validations
  useEffect(() => {
    let mounted = true;
    const fetchValidations = async (): Promise<void> => {
      setLoadingValidations(true);
      try {
        const res = await fetch("http://localhost:8000/api/validation/pending");
        if (!res.ok) throw new Error("Failed to fetch validations");
        const data: ValidationRecord[] = await res.json();
        if (mounted) setValidations(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch validations");
      } finally {
        if (mounted) setLoadingValidations(false);
      }
    };

    fetchValidations();
    const id = setInterval(fetchValidations, 15000); // refresh every 15s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // ✅ approve/reject actions
  const handleValidationAction = async (
    id: number,
    action: "approve" | "reject"
  ): Promise<void> => {
    toast.info(`Sending ${action} request...`);

    try {
      const res = await fetch(
        `http://localhost:8000/api/validation/${id}/${action}`,
        {
          method: "POST",
        }
      );
      if (!res.ok) throw new Error(`Failed to ${action}`);
      toast.success(`Validation ${action}d successfully ✅`);
      // refresh list
      setValidations((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
      toast.error(`❌ Could not ${action} validation`);
    }
  };

  if (!isAuthenticated) return <></>;

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 dark:from-blue-900 dark:via-blue-950 dark:to-gray-900">
      <Navigation />
      <div className="container mt-15 mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wrench className="h-6 w-6 text-blue-600" /> Maintainer Dashboard
          </h1>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>

        {/* Validation Section */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-3">
            Pending Rake Validations
          </h2>
          {loadingValidations ? (
            <p>Loading...</p>
          ) : validations.length === 0 ? (
            <p className="text-sm text-gray-600">No pending validations</p>
          ) : (
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Rake</th>
                  <th>Probability</th>
                  <th>Issues</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {validations.map((v) => (
                  <tr key={v.id}>
                    <td className="p-2">{v.rake_identifier}</td>
                    <td>{Number(v.dl_probability).toFixed(4)}</td>
                    <td>{v.issues?.join(", ") || "—"}</td>
                    <td>
                      <Badge>{v.status}</Badge>
                    </td>
                    <td className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleValidationAction(v.id, "approve")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleValidationAction(v.id, "reject")}
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Check Status Section */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" /> Check Rake Status
          </h2>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter Rake ID (try R123 or R456)"
              value={rakeId}
              onChange={(e) => setRakeId(e.target.value)}
            />
            <Button onClick={handleRakeSearch}>Check</Button>
          </div>

          {rakeJobcards && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">
                Jobcards for Rake {rakeId}
              </h3>
              {rakeJobcards.length > 0 ? (
                <table className="w-full border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">ID</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rakeJobcards.map((job) => (
                      <tr key={job.id}>
                        <td className="p-2">{job.id}</td>
                        <td>{job.description}</td>
                        <td>
                          <Badge>{job.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  No jobcards found.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Pending Jobcards Table */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3">Pending Jobcards</h2>
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">ID</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {jobcards.map((job) => (
                <tr key={job.id}>
                  <td className="p-2">{job.id}</td>
                  <td>{job.description}</td>
                  <td>
                    <Badge>{job.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaintainerDashboardClient;
