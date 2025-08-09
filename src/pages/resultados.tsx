import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import Link from "next/link";
import type { Product } from "../types/product";

export default function Resultados() {
  const router = useRouter();
  const { q } = router.query;
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (typeof q === "string" && q.trim()) params.set("q", q);
        const res = await fetch(`/api/produtos?${params.toString()}`);
        const data = await res.json();
        setItems(data || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [q]);

  return (
    <>
      <Head>
        <title>Resultados da Busca - Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 1000, margin: "30px auto", padding: 20 }}>
        {/* Breadcrumb e navegação */}
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
          <Link href="/buscar" style={{ color: "#0070f3", textDecoration: "none" }}>Pesquisar</Link>
          <span>&gt;</span>
          <span>Resultados</span>
          {typeof q === "string" && q.trim() && (
            <>
              <span>&gt;</span>
              <span>"{q}"</span>
            </>
          )}
        </div>

        {/* Barra de pesquisa refinada */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <input
            defaultValue={typeof q === "string" ? q : ""}
            placeholder="Refinar busca..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value = (e.target as HTMLInputElement).value;
                router.push(`/resultados?q=${encodeURIComponent(value)}`);
              }
            }}
            style={{ 
              flex: 1, 
              padding: 12, 
              border: "1px solid #ddd", 
              borderRadius: 8,
              fontSize: "16px"
            }}
          />
          <button 
            onClick={() => router.push("/buscar")} 
            style={{ 
              padding: "12px 16px", 
              border: "1px solid #ddd", 
              background: "white", 
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            🔍 Nova Busca
          </button>
        </div>

        {/* Resultados */}
        <div style={{ marginBottom: "16px" }}>
          <h2 style={{ marginBottom: "8px" }}>
            {typeof q === "string" && q.trim() 
              ? `Resultados para "${q}"` 
              : "Todos os Insumos"
            }
          </h2>
          <p style={{ color: "#6b7280", margin: 0 }}>
            {loading ? "Carregando..." : `${items.length} resultado(s) encontrado(s)`}
          </p>
        </div>

        {loading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "200px",
            fontSize: "18px",
            color: "#6b7280"
          }}>
            🔄 Carregando...
          </div>
        ) : items.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px",
            color: "#6b7280"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3>Nenhum resultado encontrado</h3>
            <p>Tente usar outras palavras-chave ou navegar pelas categorias.</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => router.push("/buscar")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Nova Busca
              </button>
              <button
                onClick={() => router.push("/categorias")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Ver Categorias
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {items.map((p) => (
              <div 
                key={p._id} 
                style={{ 
                  border: "1px solid #e5e7eb", 
                  borderRadius: 8, 
                  padding: 16,
                  transition: "box-shadow 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                <h3 style={{ margin: "0 0 8px 0", color: "#111827" }}>{p.nome}</h3>
                <div style={{ color: "#6b7280", fontSize: 14, marginBottom: "12px" }}>
                  <div><strong>Fabricante:</strong> {p.fabricante || "-"}</div>
                  <div><strong>Categoria:</strong> {p.categoria || "-"}</div>
                  <div><strong>Certificação:</strong> {p.certificacao || "-"}</div>
                </div>
                <button 
                  onClick={() => router.push(`/insumos/${p._id}`)} 
                  style={{ 
                    padding: "8px 12px", 
                    background: "#0070f3", 
                    color: "white", 
                    border: 0, 
                    borderRadius: 6,
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Ver Detalhes
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
