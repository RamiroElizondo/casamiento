import { notFound } from 'next/navigation';
import { INVITES } from '@/lib/event';
import Invitation from '@/components/Invitation';

// Solo se generan las 3 rutas conocidas; cualquier otro UUID devuelve 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(INVITES).map((uuid) => ({ uuid }));
}

export default async function InvitePage({ params }) {
  const { uuid } = await params;
  const type = INVITES[uuid];
  if (!type) notFound();
  return <Invitation type={type} />;
}
