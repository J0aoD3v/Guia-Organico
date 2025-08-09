import Head from "next/head";
import Navbar from "../../components/Navbar";
import Link from "next/link";
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
    alert("Pedido enviado com sucesso! Você receberá uma resposta em breve. (Funcionalidade em desenvolvimento)");
  }

  return (
    <>
      <Head>
        <title>Solicitar Autorização - Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 800, margin: "30px auto", padding: 20 }}>
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
          <span>Solicitar Autorização</span>
        </div>

        {/* Cabeçalho */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ margin: "0 0 8px 0" }}>📋 Solicitar Autorização de Insumo</h2>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Preencha as informações abaixo para solicitar a autorização de um novo insumo orgânico.
          </p>
        </div>

        {/* Informações importantes */}
        <div style={{ 
          padding: "16px", 
          backgroundColor: "#fef3c7", 
          border: "1px solid #fbbf24",
          borderRadius: "8px",
          marginBottom: "24px"
        }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#92400e" }}>⚠️ Informações Importantes</h4>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#92400e" }}>
            <li>Todos os campos são obrigatórios</li>
            <li>Anexe a ficha técnica e bula do produto</li>
            <li>O processo de análise pode levar até 30 dias</li>
            <li>Você receberá atualizações por email</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "4px", color: "#374151" }}>
              NOME DO PRODUTO *
            </label>
            <input 
              name="nome" 
              value={form.nome} 
              onChange={handleChange} 
              required 
              placeholder="Ex: Óleo de Neem Premium"
              style={{ 
                width: "100%", 
                padding: 12, 
                border: "1px solid #d1d5db", 
                borderRadius: 8,
                fontSize: "16px"
              }} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "4px", color: "#374151" }}>
              FABRICANTE *
            </label>
            <input 
              name="fabricante" 
              value={form.fabricante} 
              onChange={handleChange} 
              required 
              placeholder="Ex: Empresa XYZ Ltda"
              style={{ 
                width: "100%", 
                padding: 12, 
                border: "1px solid #d1d5db", 
                borderRadius: 8,
                fontSize: "16px"
              }} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "4px", color: "#374151" }}>
              CATEGORIA *
            </label>
            <select 
              name="categoria" 
              value={form.categoria} 
              onChange={handleChange} 
              required 
              style={{ 
                width: "100%", 
                padding: 12, 
                border: "1px solid #d1d5db", 
                borderRadius: 8,
                fontSize: "16px"
              }}
            >
              <option value="">Selecione uma categoria...</option>
              <option value="Defensivos Orgânicos">Defensivos Orgânicos</option>
              <option value="Fertilizantes">Fertilizantes</option>
              <option value="Inoculantes">Inoculantes</option>
              <option value="Adjuvantes">Adjuvantes</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "4px", color: "#374151" }}>
              FINALIDADE DO USO *
            </label>
            <input 
              name="finalidade" 
              value={form.finalidade} 
              onChange={handleChange} 
              required 
              placeholder="Ex: Controle de pragas em hortaliças"
              style={{ 
                width: "100%", 
                padding: 12, 
                border: "1px solid #d1d5db", 
                borderRadius: 8,
                fontSize: "16px"
              }} 
            />
          </div>

          <div>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "4px", color: "#374151" }}>
              DESCRIÇÃO DETALHADA *
            </label>
            <textarea 
              name="descricao" 
              value={form.descricao} 
              onChange={handleChange} 
              rows={5} 
              required 
              placeholder="Descreva detalhadamente o produto, sua composição, modo de uso e benefícios..."
              style={{ 
                width: "100%", 
                padding: 12, 
                border: "1px solid #d1d5db", 
                borderRadius: 8,
                fontSize: "16px",
                resize: "vertical"
              }} 
            />
          </div>

          {/* Seção de anexos */}
          <div style={{ 
            border: "1px solid #e5e7eb", 
            borderRadius: "8px", 
            padding: "16px",
            backgroundColor: "#f9fafb"
          }}>
            <h4 style={{ margin: "0 0 12px 0", color: "#374151" }}>📎 Documentos Obrigatórios</h4>
            
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>
                  Ficha Técnica *
                </label>
                <button 
                  type="button" 
                  style={{ 
                    padding: "10px 16px", 
                    border: "2px dashed #d1d5db", 
                    background: "white", 
                    borderRadius: 8,
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "center",
                    color: "#6b7280"
                  }}
                >
                  📄 Clique para anexar a Ficha Técnica (PDF, DOC)
                </button>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: "500", marginBottom: "4px", color: "#374151" }}>
                  Bula do Produto *
                </label>
                <button 
                  type="button" 
                  style={{ 
                    padding: "10px 16px", 
                    border: "2px dashed #d1d5db", 
                    background: "white", 
                    borderRadius: 8,
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "center",
                    color: "#6b7280"
                  }}
                >
                  📋 Clique para anexar a Bula (PDF, DOC)
                </button>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div style={{ display: "flex", gap: 12, marginTop: "16px" }}>
            <button 
              type="button"
              onClick={() => window.history.back()}
              style={{ 
                padding: "12px 24px", 
                border: "1px solid #d1d5db", 
                background: "white", 
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              Cancelar
            </button>
            
            <button 
              type="submit" 
              style={{ 
                flex: 1,
                padding: "12px 24px", 
                background: "#10b981", 
                color: "white", 
                border: 0, 
                borderRadius: 8,
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600"
              }}
            >
              📤 Enviar Pedido de Autorização
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
