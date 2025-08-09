import Head from "next/head";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const categorias = [
  {
    nome: "Defensivos Orgânicos",
    descricao: "Produtos para controle de pragas e doenças",
    emoji: "🛡️"
  },
  {
    nome: "Fertilizantes",
    descricao: "Nutrição e adubação para plantas",
    emoji: "🌱"
  },
  {
    nome: "Inoculantes",
    descricao: "Microorganismos benéficos para o solo",
    emoji: "🦠"
  },
  {
    nome: "Adjuvantes",
    descricao: "Produtos que melhoram a eficácia de aplicações",
    emoji: "⚡"
  },
];

export default function Categorias() {
  const { data: session } = useSession();
  const [limitePedidos, setLimitePedidos] = useState<number | null>(null);
  const [pedidosMes, setPedidosMes] = useState<number | null>(null);
  const [creditos, setCreditos] = useState<number | null>(null);

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
        <title>Categorias - Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>
        {/* Breadcrumb */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          marginBottom: "20px",
          color: "#6b7280",
          fontSize: "14px"
        }}>
          <Link href="/" style={{ color: "#0070f3", textDecoration: "none" }}>Início</Link>
          <span>&gt;</span>
          <span>Categorias</span>
        </div>

        <h2 style={{ marginBottom: "8px" }}>📂 Categorias de Insumos</h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          Navegue pelos insumos organizados por categoria para encontrar o que precisa.
        </p>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: 16 
        }}>
          {categorias.map((c) => (
            <Link 
              key={c.nome} 
              href={`/categorias/${encodeURIComponent(c.nome)}`} 
              style={{ 
                border: "1px solid #e5e7eb", 
                padding: 20, 
                borderRadius: 8, 
                textDecoration: "none", 
                color: "inherit",
                transition: "all 0.2s",
                display: "block"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#0070f3";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{c.emoji}</div>
              <h3 style={{ margin: "0 0 8px 0", color: "#111827" }}>{c.nome}</h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>{c.descricao}</p>
              <div style={{ 
                marginTop: "12px", 
                color: "#0070f3", 
                fontSize: "14px",
                fontWeight: "500"
              }}>
                Ver produtos →
              </div>
            </Link>
          ))}
        </div>

        <div style={{ 
          marginTop: "32px",
          padding: "20px", 
          backgroundColor: "#f8fafc", 
          borderRadius: "8px",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{ marginBottom: "12px" }}>💡 Não encontrou o que procura?</h3>
          <p style={{ margin: "0 0 16px 0", color: "#6b7280" }}>
            Use a busca por texto para encontrar produtos específicos ou solicite a autorização de um novo insumo.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <Link 
              href="/buscar"
              style={{
                padding: "8px 16px",
                backgroundColor: "#0070f3",
                color: "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "14px"
              }}
            >
              🔍 Buscar por texto
            </Link>
            <Link 
              href={isSolicitacaoBloqueada ? "#" : "/pedidos/novo"}
              style={{
                padding: "8px 16px",
                backgroundColor: isSolicitacaoBloqueada ? "#d1d5db" : "#10b981",
                color: isSolicitacaoBloqueada ? "#6b7280" : "white",
                textDecoration: "none",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: isSolicitacaoBloqueada ? "not-allowed" : "pointer"
              }}
            >
              📋 {isSolicitacaoBloqueada ? "Créditos Esgotados" : "Solicitar novo insumo"}
            </Link>
            {isSolicitacaoBloqueada && (
              <div style={{ fontSize: "12px", color: "#ef4444", marginTop: "8px" }}>
                Créditos esgotados. Próxima liberação: 01/{new Date().getMonth() + 2}/{new Date().getFullYear()}.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
