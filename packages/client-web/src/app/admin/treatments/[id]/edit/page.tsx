import TreatmentForm from "../../../../../components/admin/TreatmentForm";

export default function EditTreatmentPage({ params }: { params: { id: string } }) {
  return <TreatmentForm editId={params.id} />;
}
