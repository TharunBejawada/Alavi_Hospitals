import HealthPackageForm from "../../../../../components/admin/HealthPackageForm";

export default function EditHealthPackagePage({ params }: { params: { id: string } }) {
  return <HealthPackageForm editId={params.id} />;
}
