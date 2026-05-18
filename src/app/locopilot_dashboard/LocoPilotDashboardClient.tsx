'use client';

import React, { useState } from "react";

export default function LocoPilotDashboardClient() {
  const stations = [
    "Kochi Metro - Aluva",
    "Kochi Metro - Palarivattom",
    "Kochi Metro - MG Road",
    "Kochi Metro - Maharaja's",
    "Kochi Metro - Edapally",
    "Kochi Metro - Kakkanad"
  ];

  const [form, setForm] = useState({
    rake_id: "",
    from_station: "",
    to_station: "",
    reading_time: "",
    remarks: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

    try {
      const payload = {
        rake_id: form.rake_id,
        from_station: form.from_station,
        to_station: form.to_station,
        reading_time: new Date(form.reading_time).toISOString(),
        tcms_reading: '{ "speed": 50, "brake": "OK" }', // default value
        remarks: form.remarks
      };

      const res = await fetch(`${API_BASE}/api/locopilot/readings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }

      const data = await res.json();
      setMessage("✅ Thank you! Reading saved successfully (ID: " + data.rake_id + ")");
      setForm({ rake_id: "", from_station: "", to_station: "", reading_time: "", remarks: "" });

    } catch (err: any) {
      setMessage("❌ Error: " + (err.message || String(err)));
    } finally {
      setSubmitting(false);
    }
  }

return (
  <>
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">LocoPilot Dashboard</h1>
      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block mb-1 font-medium">Rake ID</label>
          <input
            required
            value={form.rake_id}
            onChange={e => update("rake_id", e.target.value)}
            placeholder="Enter Rake ID"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">From Station</label>
            <select
              required
              value={form.from_station}
              onChange={e => update("from_station", e.target.value)}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Station</option>
              {stations.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">To Station</label>
            <select
              required
              value={form.to_station}
              onChange={e => update("to_station", e.target.value)}
              className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Station</option>
              {stations.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Date & Time</label>
          <input
            required
            type="datetime-local"
            value={form.reading_time}
            onChange={e => update("reading_time", e.target.value)}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Remarks</label>
          <textarea
            required
            value={form.remarks}
            onChange={e => update("remarks", e.target.value)}
            placeholder="Enter remarks"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-6 p-4 text-center border rounded-md bg-green-50 text-green-800 font-medium">
          {message}
        </div>
      )}
    </div>
    {/* Footer */}
    <footer className="bg-blue-700 text-white mt-6">
      <div className="max-w-4xl mx-auto py-6 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-xl font-bold">MetroSync</h2>
          <p className="text-sm mt-1">Connecting metro operations efficiently.</p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center">
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <a href="/" className="hover:underline">Home</a>
            </li>
            <li>
              <a href="/locopilot_dashboard" className="hover:underline">Dashboard</a>
            </li>
            
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-end">
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-sm">support@metrosaathi.com</p>
          <p className="text-sm mt-1">+91 98765 43210</p>
          <p className="text-sm mt-1">Kochi, India</p>
        </div>
      </div>

      <div className="border-t border-blue-600 mt-4 pt-4 text-center text-sm">
        © {new Date().getFullYear()} MetroSaathi. All rights reserved.
      </div>
    </footer>
  </>
);
}
