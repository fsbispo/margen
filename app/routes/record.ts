import { json } from "@remix-run/node";
import { saveRecord } from "~/features/Record/Record.api";
import { FormFields } from "~/types";
import { Status } from "~/enumerators/Status";

export const action = async ({ request }: { request: Request }) => {
  try {
    const data: FormFields = await request.json();

    // Garantir que entryAt seja uma data válida
    const entryAt = new Date(data.entryAt);
    if (isNaN(entryAt.getTime())) {
      throw new Error("Data e hora inválidas para entryAt");
    }

    // Garantir que confirmedAt e permanence sejam válidos, se estiverem presentes
    const confirmedAt = data.confirmedAt ? new Date(data.confirmedAt) : null;
    const permanence = data.permanence ? new Date(data.permanence) : null;

    // Converter clinic e type para inteiros
    const clinic = parseInt(data.clinic as unknown as string, 10);
    const type = parseInt(data.type as unknown as string, 10);

    if (!data.name || isNaN(clinic) || isNaN(type)) {
      throw new Error("Dados inválidos");
    }

    // Atualizar valores e garantir que observation não seja null ou undefined
    data.type = type;
    data.status = Status.PENDENTE;
    data.entryAt = entryAt;
    data.confirmedAt = confirmedAt;
    data.permanence = permanence;
    data.observation = data.observation ?? ''; // Define observation como string vazia se for null ou undefined

    console.log(data);

    // Salvar o registro
    const record = await saveRecord(data);
    return json(record, { status: 200 });
  } catch (error: any) {
    return json({ error: error.message }, { status: 500 });
  }
};
