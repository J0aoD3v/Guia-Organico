import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import type { Product } from "../../types/product";

export default function DetalheInsumo() {
  const router = useRouter();
  const { id } = router.query;
  const [item, setItem] = useState<Product | null>(null);

  useEffect(() => {
    async function load() {
      if (!id || typeof id !== "string") return;
      try {
        const res = await fetch(`/api/products?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        const found = Array.isArray(data) ? data.find((x: any) => x._id === id) : data;
        setItem(found || null);
      } catch (e) {
        setItem(null);
      }
    }
    load();
  }, [id]);

  return (
    <>
      <Head>
        <title>Detalhes do Insumo - Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 800, margin: "30px auto", padding: 20 }}>
        {!item ? (
          <div>Carregando...</div>
        ) : (
          <div>
            <h1 style={{ marginBottom: 16 }}>{item.nome}</h1>
            <div style={{ color: "#6b7280" }}>
              <div><strong>Fabricante:</strong> {item.fabricante || "-"}</div>
              <div><strong>Categoria:</strong> {item.categoria || "-"}</div>
              <div><strong>Classe Agronômica:</strong> {item.classeAgronomica || "-"}</div>
              <div><strong>Autorizado por:</strong> {item.autorizadoPor || "-"}</div>
              <div><strong>Certificação:</strong> {item.certificacao || "-"}</div>
            </div>
            <button onClick={() => router.back()} style={{ marginTop: 16, padding: "10px 14px", border: "1px solid #ddd", background: "white", borderRadius: 8 }}>Voltar</button>
          </div>
        )}
      </main>
    </>
  );
}
