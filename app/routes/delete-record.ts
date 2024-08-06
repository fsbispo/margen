import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { RecordApi } from '~/features/Record';
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

export const action: ActionFunction = async ({ request }) => {
    const { id } = await request.json();

    try {
        await RecordApi.deleteRecord(id);
        
        return json({ success: true, message: 'Registro excluído com sucesso' });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Erro desconhecido';
        return json({ success: false, message: errorMessage }, { status: 500 });
    }
};
