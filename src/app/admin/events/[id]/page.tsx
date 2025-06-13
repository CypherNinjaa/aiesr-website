import EventForm from "@/components/admin/EventForm";

interface EditEventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  return <EventForm eventId={id} />;
}
