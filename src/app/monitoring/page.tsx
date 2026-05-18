"use client";
export const dynamic = "force-dynamic";

import React, { ReactElement } from "react";

import GrafanaEmbed from "@/components/ui/grafanaembed";

type Props = {
  dashboardUrl: string;
  height?: string;
};

export default function MonitoringPage({ dashboardUrl, height }: Props): ReactElement {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        MetroSaathi Monitoring Dashboard
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <GrafanaEmbed dashboardUrl={dashboardUrl} height={height} />
      </div>
    </div>
  );
}
