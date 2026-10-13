import { Suspense } from "react";
import LlmsTxtAdmin from "../../../components/admin/LlmsTxtAdmin";

export default function LlmsTxtAdminPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-gray-500 min-h-screen">Loading LLMs Context Manager...</div>}>
            <LlmsTxtAdmin />
        </Suspense>
    );
}
