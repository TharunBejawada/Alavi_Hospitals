import { Suspense } from "react";
import InsuranceAdminDashboard from "../../../components/admin/InsuranceAdminDashboard";

export default function InsuranceAdminPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500 min-h-screen">Loading...</div>}>
      <InsuranceAdminDashboard />
    </Suspense>
  );
}
