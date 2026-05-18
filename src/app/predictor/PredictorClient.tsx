"use client";
import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";

/* ---------------------
   Module Augmentation
   --------------------- */
declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: { finalY: number };
  }
}

/* ---------------------
   Types
   --------------------- */
const paramOrder = [
  "id",
  "H1",
  "DV_pressure",
  "Reservoirs",
  "Oil_temperature",
  "Motor_current",
  "COMP",
  "DV_electric",
  "Towers",
  "MPG",
  "LPS",
  "Pressure_switch",
  "Oil_level",
  "Caudal_impulses",
  "engineer",
] as const;

type ParamKey = (typeof paramOrder)[number];

type FormType = {
  [key in ParamKey]: string;
};

interface ReportLine {
  param: string;
  entered: string | number;
  standard: string | string[] | [string, string];
  status: string;
}

interface Report {
  rakeId: string;
  engineer: string;
  overall_status: string;
  report_lines: ReportLine[];
  maintenance_actions: ReportLine[];
}

interface ApiResponse {
  report: Report;
}

/* ---------------------
   Component
   --------------------- */
export default function PredictorClient() {
  const [form, setForm] = useState<FormType>(
    paramOrder.reduce(
      (acc, param) => ({ ...acc, [param]: "" }),
      {} as FormType
    )
  );

  const [result, setResult] = useState<ApiResponse | null>(null);

  const dropdownOptions: Record<string, string[]> = {
    COMP: ["OK", "NOT_OK"],
    DV_electric: ["ON", "OFF"],
    Towers: ["OK", "NOT_OK"],
    LPS: ["Low", "Normal", "High"],
    Pressure_switch: ["ON", "OFF"],
  };

  const numericFields: ParamKey[] = [
    "H1",
    "DV_pressure",
    "Reservoirs",
    "Oil_temperature",
    "Motor_current",
    "MPG",
    "Oil_level",
    "Caudal_impulses",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Record<string, string | number> = {};
    paramOrder.forEach((param) => {
      payload[param] = numericFields.includes(param)
        ? parseFloat(form[param])
        : form[param];
    });

    try {
      const res = await fetch("http://localhost:8000/api/dl_model/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const data: ApiResponse = await res.json();
      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Predictor error:", err.message);
      } else {
        console.error("Predictor unknown error:", err);
      }
      alert("Error sending request");
    }
  };

  const renderStatus = (status: string) => {
    const statusMap: Record<string, { color: string; icon: string }> = {
      OK: { color: "text-green-700", icon: "✔️" },
      NOT_OK: { color: "text-red-700", icon: "❌" },
      ON: { color: "text-green-700", icon: "🔛" },
      OFF: { color: "text-gray-600", icon: "⏹️" },
      Low: { color: "text-yellow-600", icon: "⚠️" },
      Normal: { color: "text-green-700", icon: "✔️" },
      High: { color: "text-red-700", icon: "❗" },
      Good: { color: "text-green-700", icon: "✔️" },
      Bad: { color: "text-red-700", icon: "❌" },
      FIT: { color: "text-green-700", icon: "✅" },
      UNFIT: { color: "text-red-700", icon: "❌" },
    };
    const s = statusMap[status] || { color: "text-gray-800", icon: "" };
    return (
      <span
        className={`inline-flex items-center space-x-1 font-semibold ${s.color}`}
      >
        <span>{s.icon}</span>
        <span>{status}</span>
      </span>
    );
  };

  const generatePDF = () => {
    if (!result) return;

    const { report } = result;
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Kochi Metro powered by Metro Minds", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.text("Rake Fitness Report", 105, 30, { align: "center" });

    doc.setFontSize(13);
    doc.setFont("helvetica", "normal");
    doc.text(`Rake ID: ${report.rakeId}`, 14, 42);
    doc.text(`Engineer: ${report.engineer}`, 14, 50);
    doc.text(`Overall Status: ${report.overall_status}`, 14, 58);

    // Table
    const tableColumn = ["Parameter", "Entered", "Standard", "Status"];
    const tableRows: (string | number)[][] = [];

    report.report_lines.forEach((line) => {
      tableRows.push([
        line.param.replace(/_/g, " "),
        line.entered.toString(),
        Array.isArray(line.standard)
          ? line.standard.join(" / ")
          : line.standard,
        line.status,
      ]);
    });

    autoTable(doc, {
      startY: 65,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 12 },
      headStyles: {
        fillColor: [37, 99, 235],
        textColor: 255,
        fontStyle: "bold",
      },
      theme: "grid",
    } as UserOptions);

    let finalY = doc.lastAutoTable?.finalY ?? 65;
    finalY += 12;

    // Maintenance actions
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Maintenance Actions Required:", 14, finalY);
    doc.setFont("helvetica", "normal");
    finalY += 8;

    if (report.maintenance_actions.length > 0) {
      report.maintenance_actions.forEach((a) => {
        const text = `- Inspect and rectify ${a.param} → ${a.entered} (Does not meet standard)`;
        doc.text(text, 16, finalY);
        finalY += 8;
      });
    } else {
      doc.text("- None", 16, finalY);
      finalY += 8;
    }

    // Recommended job card
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Recommended Job Card:", 14, finalY);
    doc.setFont("helvetica", "normal");
    finalY += 8;

    if (report.maintenance_actions.length > 0) {
      report.maintenance_actions.forEach((a) => {
        const standardText = Array.isArray(a.standard)
          ? a.standard.join(" / ")
          : String(a.standard);
        const text = `• Task: Service/Check ${a.param} | Standard: ${standardText} | Entered: ${a.entered}`;
        doc.text(text, 16, finalY);
        finalY += 8;
      });
    } else {
      doc.text("• None", 16, finalY);
      finalY += 8;
    }

    doc.setFontSize(11);
    doc.setTextColor(120);
    doc.text(
      "=======================================================",
      105,
      finalY + 12,
      { align: "center" }
    );

    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `${report.rakeId || "rake"}_${dateStr}.pdf`;

    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white font-sans text-gray-900">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800 drop-shadow-md">
          Rake Fitness Report Generator
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-xl shadow-lg"
        >
          {paramOrder.map((param) => (
            <div key={param} className="flex flex-col">
              <label
                htmlFor={param}
                className="mb-2 font-semibold text-gray-800 capitalize select-none"
              >
                {param.replace(/_/g, " ")}
              </label>
              {dropdownOptions[param] ? (
                <select
                  id={param}
                  name={param}
                  value={form[param]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                  required
                >
                  <option value="">Select {param}</option>
                  {dropdownOptions[param].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={param}
                  type={numericFields.includes(param) ? "number" : "text"}
                  name={param}
                  value={form[param]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
                  required
                  step={numericFields.includes(param) ? "any" : undefined}
                  placeholder={
                    numericFields.includes(param)
                      ? "Enter a number"
                      : "Enter value"
                  }
                />
              )}
            </div>
          ))}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 focus:bg-blue-900 text-white font-bold py-4 rounded-xl shadow-lg transition duration-300"
            >
              Predict & Generate Report
            </button>
          </div>
        </form>

        {/* Result */}
        {result && (
          <>
            <section className="mt-12 bg-white p-8 rounded-xl shadow-inner font-mono text-base text-gray-900 leading-relaxed">
              <h2 className="text-3xl font-bold mb-6 text-center text-blue-800 drop-shadow-sm">
                ================= Rake Fitness Report =================
              </h2>
              <div className="mb-6 space-y-2">
                <p>
                  <span className="font-semibold">🚆 Rake ID:</span>{" "}
                  {result.report.rakeId}
                </p>
                <p>
                  <span className="font-semibold">Engineer:</span>{" "}
                  {result.report.engineer}
                </p>
                <p>
                  <span className="font-semibold">Overall Status:</span>{" "}
                  {renderStatus(result.report.overall_status)}
                </p>
              </div>

              {/* Table */}
              <h3 className="font-semibold mb-3 border-b border-gray-300 pb-2 text-lg">
                📊 Input Readings vs Standards:
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-base">
                  <thead>
                    <tr className="bg-blue-200 text-blue-900">
                      <th className="py-3 px-4 border border-blue-300">
                        Parameter
                      </th>
                      <th className="py-3 px-4 border border-blue-300">
                        Entered
                      </th>
                      <th className="py-3 px-4 border border-blue-300">
                        Standard
                      </th>
                      <th className="py-3 px-4 border border-blue-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.report.report_lines.map((line, idx) => (
                      <tr
                        key={line.param}
                        className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                      >
                        <td className="py-3 px-4 border border-blue-300 font-medium capitalize">
                          {line.param.replace(/_/g, " ")}
                        </td>
                        <td className="py-3 px-4 border border-blue-300">
                          {line.entered}
                        </td>
                        <td className="py-3 px-4 border border-blue-300">
                          {Array.isArray(line.standard)
                            ? line.standard.join(" / ")
                            : line.standard}
                        </td>
                        <td className="py-3 px-4 border border-blue-300">
                          {renderStatus(line.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Maintenance actions */}
              <h3 className="font-semibold mt-8 mb-3 border-b border-gray-300 pb-2 text-lg">
                ⚠️ Maintenance Actions Required:
              </h3>
              {result.report.maintenance_actions.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-red-700 text-lg">
                  {result.report.maintenance_actions.map((a) => (
                    <li key={a.param}>
                      Inspect and rectify{" "}
                      <span className="font-semibold">
                        {a.param.replace(/_/g, " ")}
                      </span>{" "}
                      → <span className="font-mono">{a.entered}</span> (Does not
                      meet standard)
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-700 font-semibold text-lg">
                  No maintenance actions required. All parameters meet standards.
                </p>
              )}

              {/* Job card */}
              <h3 className="font-semibold mt-8 mb-3 border-b border-gray-300 pb-2 text-lg">
                🛠 Recommended Job Card:
              </h3>
              {result.report.maintenance_actions.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-lg">
                  {result.report.maintenance_actions.map((a) => (
                    <li key={a.param}>
                      <span className="font-semibold">Task:</span>{" "}
                      Service/Check{" "}
                      <span className="capitalize">
                        {a.param.replace(/_/g, " ")}
                      </span>{" "}
                      | <span className="font-semibold">Standard:</span>{" "}
                      {Array.isArray(a.standard)
                        ? a.standard.join(" / ")
                        : String(a.standard)}{" "}
                      | <span className="font-semibold">Entered:</span>{" "}
                      {a.entered}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-green-700 font-semibold text-lg">
                  No job card tasks recommended.
                </p>
              )}

              <p className="mt-8 text-center text-gray-500 font-mono text-sm">
                =======================================================
              </p>
            </section>

            {/* Download button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={generatePDF}
                className="bg-green-700 hover:bg-green-800 focus:bg-green-900 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition duration-300 text-lg"
                aria-label="Download Report PDF"
              >
                📥 Download Report PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
