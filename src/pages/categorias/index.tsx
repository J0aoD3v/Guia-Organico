import Head from "next/head";
import Navbar from "../../components/Navbar";
import Link from "next/link";

const categorias = [
  "Defensivos Orgânicos",
  "Fertilizantes",
  "Inoculantes",
  "Adjuvantes",
];

export default function Categorias() {
  return (
    <>
      <Head>
        <title>Categorias - Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>
        <h2 style={{ marginBottom: 16 }}>Categorias</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {categorias.map((c) => (
            <Link key={c} href={`/categorias/${encodeURIComponent(c)}`} style={{ border: "1px solid #e5e7eb", padding: 16, borderRadius: 8, textDecoration: "none", color: "inherit" }}>
              {c}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
