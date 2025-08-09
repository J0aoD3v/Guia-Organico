import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Buscar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/resultados?q=${encodeURIComponent(query)}` : "/resultados");
  }

  return (
    <>
      <Head>
        <title>Pesquisa de Insumos - Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "40px auto", padding: 20 }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>🔍 Pesquisa de Insumos Orgânicos</h2>
        
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: "30px" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquise por insumos orgânicos..."
            style={{ 
              flex: 1, 
              padding: 12, 
              border: "1px solid #ddd", 
              borderRadius: 8,
              fontSize: "16px"
            }}
          />
          <button 
            type="submit" 
            style={{ 
              padding: "12px 20px", 
              background: "#0070f3", 
              color: "white", 
              border: 0, 
              borderRadius: 8,
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold"
            }}
          >
            BUSCAR
          </button>
        </form>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: 16, 
          marginBottom: "30px" 
        }}>
          <button 
            onClick={() => router.push("/categorias")} 
            style={{ 
              padding: "20px", 
              border: "1px solid #10b981", 
              borderRadius: 8, 
              background: "#f0fdf4", 
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>📂</div>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Pesquisar por Categorias</div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Navegue pelos insumos organizados por categoria
            </div>
          </button>
          
          <button 
            onClick={() => {
              if (q.trim()) {
                router.push(`/resultados?q=${encodeURIComponent(q)}`);
              } else {
                router.push("/resultados");
              }
            }} 
            style={{ 
              padding: "20px", 
              border: "1px solid #f59e0b", 
              borderRadius: 8, 
              background: "#fffbeb", 
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>📝</div>
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Pesquisar por texto</div>
            <div style={{ fontSize: "14px", color: "#6b7280" }}>
              Digite o nome do produto ou fabricante acima
            </div>
          </button>
        </div>

        <div style={{ 
          padding: "20px", 
          backgroundColor: "#f8fafc", 
          borderRadius: "8px",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{ marginBottom: "12px" }}>💡 Dicas de Pesquisa</h3>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li>Use palavras-chave como nome do produto, fabricante ou categoria</li>
            <li>Navegue pelas categorias para ver todos os produtos de um tipo</li>
            <li>Clique em "Detalhes" nos resultados para ver informações completas</li>
          </ul>
        </div>
      </main>
    </>
  );
}
