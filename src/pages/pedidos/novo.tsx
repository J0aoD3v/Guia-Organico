import Head from "next/head";
import Navbar from "../../components/Navbar";
import { useState } from "react";

export default function NovoPedido() {
  const [form, setForm] = useState({
    nome: "",
    fabricante: "",
    categoria: "",
    finalidade: "",
    descricao: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Pedido enviado! (wireframe)");
  }

  return (
    <>
      <Head>
        <title>Solicitar Autorização - Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 800, margin: "30px auto", padding: 20 }}>
        <h2>Solicitar Autorização de Insumo</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <label>
            NOME DO PRODUTO
            <input name="nome" value={form.nome} onChange={handleChange} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
          </label>
          <label>
            FABRICANTE
            <input name="fabricante" value={form.fabricante} onChange={handleChange} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
          </label>
          <label>
            CATEGORIA
            <select name="categoria" value={form.categoria} onChange={handleChange} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }}>
              <option value="">Selecione...</option>
              <option>Defensivos Orgânicos</option>
              <option>Fertilizantes</option>
              <option>Inoculantes</option>
              <option>Adjuvantes</option>
            </select>
          </label>
          <label>
            FINALIDADE DO USO
            <input name="finalidade" value={form.finalidade} onChange={handleChange} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
          </label>
          <label>
            DESCRIÇÃO DETALHADA
            <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={5} required style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <button type="button" style={{ padding: "10px 14px", border: "1px solid #ddd", background: "white", borderRadius: 8 }}>Anexar FICHA TÉCNICA</button>
            <button type="button" style={{ padding: "10px 14px", border: "1px solid #ddd", background: "white", borderRadius: 8 }}>Anexar BULA</button>
          </div>
          <button type="submit" style={{ padding: "12px 16px", background: "#111827", color: "white", border: 0, borderRadius: 8 }}>Pedir Autorização</button>
        </form>
      </main>
    </>
  );
}
