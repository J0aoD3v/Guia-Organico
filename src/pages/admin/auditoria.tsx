import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import Head from "next/head";
import styles from "./auditoria.module.css";

// Componente para exibir JSON expandível
function ExpandableJson({
  data,
  label = "detalhes",
}: {
  data: any;
  label?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
    return null;
  }

  return (
    <span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: "none",
          border: "1px solid #38bdf8",
          color: "#38bdf8",
          padding: "2px 6px",
          borderRadius: "3px",
          cursor: "pointer",
          fontSize: "14px",
          marginLeft: "8px",
        }}
      >
        {isExpanded ? "−" : "+"} {label}
      </button>
      {isExpanded && (
        <div
          style={{
            marginTop: "8px",
            padding: "8px",
            background: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "4px",
            fontSize: "14px",
            color: "#e2e8f0",
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            maxWidth: "600px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </div>
      )}
    </span>
  );
}

export default function AuditoriaLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ origem: "", data: "", tipo: "" });
  const [navbarHeight, setNavbarHeight] = useState(0);
  const navbarRef = useRef<HTMLDivElement>(null);

  // Função para obter método HTTP de cada log
  const getMethod = (log: any) => {
    if (log.acao) return log.acao.split(" ")[0];
    if (log.method) return log.method;
    return "";
  };

  // Função para buscar logs
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const resBd = await fetch("/api/relatorios/logs");
      const dataBd = await resBd.json();
      const resServer = await fetch("/api/relatorios/server-logs");
      const dataServer = await resServer.json();
      const unified = [
        ...dataBd.map((log: any) => ({
          ...log,
          origem: "Banco de Dados",
          tipo: "acao",
          timestamp: log.timestamp || new Date(),
        })),
        ...dataServer.map((log: any) => ({
          ...log,
          origem: "Servidor (Console)",
          tipo: "servidor",
          timestamp: log.timestamp || new Date(),
        })),
      ];
      unified.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setLogs(unified);
    } catch (err) {
      console.error("Erro ao buscar logs:", err);
    }
    setLoading(false);
  };

  // Limpa todos os logs no server e reseta filtros
  const clearLogs = async () => {
    setLoading(true);
    try {
      // Limpa logs de ações e de servidor
      await Promise.all([
        fetch("/api/relatorios/logs", { method: "DELETE" }),
        fetch("/api/relatorios/server-logs", { method: "DELETE" }),
      ]);
      // Recarrega após limpeza
      await fetchLogs();
      setFilters({ origem: "", data: "", tipo: "" });
    } catch (err) {
      console.error("Erro ao limpar todos os logs:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    function updateNavbarHeight() {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    }
    // Atualiza após render inicial
    setTimeout(updateNavbarHeight, 50);
    // Observa mudanças de tamanho do Navbar
    let observer: ResizeObserver | null = null;
    if (navbarRef.current && "ResizeObserver" in window) {
      observer = new ResizeObserver(() => updateNavbarHeight());
      observer.observe(navbarRef.current);
    }
    window.addEventListener("resize", updateNavbarHeight);
    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
      if (observer && navbarRef.current) observer.disconnect();
    };
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredLogs = logs.filter(
    (log) =>
      (!filters.origem || log.origem === filters.origem) &&
      (!filters.tipo || getMethod(log) === filters.tipo) &&
      (!filters.data ||
        new Date(log.timestamp).toLocaleDateString() === filters.data)
  );

  // Função para calcular altura das divs internas (título, filtros, botões)
  const getInternalDivsHeight = () => 60 + 80 + 50 + 30; // Aproximação
  const internalDivsHeight = getInternalDivsHeight();

  return (
    <>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div ref={navbarRef}>
          <Navbar />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: 0,
            margin: 0,
            width: "100vw",
            minHeight: `calc(100vh - ${navbarHeight}px)`,
          }}
        >
          <div
            style={{
              background: "#27272a",
              boxShadow: "0 2px 16px #0002",
              padding: 20,
              width: "90vw",
              maxWidth: 1100,
              minWidth: 400,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 16,
            }}
          >
            <h2
              style={{
                color: "#22d3ee",
                fontFamily: "'Cascadia Code', monospace",
                fontSize: 40,
                padding: "8px 24px",
                margin: 0,
                borderBottom: "1px solid #222",
                textAlign: "center",
              }}
            >
              📋 Logs e Auditoria
            </h2>

            {/* Filtros estilizados */}
            <div
              style={{
                width: "100%",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <label
                style={{
                  color: "#22d3ee",
                  fontFamily: "'Cascadia Code', monospace",
                  fontSize: 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#18181b",
                  borderRadius: 8,
                  padding: "8px 18px",
                  border: "1px solid #222",
                }}
              >
                Origem:
                <select
                  name="origem"
                  onChange={handleFilterChange}
                  value={filters.origem}
                  style={{
                    fontFamily: "'Cascadia Code', monospace",
                    fontSize: 20,
                    background: "#27272a",
                    color: "#22d3ee",
                    border: "1px solid #22d3ee",
                    borderRadius: 6,
                    padding: "4px 12px",
                    outline: "none",
                  }}
                >
                  <option value="">Todas</option>
                  <option value="Banco de Dados">Banco de Dados</option>
                  <option value="Servidor (Console)">Servidor (Console)</option>
                </select>
              </label>

              <label
                style={{
                  color: "#22d3ee",
                  fontFamily: "'Cascadia Code', monospace",
                  fontSize: 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#18181b",
                  borderRadius: 8,
                  padding: "8px 18px",
                  border: "1px solid #222",
                }}
              >
                Método:
                <select
                  name="tipo"
                  onChange={handleFilterChange}
                  value={filters.tipo}
                  style={{
                    fontFamily: "'Cascadia Code', monospace",
                    fontSize: 20,
                    background: "#27272a",
                    color: "#22d3ee",
                    border: "1px solid #22d3ee",
                    borderRadius: 6,
                    padding: "4px 12px",
                    outline: "none",
                  }}
                >
                  <option value="">Todos</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </label>

              <label
                style={{
                  color: "#22d3ee",
                  fontFamily: "'Cascadia Code', monospace",
                  fontSize: 22,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#18181b",
                  borderRadius: 8,
                  padding: "8px 18px",
                  border: "1px solid #222",
                }}
              >
                Data:
                <input
                  type="date"
                  name="data"
                  onChange={handleFilterChange}
                  value={filters.data}
                  style={{
                    fontFamily: "'Cascadia Code', monospace",
                    fontSize: 20,
                    background: "#27272a",
                    color: "#22d3ee",
                    border: "1px solid #22d3ee",
                    borderRadius: 6,
                    padding: "4px 12px",
                    outline: "none",
                  }}
                />
              </label>
            </div>

            {/* Botões atualizar e limpar */}
            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
              <button
                onClick={fetchLogs}
                style={{
                  background: "#22d3ee",
                  color: "#0f172a",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 16,
                  fontFamily: "'Cascadia Code', monospace",
                }}
              >
                Atualizar
              </button>
              <button
                onClick={clearLogs}
                style={{
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 16,
                  fontFamily: "'Cascadia Code', monospace",
                }}
              >
                Limpar
              </button>
            </div>

            <div
              style={{
                padding: 0,
                display: "flex",
                justifyContent: "center",
                width: "100%",
                minHeight: 300,
                maxHeight: `calc(100vh - ${
                  navbarHeight + internalDivsHeight
                }px)`,
                alignItems: "flex-start",
                overflow: "auto",
              }}
            >
              {loading ? (
                <div style={{ color: "#a3e635", fontSize: 18, padding: 32 }}>
                  Carregando logs...
                </div>
              ) : filteredLogs.length === 0 ? (
                <div style={{ color: "#ef4444", fontSize: 16, padding: 32 }}>
                  Nenhum log encontrado.
                </div>
              ) : (
                <pre
                  className={styles.consoleLog}
                  style={{
                    maxHeight: "100%",
                    minHeight: "100%",
                  }}
                >
                  {filteredLogs.map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        marginBottom: 12,
                        lineHeight: 1.7,
                        borderLeft: `3px solid ${
                          log.tipo === "acao"
                            ? "#22d3ee"
                            : log.tipo === "servidor"
                            ? "#f59e0b"
                            : "#10b981"
                        }`,
                        paddingLeft: 8,
                      }}
                    >
                      [
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : "-"}{" "}
                      ]{" "}
                      <span
                        style={{
                          color:
                            log.tipo === "acao"
                              ? "#22d3ee"
                              : log.tipo === "servidor"
                              ? "#f59e0b"
                              : "#10b981",
                          fontWeight: "bold",
                        }}
                      >
                        [{log.origem}]
                      </span>{" "}
                      {/* Logs de ações do banco */}
                      {log.tipo === "acao" && (
                        <>
                          {log.usuario || log.email || "anon"} -{" "}
                          {log.acao || ""} {log.endpoint || ""}
                          {log.ip ? ` IP: ${log.ip}` : ""}
                          {log.status ? ` Status: ${log.status}` : ""}
                          {log.id ? ` ID: ${log.id}` : ""}
                          {log.detalhes && (
                            <ExpandableJson data={log.detalhes} />
                          )}
                        </>
                      )}
                      {/* Logs do servidor */}
                      {log.tipo === "servidor" && (
                        <>
                          <span style={{ color: "#f59e0b" }}>
                            [{log.level?.toUpperCase()}]
                          </span>{" "}
                          {log.action ? `${log.action}: ` : ""}
                          {log.message || log.mensagem}
                          {log.details && (
                            <ExpandableJson
                              data={log.details}
                              label="details"
                            />
                          )}
                        </>
                      )}
                      {/* Logs de auditoria */}
                      {log.tipo === "auditoria" && <span>{log.mensagem}</span>}
                      {/* Exibe todos os campos extras dinamicamente */}
                      {log.tipo === "acao" && (
                        <span style={{ color: "#38bdf8", fontSize: 18 }}>
                          {Object.entries(log)
                            .filter(
                              ([key]) =>
                                ![
                                  "timestamp",
                                  "usuario",
                                  "email",
                                  "acao",
                                  "endpoint",
                                  "detalhes",
                                  "ip",
                                  "status",
                                  "id",
                                  "origem",
                                  "tipo",
                                  "_id",
                                ].includes(key)
                            )
                            .map(([key, value]) => ` ${key}: ${value}`)
                            .join("")}
                        </span>
                      )}
                    </div>
                  ))}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
