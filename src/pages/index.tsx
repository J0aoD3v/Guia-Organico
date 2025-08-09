import Head from "next/head";
import Link from "next/link";
import UserAvatar from "../components/auth/UserAvatar";

export default function Home() {
  return (
    <>
      <Head>
        <title>Guia Orgânico</title>
        <meta name="description" content="Plataforma para produtores e certificadoras de agricultura orgânica" />
      </Head>
      
      <div style={{ padding: "20px" }}>
        <header style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "40px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "20px"
        }}>
          <h1>🌱 Guia Orgânico</h1>
          <UserAvatar />
        </header>

        <main>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            Uma plataforma digital para produtores e certificadoras que simplifica 
            o acesso a informações sobre insumos autorizados, agiliza solicitações 
            de autorização e conecta o setor da agricultura orgânica.
          </p>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "40px"
          }}>
            <Link href="/buscar" style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
              transition: "border-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#0070f3"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#ddd"}
            >
              <h3>🔍 Busca de Insumos</h3>
              <p>Encontre rapidamente insumos autorizados por categoria ou texto.</p>
              <button style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                Pesquisar Agora
              </button>
            </Link>

            <Link href="/pedidos/novo" style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
              transition: "border-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#10b981"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#ddd"}
            >
              <h3>📋 Solicitações</h3>
              <p>Solicite autorização de novos insumos diretamente às certificadoras.</p>
              <button style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                Solicitar Agora
              </button>
            </Link>

            <Link href="/categorias" style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
              transition: "border-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#f59e0b"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#ddd"}
            >
              <h3>📂 Categorias</h3>
              <p>Navegue pelos insumos organizados por categoria.</p>
              <button style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                Ver Categorias
              </button>
            </Link>

            <Link href="/insumos" style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
              transition: "border-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#059669"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#ddd"}
            >
              <h3>🌱 Todos os Insumos</h3>
              <p>Explore todo o catálogo de insumos com filtros avançados.</p>
              <button style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#059669",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                Ver Todos
              </button>
            </Link>

            <Link href="/sobre" style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
              cursor: "pointer",
              transition: "border-color 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#8b5cf6"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#ddd"}
            >
              <h3>ℹ️ Sobre o App</h3>
              <p>Conheça mais sobre nossa plataforma e propósito.</p>
              <button style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}>
                Saiba Mais
              </button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}