import { json, LoaderFunction, redirect } from '@remix-run/node';
import { RecordApi } from '~/features/Record';
import { Clinic } from '~/enumerators/Clinic';
import { mapRecords } from '~/utils/recordMapper'; 
import { getSession } from '~/sessions';
import { verifyToken } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token || !await verifyToken(token)) {
    return redirect("/login"); 
  }

  const url = new URL(request.url);
  const type = parseInt(url.searchParams.get('type') || '0', 10);

  try {
    let records;

    if (type === Clinic.GERAL) {
      records = await RecordApi.getRecords();
    } else {
      records = await RecordApi.getRecordsByClinic(type);
    }

    const mappedRecords = mapRecords(records);
    
    return json(mappedRecords);
  } catch (error) {
    return json({ error: 'Erro ao buscar dados' }, { status: 500 });
  }
};