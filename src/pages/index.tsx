import Head from "next/head";
import Link from "next/link";
import UserAvatar from "../components/auth/UserAvatar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
    const [limitePedidos, setLimitePedidos] = useState<number | null>(null);
    const [pedidosMes, setPedidosMes] = useState<number | null>(null);
    const [creditos, setCreditos] = useState<number | null>(null);
    const [nextCycleDate, setNextCycleDate] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDados() {
      try {
        const [resPedidos, resLimite, resUsuario] = await Promise.all([
          fetch(`/api/pedidos?email=${session?.user?.email}`),
          fetch(`/api/configuracoes`),
          fetch(`/api/usuarios`)
        ]);

        const pedidosData = await resPedidos.json();
        const limiteData = await resLimite.json();
        const usuariosData = await resUsuario.json();
        const usuarioAtual = usuariosData.find((u: any) => u.email === session?.user?.email);

        setPedidosMes(pedidosData.count ?? 0);
        setLimitePedidos(limiteData.limitePedidos ?? 5);
        setCreditos(usuarioAtual?.creditos ?? null);
      } catch (err) {
        console.error("Erro ao buscar dados de pedidos e limite:", err);
      }
    }

    if (session) {
      fetchDados();
    }
  }, [session]);

  const isSolicitacaoBloqueada = creditos !== null && creditos <= 0;

  return (
    <>
      <Head>
        <title>Guia Orgânico</title>
        <meta name="description" content="Plataforma para produtores e certificadoras de agricultura orgânica" />
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
          <h1>🌱 Guia Orgânico</h1>
          <UserAvatar />
            const pedidosData = await resPedidos.json();
            const limiteData = await resLimite.json();
            const usuariosData = await resUsuario.json();
            const resCiclo = await fetch(`/api/ciclo`);
            const cicloData = await resCiclo.json();
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            setPedidosMes(pedidosData.count ?? 0);
            setLimitePedidos(limiteData.limitePedidos ?? 5);
            setCreditos(usuarioAtual?.creditos ?? null);
            setNextCycleDate(cicloData.nextCycleDate ?? null);
          </p>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "40px"
          }}>
            <Link href="/insumos" style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
              transition: "border-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#059669"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#ddd"}
            >
              <h3>🌱 Todos os Insumos</h3>
              <p>Explore todo o catálogo de insumos com filtros avançados.</p>
              <button style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#059669",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                Ver Todos
              </button>
            </Link>

            <div style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              cursor: isSolicitacaoBloqueada ? "not-allowed" : "pointer",
              transition: "border-color 0.2s",
              backgroundColor: isSolicitacaoBloqueada ? "#f3f4f6" : "transparent"
            }}
            onMouseEnter={(e) => {
              if (!isSolicitacaoBloqueada) e.currentTarget.style.borderColor = "#10b981";
            }}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#ddd"}
            >
              <h3>📋 Solicitações</h3>
              <p>Solicite autorização de novos insumos diretamente às certificadoras.</p>
              <button disabled={isSolicitacaoBloqueada} style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: isSolicitacaoBloqueada ? "#d1d5db" : "#10b981",
                color: isSolicitacaoBloqueada ? "#6b7280" : "white",
                border: "none",
                borderRadius: "4px",
                cursor: isSolicitacaoBloqueada ? "not-allowed" : "pointer"
              }}>
                {isSolicitacaoBloqueada ? "Créditos Esgotados" : "Solicitar Agora"}
              </button>
              {isSolicitacaoBloqueada && (
                <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "8px" }}>
                  Créditos esgotados. Próxima liberação: 01/{new Date().getMonth() + 2}/{new Date().getFullYear()}.
                </div>
              )}
            </div>

            <Link href="/sobre" style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
              transition: "border-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#8b5cf6"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#ddd"}
            >
              <h3>ℹ️ Sobre o App</h3>
              <p>Conheça mais sobre nossa plataforma e propósito.</p>
              <button style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                Saiba Mais
              </button>
            </Link>
          </div>
        </header>
      </div>
    </>
  );
}