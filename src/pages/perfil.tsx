import { useSession } from "next-auth/react";
import Head from "next/head";
import UserAvatar from "../components/auth/UserAvatar";
import { useRouter } from "next/router";

export default function Perfil() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
      
      <div style={{ padding: "20px" }}>
        <header style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "40px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "20px"
        }}>
          <h1 
            onClick={() => router.push("/")}
            style={{ cursor: "pointer" }}
          >
            🌱 Guia Orgânico
          </h1>
          <UserAvatar />
        </header>

        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, border: "1px solid #ddd", borderRadius: 8 }}>
          <h2 style={{ marginBottom: 20 }}>Perfil do Usuário</h2>
          
          {session.user?.image && (
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <img
                src={session.user.image}
                alt="Foto do perfil"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #e5e7eb"
                }}
              />
            </div>
          )}
          
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
        </div>
      </div>
    </>
  );
}
