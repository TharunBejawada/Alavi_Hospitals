"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import InsurancePartnerForm from "../../../../../components/admin/InsurancePartnerForm";
import type { InsurancePartnerType } from "../../../../../../../core/src/types";

function AddInsurancePartnerInner() {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as InsurancePartnerType) || "private";
  return <InsurancePartnerForm type={type} />;
}

export default function AddInsurancePartnerPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-gray-500 min-h-screen">Loading...</div>}>
      <AddInsurancePartnerInner />
    </Suspense>
  );
}
