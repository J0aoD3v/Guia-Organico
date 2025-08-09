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
        <form onSubmit={handleSearch} style={{ display: "flex", gap: 8 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pesquise por insumos orgânicos..."
            style={{ flex: 1, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}
          />
          <button type="submit" style={{ padding: "12px 20px", background: "#111827", color: "white", border: 0, borderRadius: 8 }}>BUSCAR</button>
        </form>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button onClick={() => router.push("/categorias")} style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, background: "white", cursor: "pointer" }}>
            Pesquisar por Categorias
          </button>
          <button onClick={() => router.push(`/resultados?q=${encodeURIComponent(q)}`)} style={{ padding: "10px 14px", border: "1px solid #ddd", borderRadius: 8, background: "white", cursor: "pointer" }}>
            Pesquisar por texto ou foto
          </button>
        </div>
      </main>
    </>
  );
}
