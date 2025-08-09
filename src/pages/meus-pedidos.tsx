import { useSession } from "next-auth/react";
import Head from "next/head";
import UserAvatar from "../components/auth/UserAvatar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MeusPedidos() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPedidos() {
      if (session?.user?.email) {
        setLoading(true);
        const res = await fetch(`/api/pedidos?email=${session.user.email}`);
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    }
    fetchPedidos();
  }, [session?.user?.email]);

  if (status === "loading" || loading) {
    return <div style={{ padding: 40 }}>Carregando pedidos...</div>;
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
        <title>Meus Pedidos - Guia Orgânico</title>
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

        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24, border: "1px solid #ddd", borderRadius: 8, background: "#fff" }}>
          <h2 style={{ marginBottom: 20 }}>Meus Pedidos</h2>
          {pedidos.length === 0 ? (
            <div style={{ color: "#6b7280" }}>Você ainda não fez nenhum pedido este mês.</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {pedidos.map((pedido: any) => (
                <li key={pedido._id} style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12,
                  background: pedido.status === "rejeitado" ? "#fef2f2" : "#f9fafb",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{pedido.nome}</span>
                    <span style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      background: pedido.status === "aprovado" ? "#d1fae5" : pedido.status === "rejeitado" ? "#fee2e2" : "#e0e7ff",
                      color: pedido.status === "aprovado" ? "#065f46" : pedido.status === "rejeitado" ? "#b91c1c" : "#3730a3"
                    }}>{pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}</span>
                  </div>
                  <div style={{ marginBottom: 6 }}><strong>Categoria:</strong> {pedido.categoria}</div>
                  <div style={{ marginBottom: 6 }}><strong>Fabricante:</strong> {pedido.fabricante}</div>
                  <div style={{ marginBottom: 6 }}><strong>Finalidade:</strong> {pedido.finalidade}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                    Feito em: {pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : "-"}
                  </div>
                  {pedido.status === "rejeitado" && pedido.motivoRejeicao && (
                    <div style={{ color: "#ef4444", fontSize: 13, marginTop: 6 }}>
                      Motivo da rejeição: {pedido.motivoRejeicao}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
