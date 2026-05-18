"use client";
import React from "react";

type Props = {
  dashboardUrl?: string; // full grafana URL to dashboard or panel
  height?: string;
};

export default function GrafanaEmbed({
  dashboardUrl = "http://localhost:3001/d/ms_grafana/metrosaathi?orgId=1", // replace after import
  height = "900px",
}: Props) {
  // if Grafana has auth, you'll need a proxy/API key; for local dev with anon viewer this works.
  return (
    <div style={{ width: "100%", height }}>
      <iframe
        title="Grafana Dashboard"
        src={dashboardUrl}
        style={{ border: "0", width: "100%", height: "100%" }}
      />
    </div>
  );
}
