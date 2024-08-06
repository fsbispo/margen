import React, { useEffect, useState } from 'react';
import Relatorio from '~/components/relatoryTable';
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

const RelatorioPage: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = new URL(window.location.href);
                const query = new URLSearchParams(url.search);
                const apiUrl = `/search-records?${query.toString()}`;

                console.log('Fetching:', apiUrl); // Adicione um log para o URL

                const response = await fetch(apiUrl);

                console.log('Response status:', response.status); // Adicione um log para o status da resposta

                if (response.ok) {
                    const result: any[] = await response.json();
                    setData(result);
                } else {
                    const errorText = await response.text(); // Adicione um log para o texto da resposta
                    console.error('Response error:', errorText);
                    setError(`Error: ${response.status}`);
                }
            } catch (error) {
                console.error('Fetch error:', error); // Adicione um log para o erro
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Dependências vazias para rodar apenas uma vez ao montar

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return <Relatorio data={data} />;
};

export default RelatorioPage;
