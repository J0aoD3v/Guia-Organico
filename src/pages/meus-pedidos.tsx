import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function MeusPedidos() {
  const { data: session, status } = useSession();
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
    return <div>Carregando pedidos...</div>;
  }

  if (!session) {
    return <div>Faça login para ver seus pedidos.</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>Meus Pedidos</h2>
      {pedidos.length === 0 ? (
        <div>Você ainda não fez nenhum pedido este mês.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {pedidos.map((pedido: any) => (
            <li key={pedido._id} style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              background: "#fff"
            }}>
              <div><strong>Nome:</strong> {pedido.nome}</div>
              <div><strong>Status:</strong> {pedido.status}</div>
              <div><strong>Categoria:</strong> {pedido.categoria}</div>
              <div><strong>Fabricante:</strong> {pedido.fabricante}</div>
              <div><strong>Finalidade:</strong> {pedido.finalidade}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                Feito em: {pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : "-"}
              </div>
              {pedido.status === "rejeitado" && pedido.motivoRejeicao && (
                <div style={{ color: "#ef4444", fontSize: 13 }}>
                  Motivo da rejeição: {pedido.motivoRejeicao}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
