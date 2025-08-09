import Head from "next/head";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Sobre() {
  return (
    <>
      <Head>
        <title>Sobre o Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>
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
          <span>Sobre o App</span>
        </div>

        {/* Hero Section */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: "40px",
          padding: "32px",
          backgroundColor: "#f0fdf4",
          borderRadius: "12px",
          border: "1px solid #dcfce7"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🌱</div>
          <h1 style={{ margin: "0 0 12px 0", color: "#166534" }}>Guia Orgânico</h1>
          <p style={{ 
            fontSize: "18px", 
            color: "#16a34a", 
            margin: 0,
            fontWeight: "500"
          }}>
            O Aplicativo que Simplifica a Agricultura Orgânica
          </p>
        </div>

        {/* Seções */}
        <div style={{ display: "grid", gap: "32px" }}>
          
          {/* Nosso Propósito */}
          <section style={{ 
            padding: "24px", 
            backgroundColor: "#fefefe", 
            borderRadius: "8px",
            border: "1px solid #e5e7eb"
          }}>
            <h2 style={{ margin: "0 0 16px 0", color: "#111827", display: "flex", alignItems: "center", gap: "8px" }}>
              🎯 Nosso Propósito
            </h2>
            <p style={{ margin: 0, color: "#374151", fontSize: "16px", lineHeight: "1.6" }}>
              Uma plataforma que dá mais autonomia ao produtor e otimiza o trabalho das certificadoras, 
              simplificando o acesso a informações sobre insumos autorizados e agilizando processos 
              de autorização no setor da agricultura orgânica.
            </p>
          </section>

          {/* O Problema */}
          <section style={{ 
            padding: "24px", 
            backgroundColor: "#fef2f2", 
            borderRadius: "8px",
            border: "1px solid #fecaca"
          }}>
            <h2 style={{ margin: "0 0 16px 0", color: "#dc2626", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚠️ O Problema
            </h2>
            <div style={{ color: "#7f1d1d" }}>
              <p style={{ margin: "0 0 12px 0" }}>
                <strong>Desafios enfrentados pelos produtores:</strong>
              </p>
              <ul style={{ margin: "0 0 16px 0", paddingLeft: "20px" }}>
                <li>Dificuldade na busca por informações de insumos autorizados</li>
                <li>Processos de autorização lentos e burocráticos</li>
                <li>Falta de centralização das informações</li>
                <li>Comunicação fragmentada com certificadoras</li>
              </ul>
              <p style={{ margin: 0, fontStyle: "italic" }}>
                "A busca por informações sobre insumos é um dos maiores gargalos do produtor orgânico." 
                - Depoimento de produtor
              </p>
            </div>
          </section>

          {/* O Mercado */}
          <section style={{ 
            padding: "24px", 
            backgroundColor: "#fffbeb", 
            borderRadius: "8px",
            border: "1px solid #fed7aa"
          }}>
            <h2 style={{ margin: "0 0 16px 0", color: "#ea580c", display: "flex", alignItems: "center", gap: "8px" }}>
              📊 O Mercado
            </h2>
            <div style={{ color: "#9a3412" }}>
              <p style={{ margin: "0 0 12px 0" }}>
                <strong>Legislação e números do setor:</strong>
              </p>
              <ul style={{ margin: "0 0 16px 0", paddingLeft: "20px" }}>
                <li>Lei de Merenda Orgânica: impulsiona a demanda</li>
                <li>Crescimento do mercado orgânico brasileiro</li>
                <li>Milhares de produtores certificados no país</li>
                <li>Múltiplas certificadoras atuando no mercado</li>
              </ul>
              <p style={{ margin: 0 }}>
                O setor orgânico está em expansão e precisa de ferramentas que facilitem 
                o trabalho de produtores e certificadoras.
              </p>
            </div>
          </section>

          {/* A Solução */}
          <section style={{ 
            padding: "24px", 
            backgroundColor: "#f0f9ff", 
            borderRadius: "8px",
            border: "1px solid #bae6fd"
          }}>
            <h2 style={{ margin: "0 0 16px 0", color: "#0284c7", display: "flex", alignItems: "center", gap: "8px" }}>
              💡 A Solução
            </h2>
            <div style={{ color: "#0c4a6e" }}>
              <p style={{ margin: "0 0 12px 0" }}>
                <strong>O Guia Orgânico oferece:</strong>
              </p>
              <ul style={{ margin: "0 0 16px 0", paddingLeft: "20px" }}>
                <li>Catálogo pesquisável de insumos autorizados</li>
                <li>Fluxo simplificado de solicitação de autorização</li>
                <li>Integração com certificadoras</li>
                <li>Centralização de informações em uma plataforma</li>
              </ul>
              <p style={{ margin: 0 }}>
                Uma ferramenta que conecta produtores e certificadoras de forma eficiente e transparente.
              </p>
            </div>
          </section>

          {/* Benefícios */}
          <section style={{ 
            padding: "24px", 
            backgroundColor: "#f0fdf4", 
            borderRadius: "8px",
            border: "1px solid #bbf7d0"
          }}>
            <h2 style={{ margin: "0 0 16px 0", color: "#16a34a", display: "flex", alignItems: "center", gap: "8px" }}>
              ✅ Benefícios
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
              <div>
                <h4 style={{ margin: "0 0 8px 0", color: "#15803d" }}>Para Produtores:</h4>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#166534" }}>
                  <li>Agilidade na busca por informações</li>
                  <li>Processo de autorização simplificado</li>
                  <li>Economia de tempo e recursos</li>
                  <li>Maior autonomia nas decisões</li>
                </ul>
              </div>
              <div>
                <h4 style={{ margin: "0 0 8px 0", color: "#15803d" }}>Para Certificadoras:</h4>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "#166534" }}>
                  <li>Padronização de processos</li>
                  <li>Redução de trabalho manual</li>
                  <li>Melhor organização de dados</li>
                  <li>Comunicação mais eficiente</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <div style={{ 
          textAlign: "center", 
          marginTop: "40px",
          padding: "24px",
          backgroundColor: "#f8fafc",
          borderRadius: "8px",
          border: "1px solid #e2e8f0"
        }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#1e293b" }}>Pronto para começar?</h3>
          <p style={{ margin: "0 0 20px 0", color: "#64748b" }}>
            Explore nossa plataforma e descubra como podemos facilitar seu trabalho na agricultura orgânica.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link 
              href="/buscar"
              style={{
                padding: "12px 24px",
                backgroundColor: "#0070f3",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "500"
              }}
            >
              🔍 Pesquisar Insumos
            </Link>
            <Link 
              href="/pedidos/novo"
              style={{
                padding: "12px 24px",
                backgroundColor: "#10b981",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "500"
              }}
            >
              📋 Solicitar Autorização
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
