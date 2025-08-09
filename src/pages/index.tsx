import Head from "next/head";
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
            <div style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px" 
            }}>
              <h3>🔍 Busca de Insumos</h3>
              <p>Encontre rapidamente insumos autorizados por categoria ou texto.</p>
            </div>

            <div style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px" 
            }}>
              <h3>📋 Solicitações</h3>
              <p>Solicite autorização de novos insumos diretamente às certificadoras.</p>
            </div>

            <div style={{ 
              padding: "20px", 
              border: "1px solid #ddd", 
              borderRadius: "8px" 
            }}>
              <h3>⚙️ Painel Admin</h3>
              <p>Gerencie produtos, usuários e solicitações (apenas administradores).</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}