import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import type { Product } from "../../types/product";

export default function DetalheInsumo() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id || typeof id !== "string") return;
      setLoading(true);
      try {
        const res = await fetch(`/api/produtos?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        const found = Array.isArray(data) ? data.find((x: any) => x._id === id) : data;
        setItem(found || null);
      } catch (e) {
        setItem(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  return (
    <>
      <Head>
        <title>{item?.nome || "Detalhes do Insumo"} - Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 800, margin: "30px auto", padding: 20 }}>
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
        ) : !item ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px",
            color: "#6b7280"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
            <h3>Produto não encontrado</h3>
            <p>O insumo que você está procurando não foi encontrado.</p>
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
          <div>
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
              {item.categoria && (
                <>
                  <Link href={`/categorias/${encodeURIComponent(item.categoria)}`} style={{ color: "#0070f3", textDecoration: "none" }}>
                    {item.categoria}
                  </Link>
                  <span>&gt;</span>
                </>
              )}
              <span>{item.nome}</span>
            </div>

            {/* Cabeçalho */}
            <div style={{ marginBottom: "24px" }}>
              <h1 style={{ 
                margin: "0 0 8px 0", 
                color: "#111827",
                fontSize: "28px" 
              }}>
                {item.nome}
              </h1>
              {item.categoria && (
                <span style={{ 
                  backgroundColor: "#eff6ff", 
                  color: "#1d4ed8", 
                  padding: "4px 8px", 
                  borderRadius: "4px", 
                  fontSize: "12px",
                  fontWeight: "500"
                }}>
                  {item.categoria}
                </span>
              )}
            </div>

            {/* Informações detalhadas */}
            <div style={{ 
              border: "1px solid #e5e7eb", 
              borderRadius: "8px", 
              padding: "24px",
              backgroundColor: "#f9fafb"
            }}>
              <h3 style={{ margin: "0 0 16px 0", color: "#111827" }}>📋 Informações do Produto</h3>
              
              <div style={{ display: "grid", gap: "12px" }}>
                <div style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
                  <div style={{ fontWeight: "600", width: "140px", color: "#374151" }}>Fabricante:</div>
                  <div style={{ color: "#6b7280" }}>{item.fabricante || "Não informado"}</div>
                </div>
                
                <div style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
                  <div style={{ fontWeight: "600", width: "140px", color: "#374151" }}>Categoria:</div>
                  <div style={{ color: "#6b7280" }}>{item.categoria || "Não informado"}</div>
                </div>
                
                <div style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
                  <div style={{ fontWeight: "600", width: "140px", color: "#374151" }}>Classe Agronômica:</div>
                  <div style={{ color: "#6b7280" }}>{item.classeAgronomica || "Não informado"}</div>
                </div>
                
                <div style={{ display: "flex", padding: "8px 0", borderBottom: "1px solid #e5e7eb" }}>
                  <div style={{ fontWeight: "600", width: "140px", color: "#374151" }}>Autorizado por:</div>
                  <div style={{ color: "#6b7280" }}>{item.autorizadoPor || "Não informado"}</div>
                </div>
                
                <div style={{ display: "flex", padding: "8px 0" }}>
                  <div style={{ fontWeight: "600", width: "140px", color: "#374151" }}>Certificação:</div>
                  <div style={{ color: "#6b7280" }}>{item.certificacao || "Não informado"}</div>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div style={{ 
              marginTop: "24px", 
              display: "flex", 
              gap: "12px",
              flexWrap: "wrap"
            }}>
              <button 
                onClick={() => router.back()} 
                style={{ 
                  padding: "10px 16px", 
                  border: "1px solid #ddd", 
                  background: "white", 
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                ← Voltar
              </button>
              
              <button
                onClick={() => router.push("/buscar")}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#0070f3",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                🔍 Nova Busca
              </button>

              {item.categoria && (
                <button
                  onClick={() => router.push(`/categorias/${encodeURIComponent(item.categoria)}`)}
                  style={{
                    padding: "10px 16px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  📂 Ver Categoria
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
