import { ActionFunction, json } from '@remix-run/node';
import { RecordApi } from '~/features/Record';

export const action: ActionFunction = async ({ request }) => {
    const { id } = await request.json();

    try {
        const record = await RecordApi.confirmRecord(id);
        if (record) {
            return json({ success: true });
        } else {
            return json({ success: false, message: 'Registro não encontrado' }, { status: 404 });
        }
    } catch (error) {
        return json({ success: false, message: 'Erro ao confirmar o registro' }, { status: 500 });
    }
};
