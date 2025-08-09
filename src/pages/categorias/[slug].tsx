import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import type { Product } from "../../types/product";

export default function CategoriaLista() {
  const router = useRouter();
  const { slug } = router.query;
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      if (!slug || typeof slug !== "string") return;
      setLoading(true);
      try {
        const res = await fetch(`/api/produtos?categoria=${encodeURIComponent(slug)}`);
        const data = await res.json();
        setItems(data || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return (
    <>
      <Head>
        <title>{slug} - Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 1000, margin: "30px auto", padding: 20 }}>
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
          <Link href="/categorias" style={{ color: "#0070f3", textDecoration: "none" }}>Categorias</Link>
          <span>&gt;</span>
          <span>{slug}</span>
        </div>

        {/* Cabeçalho da categoria */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ marginBottom: "8px" }}>📂 {slug}</h2>
          <p style={{ color: "#6b7280", margin: 0 }}>
            {loading ? "Carregando..." : `${items.length} produto(s) encontrado(s) nesta categoria`}
          </p>
        </div>

        {/* Botões de ação */}
        <div style={{ 
          display: "flex", 
          gap: "12px", 
          marginBottom: "20px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => router.push("/categorias")}
            style={{
              padding: "8px 16px",
              border: "1px solid #ddd",
              background: "white",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            ← Voltar às Categorias
          </button>
          <button
            onClick={() => router.push("/buscar")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            🔍 Nova Busca
          </button>
        </div>

        {/* Resultados */}
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
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📦</div>
            <h3>Nenhum produto encontrado nesta categoria</h3>
            <p>Talvez você queira tentar outras categorias ou fazer uma busca por texto.</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px", justifyContent: "center" }}>
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
                Ver Outras Categorias
              </button>
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
                Buscar por Texto
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
                  transition: "box-shadow 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                <h3 style={{ margin: "0 0 8px 0", color: "#111827" }}>{p.nome}</h3>
                <div style={{ color: "#6b7280", fontSize: 14, marginBottom: "12px" }}>
                  <div><strong>Fabricante:</strong> {p.fabricante || "-"}</div>
                  <div><strong>Categoria:</strong> {p.categoria || "-"}</div>
                  <div><strong>Classe Agronômica:</strong> {p.classeAgronomica || "-"}</div>
                  <div><strong>Autorizado por:</strong> {p.autorizadoPor || "-"}</div>
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
