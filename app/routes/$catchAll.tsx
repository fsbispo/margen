// src/routes/$catchAll.tsx
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";

export function loader() {
  return json({});
}

export default function CatchAll() {
  return (
    <>
      <h1 style={styles.title}>Página não encontrada</h1>
      <p style={styles.message}>Parece que você tentou acessar uma página que não existe.</p>
      <Link to="/" style={styles.homeLink}>Voltar para a página inicial</Link>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f0f0f0',
    color: '#333',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
  },
  homeLink: {
    fontSize: '1rem',
    color: '#007bff',
    textDecoration: 'none',
  },
};
