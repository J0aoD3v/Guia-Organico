import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar";

export default function ConfiguracoesAdmin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [emailNotificacoes, setEmailNotificacoes] = useState(true);
  const [manutencao, setManutencao] = useState(false);
  const [creditoGlobal, setCreditoGlobal] = useState(0);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user?.email !== "admin@guia-organico.com") {
      router.push("/admin");
      return;
    }

    async function fetchConfiguracoes() {
      try {
        const res = await fetch("/api/configuracoes");
        const data = await res.json();
        if (data) {
          setEmailNotificacoes(data.emailNotificacoes ?? true);
          setManutencao(data.manutencao ?? false);
          setCreditoGlobal(data.creditoPadrao ?? 0);
        }
      } catch (err) {
        console.error("Erro ao buscar configurações:", err);
      }
      setLoading(false);
    }

    fetchConfiguracoes();
  }, [session, status, router]);

  const salvarConfiguracoes = async () => {
    try {
      const res = await fetch("/api/configuracoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailNotificacoes,
          manutencao,
          creditoPadrao: creditoGlobal,
        }),
      });
      if (!res.ok) {
        throw new Error("Erro ao salvar configurações");
      }
      alert("Configurações salvas com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar configurações:", err);
      alert("Erro ao salvar configurações");
    }
  };

  const limparLogs = async () => {
    if (!confirm("Tem certeza que deseja limpar todos os logs do sistema?"))
      return;
    try {
      const res = await fetch("/api/logs/clear", { method: "POST" });
      if (res.ok) {
        alert("Logs do sistema limpos com sucesso!");
      } else {
        alert("Erro ao limpar logs.");
      }
    } catch (err) {
      alert("Erro ao limpar logs.");
    }
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: 20,
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <div>
            <h1
              style={{
                color: "#1e293b",
                margin: 0,
                fontSize: "28px",
                fontWeight: "bold",
              }}
            >
              ⚙️ Configurações
            </h1>
            <p style={{ color: "#64748b", margin: "8px 0 0 0" }}>
              Configure parâmetros e comportamentos do sistema
            </p>
          </div>
          <button
            onClick={() => router.push("/admin")}
            style={{
              background: "#6b7280",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ← Voltar ao Painel
          </button>
        </div>

        {/* Configurações Gerais */}
        <div
          style={{
            background: "#ffffff",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 1px 4px #e5e7eb",
            border: "1px solid #e5e7eb",
            marginBottom: 20,
          }}
        >
          <h2
            style={{ color: "#1e293b", margin: "0 0 20px 0", fontSize: "20px" }}
          >
            🏗️ Configurações Gerais
          </h2>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: "500",
                color: "#374151",
              }}
            >
              Crédito Padrão Global
            </label>
            <input
              type="number"
              value={creditoGlobal}
              min={0}
              onChange={(e) => setCreditoGlobal(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #e5e7eb",
                fontSize: "16px",
              }}
            />
            <p
              style={{
                color: "#6b7280",
                fontSize: "12px",
                margin: "4px 0 0 0",
              }}
            >
              Valor de crédito padrão para novos usuários e operações.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: "500",
                color: "#374151",
              }}
            ></label>
          </div>
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: "500",
                color: "#374151",
              }}
            ></label>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: "500",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={emailNotificacoes}
                onChange={(e) => setEmailNotificacoes(e.target.checked)}
                style={{ width: "16px", height: "16px" }}
              />
              Notificações por Email
            </label>
            <p
              style={{
                color: "#6b7280",
                fontSize: "12px",
                margin: "4px 0 0 24px",
              }}
            >
              Enviar emails automáticos para novos pedidos e atualizações
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontWeight: "500",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={manutencao}
                onChange={(e) => setManutencao(e.target.checked)}
                style={{ width: "16px", height: "16px" }}
              />
              Modo Manutenção
            </label>
            <p
              style={{
                color: "#6b7280",
                fontSize: "12px",
                margin: "4px 0 0 24px",
              }}
            >
              Ativar modo de manutenção (bloqueia acesso de usuários comuns)
            </p>
          </div>

          <button
            onClick={salvarConfiguracoes}
            style={{
              background: "#10b981",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            💾 Salvar Configurações
          </button>
        </div>

        {/* Configurações de Sistema */}
        <div
          style={{
            background: "#ffffff",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 1px 4px #e5e7eb",
            border: "1px solid #e5e7eb",
            marginBottom: 20,
          }}
        >
          <h2
            style={{ color: "#1e293b", margin: "0 0 20px 0", fontSize: "20px" }}
          >
            🔧 Configurações de Sistema
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 16,
            }}
          >
            <button
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "12px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                textAlign: "left",
              }}
              onClick={() =>
                alert("Cache limpo com sucesso! (em desenvolvimento)")
              }
            >
              🗑️ Limpar Cache do Sistema
            </button>

            <button
              style={{
                background: "#f59e0b",
                color: "white",
                border: "none",
                padding: "12px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                textAlign: "left",
              }}
              onClick={() =>
                alert("Backup criado com sucesso! (em desenvolvimento)")
              }
            >
              💾 Fazer Backup do Sistema
            </button>

            <button
              style={{
                background: "#ef4444",
                color: "white",
                border: "none",
                padding: "12px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                textAlign: "left",
              }}
              onClick={() => {
                if (
                  confirm(
                    "Tem certeza que deseja reiniciar o sistema? (em desenvolvimento)"
                  )
                ) {
                  alert("Sistema reiniciado!");
                }
              }}
            >
              🔄 Reiniciar Sistema
            </button>

            <button
              style={{
                background: "#ef4444",
                color: "white",
                padding: "10px 16px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                marginTop: 16,
              }}
              onClick={limparLogs}
            >
              🧹 Limpar Cache/Logs do Sistema
            </button>

            <button
              style={{
                background: "#22d3ee",
                color: "white",
                padding: "10px 16px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                marginTop: 16,
              }}
              onClick={() => router.push("/admin/configuracoes/logs")}
            >
              📋 Visualizar Logs do Sistema
            </button>
          </div>
        </div>

        {/* Informações do Sistema */}
        <div
          style={{
            background: "#ffffff",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 1px 4px #e5e7eb",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{ color: "#1e293b", margin: "0 0 20px 0", fontSize: "20px" }}
          >
            ℹ️ Informações do Sistema
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            <div>
              <p style={{ color: "#6b7280", margin: 0, fontSize: "12px" }}>
                Versão do Sistema
              </p>
              <p
                style={{
                  color: "#1e293b",
                  margin: "4px 0 0 0",
                  fontWeight: "500",
                }}
              >
                1.0.0
              </p>
            </div>
            <div>
              <p style={{ color: "#6b7280", margin: 0, fontSize: "12px" }}>
                Última Atualização
              </p>
              <p
                style={{
                  color: "#1e293b",
                  margin: "4px 0 0 0",
                  fontWeight: "500",
                }}
              >
                09/08/2025
              </p>
            </div>
            <div>
              <p style={{ color: "#6b7280", margin: 0, fontSize: "12px" }}>
                Ambiente
              </p>
              <p
                style={{
                  color: "#1e293b",
                  margin: "4px 0 0 0",
                  fontWeight: "500",
                }}
              >
                Desenvolvimento
              </p>
            </div>
            <div>
              <p style={{ color: "#6b7280", margin: 0, fontSize: "12px" }}>
                Uptime
              </p>
              <p
                style={{
                  color: "#1e293b",
                  margin: "4px 0 0 0",
                  fontWeight: "500",
                }}
              >
                2d 14h 32m
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
