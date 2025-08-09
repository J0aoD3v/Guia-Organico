import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
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
        const res = await fetch(`/api/products?${params.toString()}`);
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
            style={{ flex: 1, padding: 12, border: "1px solid #ddd", borderRadius: 8 }}
          />
          <button onClick={() => router.push("/buscar")} style={{ padding: "12px 16px", border: "1px solid #ddd", background: "white", borderRadius: 8 }}>Voltar</button>
        </div>

        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {items.map((p) => (
              <div key={p._id} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 16 }}>
                <h3 style={{ margin: 0 }}>{p.nome}</h3>
                <div style={{ color: "#6b7280", fontSize: 14 }}>
                  <div>Fabricante: {p.fabricante || "-"}</div>
                  <div>Categoria: {p.categoria || "-"}</div>
                  <div>Certificação: {p.certificacao || "-"}</div>
                </div>
                <button onClick={() => router.push(`/insumos/${p._id}`)} style={{ marginTop: 12, padding: "8px 12px", background: "#111827", color: "white", border: 0, borderRadius: 6 }}>Detalhes</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
