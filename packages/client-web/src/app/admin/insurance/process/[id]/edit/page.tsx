import InsuranceProcessForm from "../../../../../../components/admin/InsuranceProcessForm";

export default function EditInsuranceProcessPage({ params }: { params: { id: string } }) {
  return <InsuranceProcessForm editId={params.id} />;
}
