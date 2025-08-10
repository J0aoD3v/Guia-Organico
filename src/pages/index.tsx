import Head from "next/head";
import Link from "next/link";
import UserAvatar from "../components/auth/UserAvatar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const [pedidosMes, setPedidosMes] = useState<number | null>(null);
  const [proximoCiclo, setProximoCiclo] = useState<string>("");
  const [creditosUsuario, setCreditosUsuario] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDados() {
      try {
        const [resPedidos, resUsuario, resCiclo] = await Promise.all([
          fetch(`/api/pedidos?email=${session?.user?.email}`),
          fetch(`/api/usuarios`),
          fetch(`/api/ciclo`),
        ]);

        const pedidosData = await resPedidos.json();
        const usuariosData = await resUsuario.json();
        const cicloData = await resCiclo.json();
        const usuarioAtual = usuariosData.find(
          (u: any) => u.email === session?.user?.email
        );

        setPedidosMes(pedidosData.count ?? 0);
        setProximoCiclo(cicloData.proximoCiclo ?? "");
        setCreditosUsuario(usuarioAtual?.credito ?? null);
      } catch (err) {
        console.error("Erro ao buscar dados de pedidos:", err);
      }
    }

    if (session) {
      fetchDados();
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>Guia Orgânico</title>
        <meta
          name="description"
          content="Plataforma para produtores e certificadoras de agricultura orgânica"
        />
      </Head>

      <div style={{ padding: "20px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "20px",
          }}
        >
          <h1>🌱 Guia Orgânico</h1>
          <UserAvatar />
        </header>

        <main>
          <p style={{ fontSize: "18px", marginBottom: "20px" }}>
            Uma plataforma digital para produtores e certificadoras que
            simplifica o acesso a informações sobre insumos autorizados, agiliza
            solicitações de autorização e conecta o setor da agricultura
            orgânica.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginTop: "40px",
            }}
          >
            <Link
              href="/insumos"
              style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#059669")
              }
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ddd")}
            >
              <h3>🌱 Todos os Insumos</h3>
              <p>Explore todo o catálogo de insumos com filtros avançados.</p>
              <button
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Ver Todos
              </button>
            </Link>

            <div
              style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#10b981")
              }
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ddd")}
            >
              <h3>📋 Solicitações</h3>
              <p>
                Solicite autorização de novos insumos diretamente às
                certificadoras.
              </p>
              <button
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor:
                    creditosUsuario !== null && creditosUsuario <= 0
                      ? "#f3f4f6"
                      : "#10b981",
                  color:
                    creditosUsuario !== null && creditosUsuario <= 0
                      ? "#a1a1aa"
                      : "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor:
                    creditosUsuario !== null && creditosUsuario <= 0
                      ? "not-allowed"
                      : "pointer",
                }}
                disabled={creditosUsuario !== null && creditosUsuario <= 0}
              >
                {creditosUsuario !== null && creditosUsuario <= 0 ? (
                  <span>
                    Bloqueado até <b>{proximoCiclo}</b>
                  </span>
                ) : (
                  "Solicitar Agora"
                )}
              </button>
            </div>

            <Link
              href="/sobre"
              style={{
                padding: "20px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#8b5cf6")
              }
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#ddd")}
            >
              <h3>ℹ️ Sobre o App</h3>
              <p>Conheça mais sobre nossa plataforma e propósito.</p>
              <button
                style={{
                  marginTop: "10px",
                  padding: "8px 16px",
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Saiba Mais
              </button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
