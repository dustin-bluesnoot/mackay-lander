'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TemplateForm from '@/components/admin/TemplateForm';

export default function EditTemplatePage() {
  const params = useParams();
  const id = params?.id as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/templates/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setTemplate(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-gray-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Edit Template</h1>
      <TemplateForm initialData={template} />
    </div>
  );
}
