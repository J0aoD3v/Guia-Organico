import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
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
        const res = await fetch(`/api/products?categoria=${encodeURIComponent(slug)}`);
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
        <title>Lista por Categoria - Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 1000, margin: "30px auto", padding: 20 }}>
        <div style={{ marginBottom: 16, color: "#6b7280" }}>Defensivos Orgânicos &gt; {slug}</div>
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
                  <div>Classe Agronômica: {p.classeAgronomica || "-"}</div>
                  <div>Autorizado por: {p.autorizadoPor || "-"}</div>
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
