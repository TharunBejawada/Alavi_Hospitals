import InsurancePartnerForm from "../../../../../../components/admin/InsurancePartnerForm";

export default function EditInsurancePartnerPage({ params }: { params: { id: string } }) {
  return <InsurancePartnerForm editId={params.id} />;
}
