import SecondOpinionForm from "../../../../../components/admin/SecondOpinionForm";

export default function EditSecondOpinionPage({ params }: { params: { id: string } }) {
  return <SecondOpinionForm editId={params.id} />;
}
