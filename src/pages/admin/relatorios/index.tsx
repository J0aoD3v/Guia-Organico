import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar";

export default function RelatoriosAdmin() {
  function exportarCSV() {
    if (!historico.length) return;
    const header = [
      "Usuário",
      "Email",
      "Créditos",
      "Solicitações no mês",
      "Ciclo",
    ];
    const rows = historico.map((h) => [
      h.nome || h.email,
      h.email,
      h.credito,
      h.solicitacoesMes,
      new Date(h.ciclo).toLocaleDateString("pt-BR"),
    ]);
    let csv = header.join(";") + "\n";
    csv += rows.map((r) => r.join(";")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-mensal-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [historico, setHistorico] = useState<any[]>([]);
  const [erro, setErro] = useState("");
  const [relatorioLoading, setRelatorioLoading] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.email !== "admin@guia-organico.com") {
      router.push("/admin");
      return;
    }
    setLoading(false);
  }, [session, status, router]);

  async function gerarRelatorio() {
    setRelatorioLoading(true);
    setErro("");
    try {
      const res = await fetch("/api/relatorios/usuarios");
      const data = await res.json();
      setHistorico(data);
    } catch (err) {
      setErro("Erro ao buscar relatório");
    } finally {
      setRelatorioLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: 20, textAlign: "center" }}>
          <p>🔄 Carregando...</p>
        </div>
      </div>
    );
  }

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
              📊 Relatórios
            </h1>
            <p style={{ color: "#64748b", margin: "8px 0 0 0" }}>
              Gere relatórios e análises do sistema
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

        {/* Cards de Relatórios */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 1px 4px #e5e7eb",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                color: "#1e293b",
                margin: "0 0 12px 0",
                fontSize: "18px",
              }}
            >
              📈 Relatório de Pedidos
            </h3>
            <p
              style={{
                color: "#64748b",
                margin: "0 0 16px 0",
                fontSize: "14px",
              }}
            >
              Estatísticas completas de solicitações de autorização por período
            </p>
            <button
              style={{
                background: "#10b981",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                width: "100%",
              }}
              onClick={() => alert("Relatório de pedidos (em desenvolvimento)")}
            >
              Gerar Relatório
            </button>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 1px 4px #e5e7eb",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                color: "#1e293b",
                margin: "0 0 12px 0",
                fontSize: "18px",
              }}
            >
              👥 Relatório de Usuários
            </h3>
            <p
              style={{
                color: "#64748b",
                margin: "0 0 16px 0",
                fontSize: "14px",
              }}
            >
              Análise de cadastros, atividade e engajamento dos usuários
            </p>
            <button
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                width: "100%",
              }}
              onClick={() =>
                alert("Relatório de usuários (em desenvolvimento)")
              }
            >
              Gerar Relatório
            </button>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 1px 4px #e5e7eb",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                color: "#1e293b",
                margin: "0 0 12px 0",
                fontSize: "18px",
              }}
            >
              🌱 Relatório de Produtos
            </h3>
            <p
              style={{
                color: "#64748b",
                margin: "0 0 16px 0",
                fontSize: "14px",
              }}
            >
              Catálogo completo com estatísticas de uso e demanda
            </p>
            <button
              style={{
                background: "#f59e0b",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                width: "100%",
              }}
              onClick={() =>
                alert("Relatório de produtos (em desenvolvimento)")
              }
            >
              Gerar Relatório
            </button>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 1px 4px #e5e7eb",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                color: "#1e293b",
                margin: "0 0 12px 0",
                fontSize: "18px",
              }}
            >
              📋 Relatório Mensal
            </h3>
            <p
              style={{
                color: "#64748b",
                margin: "0 0 16px 0",
                fontSize: "14px",
              }}
            >
              Consolidado mensal de todas as atividades do sistema
            </p>
            <button
              style={{
                background: "#8b5cf6",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                width: "100%",
              }}
              onClick={gerarRelatorio}
            >
              Gerar Relatório
            </button>
            {historico.length > 0 && (
              <button
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  marginTop: 12,
                  float: "right",
                }}
                onClick={exportarCSV}
              >
                Exportar CSV
              </button>
            )}
            {relatorioLoading && (
              <p style={{ marginTop: 12 }}>🔄 Carregando relatório...</p>
            )}
            {erro && <p style={{ color: "#ef4444" }}>{erro}</p>}
            {historico.length > 0 && (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: 24,
                }}
              >
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    <th
                      style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}
                    >
                      Usuário
                    </th>
                    <th
                      style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}
                    >
                      Email
                    </th>
                    <th
                      style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}
                    >
                      Créditos
                    </th>
                    <th
                      style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}
                    >
                      Solicitações no mês
                    </th>
                    <th
                      style={{ padding: 10, borderBottom: "1px solid #e5e7eb" }}
                    >
                      Ciclo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((h, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <td style={{ padding: 10 }}>{h.nome || h.email}</td>
                      <td style={{ padding: 10 }}>{h.email}</td>
                      <td style={{ padding: 10 }}>{h.credito}</td>
                      <td style={{ padding: 10 }}>{h.solicitacoesMes}</td>
                      <td style={{ padding: 10 }}>
                        {new Date(h.ciclo).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {historico.length === 0 && !relatorioLoading && (
              <p style={{ color: "#64748b", marginTop: 32 }}>
                Nenhum relatório gerado ainda.
              </p>
            )}
          </div>
        </div>

        {/* Seção de Exportação */}
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
            style={{ color: "#1e293b", margin: "0 0 16px 0", fontSize: "20px" }}
          >
            💾 Exportar Dados
          </h2>
          <p
            style={{ color: "#64748b", margin: "0 0 20px 0", fontSize: "14px" }}
          >
            Exporte dados do sistema em diferentes formatos
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              style={{
                background: "#059669",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => alert("Exportar para Excel (em desenvolvimento)")}
            >
              📊 Exportar Excel
            </button>
            <button
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => alert("Exportar para PDF (em desenvolvimento)")}
            >
              📄 Exportar PDF
            </button>
            <button
              style={{
                background: "#7c3aed",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => alert("Exportar para CSV (em desenvolvimento)")}
            >
              📝 Exportar CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
