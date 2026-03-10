import { EndpointDetailPage } from "@/components/pages/endpoint-detail-page";

export default async function Page({ params }) {
  const { endpointId } = await params;

  return <EndpointDetailPage endpointId={endpointId} />;
}
