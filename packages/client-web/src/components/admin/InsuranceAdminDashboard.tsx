"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import InsurancePartnersList from "./InsurancePartnersList";
import InsuranceProcessList from "./InsuranceProcessList";

type TabKey = "government" | "private" | "process";

export default function InsuranceAdminDashboard() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabKey) || "government";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "government", label: "Government-Linked Partners" },
    { key: "private", label: "Private Partners" },
    { key: "process", label: "Cashless Process Tabs" },
  ];

  return (
    <div className="p-6 lg:p-10 bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#5B328C] mb-8">Insurance & TPA Partners</h1>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 font-semibold text-sm rounded-t-xl transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-[#5B328C] border border-b-0 border-gray-200"
                  : "text-gray-500 hover:text-[#5B328C]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "government" && <InsurancePartnersList type="government" />}
        {activeTab === "private" && <InsurancePartnersList type="private" />}
        {activeTab === "process" && <InsuranceProcessList />}
      </div>
    </div>
  );
}
