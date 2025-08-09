import Head from "next/head";
import { useSession } from "next-auth/react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import UserAvatar from "../../components/auth/UserAvatar";
import { useRouter } from "next/router";

export default function AdminPanel() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <ProtectedRoute requiredRole="admin">
      <Head>
        <title>Painel Admin - Guia Orgânico</title>
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
            🌱 Guia Orgânico - Admin
          </h1>
          <UserAvatar />
        </header>

        <main>
          <div style={{ marginBottom: "30px" }}>
            <h2>Bem-vindo, {session?.user?.name || session?.user?.email}!</h2>
            <p style={{ color: "#666" }}>
              Painel administrativo para gestão de produtos, usuários e solicitações.
            </p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px"
          }}>
            <div style={{ 
              padding: "20px", 
              border: "1px solid #10b981", 
              borderRadius: "8px",
              backgroundColor: "#f0fdf4"
            }}>
              <h3>📦 Gerenciar Produtos</h3>
              <p>Adicionar, editar e remover produtos do catálogo.</p>
              <button style={{
                padding: "8px 16px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px"
              }}>
                Acessar (Em breve)
              </button>
            </div>

            <div style={{ 
              padding: "20px", 
              border: "1px solid #3b82f6", 
              borderRadius: "8px",
              backgroundColor: "#eff6ff"
            }}>
              <h3>👥 Gerenciar Usuários</h3>
              <p>Administrar contas de usuários e permissões.</p>
              <button style={{
                padding: "8px 16px",
                backgroundColor: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px"
              }}>
                Acessar (Em breve)
              </button>
            </div>

            <div style={{ 
              padding: "20px", 
              border: "1px solid #f59e0b", 
              borderRadius: "8px",
              backgroundColor: "#fffbeb"
            }}>
              <h3>📋 Solicitações</h3>
              <p>Revisar e aprovar solicitações de autorização.</p>
              <button style={{
                padding: "8px 16px",
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px"
              }}>
                Acessar (Em breve)
              </button>
            </div>

            <div style={{ 
              padding: "20px", 
              border: "1px solid #8b5cf6", 
              borderRadius: "8px",
              backgroundColor: "#faf5ff"
            }}>
              <h3>📊 Relatórios</h3>
              <p>Visualizar estatísticas e métricas do sistema.</p>
              <button style={{
                padding: "8px 16px",
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px"
              }}>
                Acessar (Em breve)
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
