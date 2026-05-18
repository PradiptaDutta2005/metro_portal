"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Navigation from "../navigation/page";
import { Badge } from "@/components/ui/badge";

/* ---------------------
   Types
   --------------------- */
type Metrics = {
  dl_model_accuracy: number;
  dl_model_trained_at: string | null;
  dl_model_exists: boolean;
  rakes_total: number;
  rakes_unfit: number;
  rakes_fit: number;
  engineers_active: number;
  engineer_jobs: { engineer: string; jobs: number }[];
  jobs_pending: number;
};

type Complaint = {
  id: number;
  rake_id: string;
  complaint: string;
  from_location: string;
  to_location: string;
  category?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
};

type JobCard = {
  id: number;
  status: string;
  assigned_to: string | null;
  title: string;
  issues?: string[];
};

type ValidationRecord = {
  id: number;
  rake_identifier: string;
  dl_probability: string;
  issues: string[];
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

const paramLabels: Record<string, string> = {
  h1: "Separator Pressure (H1)",
  dv_pressure: "Dryer Valve Pressure",
  reservoirs: "Reservoir Pressure",
  oil_temperature: "Oil Temperature (°C)",
  motor_current: "Motor Current (A)",
  mpg: "Minimum Pressure Governor",
  oil_level: "Oil Level (%)",
  caudal_impulses: "Air Flow Pulses",
};

/* ---------------------
   Helpers
   --------------------- */
function usePrevious<T>(value: T): T | null {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function pctString(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

// Design system components (non-destructive, just wrappers)
function DashboardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-8 space-y-10">
      {children}
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-lg p-6 space-y-6"
    >
      {(title || description) && (
        <div className="mb-2">
          {title && (
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}

function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      {children}
    </div>
  );
}

/* ---------------------
   Dashboard component
   --------------------- */
export default function DashboardClient() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [history, setHistory] = useState<{ time: string; unfit: number }[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [search] = useState<string>("");
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [loadingComplaints, setLoadingComplaints] = useState<boolean>(false);
  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [loadingJobs, setLoadingJobs] = useState<boolean>(false);
  const [training, setTraining] = useState<boolean>(false);
  const [summary, setSummary] = useState<ValidationRecord[]>([]);
  const [pinnedComplaints, setPinnedComplaints] = useState<number[]>([]);
  const [pinnedJobs, setPinnedJobs] = useState<number[]>([]);
  const [deletedComplaints, setDeletedComplaints] = useState<number[]>([]);
  const [deletedJobs, setDeletedJobs] = useState<number[]>([]);
  // previous values for highlight animation
  const prevMetrics = usePrevious(metrics);

  const handleTrainNow = async (): Promise<void> => {
    setTraining(true);
    try {
      const payload = {
        h1: 10,
        dv_pressure: 20,
        reservoirs: 15,
        oil_temperature: 55,
        motor_current: 5,
        mpg: 5,
        oil_level: 90,
        caudal_impulses: 150,
      };
      const res = await fetch("http://localhost:8000/api/dl_model/train-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        // eslint-disable-next-line no-alert
        alert("Training started with FIT parameters ✅");
      } else {
        // eslint-disable-next-line no-alert
        alert("Training request failed ❌");
      }
    } catch (err) {
      console.error(err);
      // eslint-disable-next-line no-alert
      alert("Error calling training API ❌");
    } finally {
      setTraining(false);
    }
  };

  const togglePinComplaint = (id: number): void => {
    setPinnedComplaints((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const togglePinJob = (id: number): void => {
    setPinnedJobs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  function handleDeleteComplaint(id: number): void {
    setDeletedComplaints((prev) => {
      const updated = [...prev, id];
      localStorage.setItem("deletedComplaints", JSON.stringify(updated));
      return updated;
    });
    setComplaints((prev) => prev.filter((c) => c.id !== id));
  }

  function handleDeleteJob(id: number): void {
    setDeletedJobs((prev) => {
      const updated = [...prev, id];
      localStorage.setItem("deletedJobs", JSON.stringify(updated));
      return updated;
    });
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  /* ---------------------
     Fetch metrics
     --------------------- */
  useEffect(() => {
    let mounted = true;
    const fetchMetrics = async (): Promise<void> => {
      setLoadingMetrics(true);
      try {
        const res = await fetch(
          "http://localhost:8000/api/dl_model/metrics-json"
        );
        const data: Metrics = await res.json();
        if (!mounted) return;
        setMetrics(data);
        setHistory((prev) => [
          ...prev.slice(-20),
          { time: new Date().toLocaleTimeString(), unfit: data.rakes_unfit },
        ]);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      } finally {
        if (mounted) setLoadingMetrics(false);
      }
    };

    void fetchMetrics();
    const id = setInterval(fetchMetrics, 10000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  /* ---------------------
     Fetch complaints
     --------------------- */
  useEffect(() => {
    let mounted = true;
    const fetchComplaints = async (): Promise<void> => {
      setLoadingComplaints(true);
      try {
        const res = await fetch("http://localhost:8000/api/complaints/");
        const data: Complaint[] = await res.json();
        if (!mounted) return;

        data.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        // ✅ Filter out deleted complaints
        const filtered = data.filter((c) => !deletedComplaints.includes(c.id));
        setComplaints(filtered);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      } finally {
        if (mounted) setLoadingComplaints(false);
      }
    };

    void fetchComplaints();
    const id = setInterval(fetchComplaints, 15000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [deletedComplaints]);

  /* Fetch Jobs */
  useEffect(() => {
    let mounted = true;
    const fetchJobs = async (): Promise<void> => {
      setLoadingJobs(true);
      try {
        const res = await fetch(
          "http://localhost:8000/api/job_distributor/jobs"
        );
        const data: JobCard[] = await res.json();
        if (!mounted) return;

        // ✅ Filter out deleted jobs
        const filtered = data.filter((j) => !deletedJobs.includes(j.id));
        setJobs(filtered);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        if (mounted) setLoadingJobs(false);
      }
    };

    void fetchJobs();
    const id = setInterval(fetchJobs, 20000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [deletedJobs]);

  useEffect(() => {
    let isMounted = true;

    const fetchSummary = async (): Promise<void> => {
      try {
        const res = await fetch(
          "http://localhost:8000/api/validation/status-summary"
        );
        if (!res.ok) throw new Error("Failed to fetch summary");

        const data: ValidationRecord[] = await res.json();
        if (isMounted) {
          setSummary(data);
        }
      } catch (err) {
        console.error("Error fetching validation summary:", err);
      }
    };

    void fetchSummary();
    const id = setInterval(fetchSummary, 30000); // refresh every 30s

    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    const storedComplaints = localStorage.getItem("deletedComplaints");
    const storedJobs = localStorage.getItem("deletedJobs");
    if (storedComplaints)
      setDeletedComplaints(JSON.parse(storedComplaints) as number[]);
    if (storedJobs) setDeletedJobs(JSON.parse(storedJobs) as number[]);
  }, []);

  if (!metrics) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-pulse">Loading dashboard…</div>
          <div className="text-sm text-gray-500">
            Connecting to backend metrics
          </div>
        </div>
      </div>
    );
  }

  const {
    engineer_jobs,
    dl_model_exists,
    dl_model_accuracy,
    rakes_unfit,
    rakes_total,
  } = metrics;

  const engineersActive = jobs.length;
  const activeJobsCount = jobs.length;
  const totalEngineers = 70;
  const inactiveEngineers = totalEngineers - engineersActive;

  // search filter
  const filteredComplaints = complaints.filter(
    (c) =>
      c.rake_id.toLowerCase().includes(search.toLowerCase()) ||
      c.complaint.toLowerCase().includes(search.toLowerCase()) ||
      (c.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const sortedComplaints = [...filteredComplaints].sort((a, b) =>
    pinnedComplaints.includes(a.id) && !pinnedComplaints.includes(b.id) ? -1 : 1
  );
  const sortedJobs = [...jobs].sort((a, b) =>
    pinnedJobs.includes(a.id) && !pinnedJobs.includes(b.id) ? -1 : 1
  );

  /* ---------------------
     Small animated stat component
     --------------------- */
  function StatCard({
    title,
    value,
    sub,
    trendUp,
    highlight,
  }: {
    title: string;
    value: string | number | React.ReactNode;
    sub?: string;
    trendUp?: boolean;
    highlight?: boolean;
  }) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {title}
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              {value}
            </div>
          </div>
          <div className="text-right">
            {highlight && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0.3 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35 }}
                className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                  trendUp
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {trendUp ? "▲" : "▼"}
              </motion.div>
            )}
            {sub && <div className="text-xs text-slate-400 mt-2">{sub}</div>}
          </div>
        </div>
      </motion.div>
    );
  }

  /* ---------------------
     Gauge-like bar for model accuracy & unfit %
     --------------------- */
  function LinearGauge({ value, label }: { value: number; label?: string }) {
    const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm font-medium text-slate-700">{label}</div>
          <div className="text-sm font-semibold text-slate-900">{pct}%</div>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  /* ---------------------
     Render
     --------------------- */
  return (
    <DashboardContainer>
      <Navigation />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            StationSync • Monitoring
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Realtime metrics & passenger complaints — updated automatically.
          </p>
        </div>
        <button
          onClick={() => void handleTrainNow()}
          disabled={training}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {training ? "Training…" : "Train Model Now"}
        </button>
        <div className="flex items-center gap-4">
          <div className="text-xs text-slate-500">Last trained:</div>
          <div className="text-sm font-medium text-slate-800">
            {metrics.dl_model_trained_at ?? "—"}
          </div>
        </div>
      </div>

      {/* Top stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Engineers Active"
          value={engineersActive}
          sub={`${inactiveEngineers} idle • Total on duty = ${totalEngineers}`}
          highlight={Boolean(
            prevMetrics && prevMetrics.engineers_active !== engineersActive
          )}
          trendUp={Boolean(
            prevMetrics ? engineersActive > prevMetrics.engineers_active : true
          )}
        />
        <StatCard
          title="Jobs Active"
          value={activeJobsCount}
          sub="Currently assigned to engineers"
          highlight={Boolean(
            prevMetrics &&
              activeJobsCount !== (prevMetrics.engineers_active ?? 0)
          )}
          trendUp={Boolean(
            prevMetrics
              ? activeJobsCount > (prevMetrics.engineers_active ?? 0)
              : true
          )}
        />
        <StatCard
          title="Rakes Unfit"
          value={Math.ceil(rakes_unfit / 10)}
          sub={`${Math.ceil(rakes_total / 10)} total rakes`}
          highlight={Boolean(
            prevMetrics && prevMetrics.rakes_unfit !== rakes_unfit
          )}
          trendUp={Boolean(
            prevMetrics ? rakes_unfit < prevMetrics.rakes_unfit : false
          )}
        />
        <StatCard
          title="DL Model"
          value={dl_model_exists ? "Trained" : "Not trained"}
          sub={
            dl_model_exists
              ? `Val acc ${pctString(dl_model_accuracy)}`
              : "No model file"
          }
          highlight={Boolean(
            prevMetrics && prevMetrics.dl_model_accuracy !== dl_model_accuracy
          )}
          trendUp={Boolean(
            prevMetrics
              ? dl_model_accuracy > prevMetrics.dl_model_accuracy
              : true
          )}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-3">
          Recent Validation Decisions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.map((v) => (
            <div
              key={v.id}
              className="p-4 rounded-lg shadow border bg-gray-50 dark:bg-gray-900"
            >
              <h3 className="text-md font-bold mb-2">
                Rake {v.rake_identifier}
              </h3>
              <p className="text-sm">
                Probability: {Number(v.dl_probability).toFixed(4)}
              </p>
              <p className="text-sm">Issues: {v.issues?.join(", ") || "—"}</p>
              <Badge
                className={
                  v.status === "approved"
                    ? "bg-green-500 text-white"
                    : v.status === "rejected"
                    ? "bg-red-500 text-white"
                    : "bg-yellow-500 text-white"
                }
              >
                {v.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Middle area: gauges + jobs table + time series */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Gauges */}
        <div className="col-span-1 bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">
            Model Accuracy
          </h3>
          <LinearGauge value={dl_model_accuracy} label="Validation accuracy" />
          <div className="my-4" />
        </div>

        {/* Right: Time-series */}
        <div className="col-span-1 bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">
              Unfit Rakes (recent)
            </h3>
            <div className="text-xs text-slate-400">Last 20 points</div>
          </div>
          <div style={{ width: "100%", height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <Line
                  type="monotone"
                  dataKey="unfit"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={false}
                />
                <CartesianGrid stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(value: number) => (value / 10).toString()}
                />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Complaints Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm max-h-160 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Passenger Complaints
          </h2>
          <div className="text-sm text-slate-500">
            {loadingComplaints ? "Refreshing…" : `${complaints.length} total`}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence initial={false}>
            {sortedComplaints.length > 0 ? (
              sortedComplaints.map((c) => (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="border rounded-lg p-4 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-xs text-slate-400">
                        {new Date(c.created_at).toLocaleString()}
                      </div>
                      <div className="text-sm font-semibold text-sky-700 mt-1">
                        Rake: {c.rake_id} • {c.category || "Uncategorized"}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => togglePinComplaint(c.id)}>
                        📌
                      </button>
                      <button
                        onClick={() => handleDeleteComplaint(c.id)}
                        className="text-red-500 text-xs ml-2 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-800">{c.complaint}</p>
                  <div className="mt-3 text-sm text-slate-500">
                    From <span className="font-medium">{c.from_location}</span>{" "}
                    →<span className="font-medium">{c.to_location}</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-slate-500">No complaints found.</div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm max-h-160 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Job Cards</h2>
          <div className="text-sm text-slate-500">
            {loadingJobs ? "Refreshing…" : `${jobs.length} total`}
          </div>
        </div>
        {sortedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedJobs.map((job) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-slate-900">{job.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => togglePinJob(job.id)}>📌</button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="text-red-500 text-xs ml-2 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Assigned to:{" "}
                  {job.assigned_to ? (
                    <span className="font-medium text-slate-800">
                      {job.assigned_to}
                    </span>
                  ) : (
                    "Unassigned"
                  )}
                </p>
                {job.issues && job.issues.length > 0 && (
                  <div className="mt-2 text-xs text-red-600">
                    Issues:{" "}
                    {job.issues
                      .map((issue) => paramLabels[issue] || issue)
                      .join(", ")}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-slate-500 text-sm">No jobs available.</div>
        )}
      </div>
    </DashboardContainer>
  );
}
