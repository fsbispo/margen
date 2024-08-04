import { Form, useActionData, useNavigate } from '@remix-run/react';
import { ActionFunction, json } from '@remix-run/node';
import { login } from '~/utils/auth.server';
import { getSession } from '~/sessions';
import logo from '~/assets/images/logotipo-margen-med.png';
import ErrorModal from '~/components/modals/Error';
import { useEffect, useState } from 'react';

interface ActionData {
    error?: string;
    user?: {
        token: string;
        name: string;
        type: number;
    };
}

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;

    try {
        const data = await login(name, password);

        const token = data?.token;
        const type = data?.type;

        const session = await getSession(request.headers.get("Cookie"));
        session.set("token", token);

        return json({
            user: {
                token,
                name,
                type,
            },
        });
    } catch (error: any) {
        return json({ error: error.message }, { status: 401 });
    }
};

export default function Login() {
    const actionData = useActionData<ActionData>();
    const navigate = useNavigate();
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

    useEffect(() => {
        if (actionData?.error) {
            setShowErrorModal(true);
        } else if (actionData?.user) {
            setShowErrorModal(false);
            navigate('/home', { replace: true });
        }
    }, [actionData, navigate]);

    const handleFormSubmit = () => {
        setShowErrorModal(false);
    };

    return (
        <div className="flex h-screen">
            <div className="w-1/2 bg-white flex items-center justify-center">
                <img src={logo} alt="Logo" className="" style={{ width: '50%' }} />
            </div>
            <div className="w-1/2 bg-gradient-to-t from-black to-[#EB0100] flex items-center justify-center">
                <Form method="post" className="w-3/5 space-y-4" onSubmit={handleFormSubmit}>
                    <h1 className="text-2xl font-bold mb-14 text-white text-center">LOGIN</h1>
                    <label className="block">
                        <span className="text-white">Usuário</span>
                        <input
                            type="text"
                            name="name"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                        />
                    </label>
                    <div>
                        <label className="block mb-8">
                            <span className="text-white">Senha</span>
                            <input
                                type="password"
                                name="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
                            />
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#5A5A5A] text-white py-2 rounded-md hover:bg-[#292929]"
                    >
                        Entrar
                    </button>
                </Form>
            </div>
            {showErrorModal && <ErrorModal error={actionData?.error} />}
        </div>
    );
}
