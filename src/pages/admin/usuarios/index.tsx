import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "../../../components/Navbar";

export default function UsuariosAdmin() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ credito: string | number }>({
    credito: "",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.email !== "admin@guia-organico.com") {
      router.push("/admin");
      return;
    }
    fetchUsuarios();
  }, [session, status, router]);

  useEffect(() => {
    console.log("[DEBUG] Estado usuarios atualizado:", usuarios);
    console.log("[DEBUG] Quantidade no estado:", usuarios.length);
  }, [usuarios]);

  async function fetchUsuarios() {
    try {
      setLoading(true);
      console.log("[DEBUG] Fazendo request para /api/usuarios...");
      const res = await fetch("/api/usuarios");
      console.log("[DEBUG] Resposta recebida:", res.status, res.statusText);
      const data = await res.json();
      console.log("[DEBUG] Dados recebidos:", data);
      console.log(
        "[DEBUG] Tipo dos dados:",
        typeof data,
        Array.isArray(data) ? "é array" : "não é array"
      );
      console.log("[DEBUG] Quantidade de usuários:", data?.length || 0);
      setUsuarios(data);
    } catch (error) {
      console.error("[DEBUG] Erro ao buscar usuários:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEdit(user: any) {
    setEditId(user._id);
    setEditData({ credito: user.credito ?? "" });
  }

  async function handleSave() {
    await fetch("/api/usuarios", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editId, ...editData }),
    });
    setEditId(null);
    setEditData({ credito: "" });
    fetchUsuarios();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Tem certeza que deseja remover este usuário?")) return;
    await fetch("/api/usuarios", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUsuarios();
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
              👥 Gestão de Usuários
            </h1>
            <p style={{ color: "#64748b", margin: "8px 0 0 0" }}>
              Administre contas de usuários e permissões do sistema
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

        {/* Estatísticas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: 20,
              borderRadius: 8,
              boxShadow: "0 1px 4px #e5e7eb",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ color: "#1e293b", margin: 0, fontSize: "24px" }}>
              {usuarios.length}
            </h3>
            <p
              style={{
                color: "#64748b",
                margin: "4px 0 0 0",
                fontSize: "14px",
              }}
            >
              Total de Usuários
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: 20,
              borderRadius: 8,
              boxShadow: "0 1px 4px #e5e7eb",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ color: "#1e293b", margin: 0, fontSize: "24px" }}>
              {usuarios.filter((u) => u.role === "admin").length}
            </h3>
            <p
              style={{
                color: "#64748b",
                margin: "4px 0 0 0",
                fontSize: "14px",
              }}
            >
              Administradores
            </p>
          </div>

          <div
            style={{
              background: "#ffffff",
              padding: 20,
              borderRadius: 8,
              boxShadow: "0 1px 4px #e5e7eb",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ color: "#1e293b", margin: 0, fontSize: "24px" }}>
              {usuarios.filter((u) => u.role === "user").length}
            </h3>
            <p
              style={{
                color: "#64748b",
                margin: "4px 0 0 0",
                fontSize: "14px",
              }}
            >
              Usuários Comuns
            </p>
          </div>
        </div>

        {/* Tabela de Usuários */}
        <div
          style={{
            background: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 1px 4px #e5e7eb",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 20,
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2 style={{ color: "#1e293b", margin: 0, fontSize: "18px" }}>
              Lista de Usuários
            </h2>
            <button
              style={{
                background: "#10b981",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
              }}
              onClick={() => alert("Adicionar usuário (em desenvolvimento)")}
            >
              + Adicionar Usuário
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th
                    style={{
                      padding: 12,
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Nome
                  </th>
                  <th
                    style={{
                      padding: 12,
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      padding: 12,
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Função
                  </th>
                  <th
                    style={{
                      padding: 12,
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Cadastro
                  </th>
                  <th
                    style={{
                      padding: 12,
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Último Login
                  </th>
                  <th
                    style={{
                      padding: 12,
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Créditos
                  </th>
                  {/* Coluna 'Limite Global' removida */}
                  <th
                    style={{
                      padding: 12,
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Solicitações no mês
                  </th>
                  <th
                    style={{
                      padding: 12,
                      textAlign: "center",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((user: any) => (
                  <tr
                    key={user._id}
                    style={{ borderBottom: "1px solid #e5e7eb" }}
                  >
                    <td style={{ padding: 12 }}>
                      <div
                        style={{
                          fontWeight: "500",
                          color: user.role === "admin" ? "#dc2626" : "#1e293b",
                        }}
                      >
                        {user.name || user.nome || user.email}
                        {user.role === "admin" && (
                          <span
                            style={{
                              marginLeft: 6,
                              fontSize: 12,
                              color: "#dc2626",
                              fontWeight: "bold",
                            }}
                          >
                            (admin)
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <div style={{ color: "#64748b" }}>{user.email}</div>
                    </td>
                    <td style={{ padding: 12 }}>
                      <span
                        style={{
                          background:
                            user.role === "admin" ? "#fee2e2" : "#f0f9ff",
                          color: user.role === "admin" ? "#dc2626" : "#0284c7",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {user.role === "admin" ? "Administrador" : "Usuário"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: 12,
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      {editId === user._id ? (
                        <input
                          type="number"
                          value={editData.credito}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              credito: e.target.value,
                            })
                          }
                          style={{ width: 60 }}
                        />
                      ) : (
                        user.credito ?? "-"
                      )}
                    </td>
                    <td
                      style={{
                        padding: 12,
                        color: "#64748b",
                        fontSize: "14px",
                      }}
                    >
                      <SolicitacoesMes email={user.email} />
                    </td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        {editId === user._id ? (
                          <>
                            <button
                              style={{
                                background: "#10b981",
                                color: "white",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                              onClick={handleSave}
                            >
                              💾 Salvar
                            </button>
                            <button
                              style={{
                                background: "#64748b",
                                color: "white",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                              onClick={() => setEditId(null)}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              style={{
                                background: "#3b82f6",
                                color: "white",
                                border: "none",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                              onClick={() => handleEdit(user)}
                            >
                              ✏️ Editar
                            </button>
                            {user.role !== "admin" && (
                              <button
                                style={{
                                  background: "#ef4444",
                                  color: "white",
                                  border: "none",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                }}
                                onClick={() => handleDelete(user._id)}
                              >
                                🗑️ Remover
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para buscar solicitações do mês
function SolicitacoesMes({ email }: { email: string }) {
  const [count, setCount] = useState<string | number>("-");
  useEffect(() => {
    async function fetchCount() {
      const res = await fetch(`/api/pedidos?email=${email}`);
      const data = await res.json();
      setCount(data.count ?? "-");
    }
    if (email) fetchCount();
  }, [email]);
  return <span>{count}</span>;
}
