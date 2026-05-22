export interface ContactData {
  firstName: string;
  lastName: string;
  company: string;
  title: string;
  phone: string;
}

export async function lookupContactByEmail(email: string): Promise<ContactData | null> {
  const apiKey = process.env.HUBSPOT_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [{ propertyName: 'email', operator: 'EQ', value: email }],
          },
        ],
        properties: ['firstname', 'lastname', 'company', 'jobtitle', 'phone'],
        limit: 1,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.results?.length) return null;

    const props = data.results[0].properties;
    return {
      firstName: props.firstname || '',
      lastName: props.lastname || '',
      company: props.company || '',
      title: props.jobtitle || '',
      phone: props.phone || '',
    };
  } catch {
    return null;
  }
}
