import { saveRecord } from "~/features/Record/Record.api";
import { FormFields } from "~/types";
import { Status } from "~/enumerators/Status";
import { LoaderFunction, json, redirect } from '@remix-run/node';
import { getSession } from '~/sessions';
import { verifyToken } from '~/utils/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token || !await verifyToken(token)) {
    return redirect("/login"); 
  }

  return null;
};

export const action = async ({ request }: { request: Request }) => {
  try {
    const data: FormFields = await request.json();

    const entryAt = new Date(data.entryAt);
    if (isNaN(entryAt.getTime())) {
      throw new Error("Data e hora inválidas para entryAt");
    }

    const confirmedAt = data.confirmedAt ? new Date(data.confirmedAt) : null;
    let permanence: number | null = null;

    if (confirmedAt) {
      const duration = (confirmedAt.getTime() - entryAt.getTime()) / 1000;
      permanence = Math.round(duration); 
    }

    // Converter clinic e type para inteiros
    const clinic = parseInt(data.clinic as unknown as string, 10);
    const type = parseInt(data.type as unknown as string, 10);

    if (!data.name || isNaN(clinic) || isNaN(type)) {
      throw new Error("Dados inválidos");
    }

    data.type = type;
    data.status = Status.PENDENTE;
    data.entryAt = entryAt;
    data.confirmedAt = confirmedAt;
    data.permanence = permanence; // Definido como número de segundos ou null
    data.observation = data.observation ?? ''; // Define observation como string vazia se for null ou undefined

    // Salvar o registro
    const record = await saveRecord(data);
    return json(record, { status: 200 });
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
};
