
import { json, LoaderFunction, redirect } from '@remix-run/node';
import { searchRecords } from '~/features/Record/Record.api'; // Importa a função de busca
import { mapRecords } from '~/utils/recordMapper'; // Importa a função de mapeamento
import { getSession } from '~/sessions';
import { verifyToken } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token || !await verifyToken(token)) {
    return redirect("/login"); 
  }

  const url = new URL(request.url);
  const clinic = parseInt(url.searchParams.get('clinic') || 'NaN', 10);
  const status = url.searchParams.get('status')?.split(',').map(num => parseInt(num, 10)).filter(num => !isNaN(num)) || [];
  const startDateParam = url.searchParams.get('startDate');
  const endDateParam = url.searchParams.get('endDate');

  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;

  try {
    const records = await searchRecords({
      clinic: !isNaN(clinic) ? clinic : null,
      status: status.length > 0 ? status : null,
      startDate,
      endDate,
    });

    const mappedRecords = mapRecords(records); 

    return json(mappedRecords);
  } catch (error) {
    return json({ error: 'Erro ao buscar registros' }, { status: 500 });
  }
};
