import VaccineForm from "../../../../../components/admin/VaccineForm";

export default function EditVaccinePage({ params }: { params: { id: string } }) {
  return <VaccineForm editId={params.id} />;
}
