import { useSession, signOut } from "next-auth/react";
import Head from "next/head";

export default function Perfil() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div style={{ padding: 40 }}>Carregando...</div>;
  }

  if (!session) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Você não está logado.</h2>
        <a href="/auth/signin" style={{ color: "#0070f3" }}>Fazer login</a>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Perfil do Usuário - Guia Orgânico</title>
      </Head>
      <div style={{ maxWidth: 400, margin: "60px auto", padding: 24, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2 style={{ marginBottom: 20 }}>Perfil do Usuário</h2>
        <div style={{ marginBottom: 12 }}>
          <strong>Nome:</strong> {session.user?.name || "-"}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Email:</strong> {session.user?.email || "-"}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>ID:</strong> {session.user?.id || "-"}
        </div>
        <div style={{ marginBottom: 12 }}>
          <strong>Permissão:</strong> {session.user?.role || "user"}
        </div>
        <button
          onClick={() => signOut()}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Sair
        </button>
      </div>
    </>
  );
}
