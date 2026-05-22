'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PartnerForm from '@/components/admin/PartnerForm';

interface PartnerData {
  id: string;
  name: string;
  tier: string;
  shortDescription: string;
  offerDetails: string | null;
  learnMoreUrl: string | null;
  logoUrl: string | null;
  active: boolean;
}

export default function EditPartnerPage() {
  const params = useParams();
  const id = params?.id as string;
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/partners/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setPartner(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Edit Partner</h1>
      <PartnerForm initialData={partner} />
    </div>
  );
}
