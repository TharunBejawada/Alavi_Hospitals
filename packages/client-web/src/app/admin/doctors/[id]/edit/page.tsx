import DoctorForm from "../../../../../components/admin/DoctorForm";

// Next.js passes the [id] from the URL directly into params
export default function EditDoctorPage({ params }: { params: { id: string } }) {
  return <DoctorForm editId={params.id} />;
}