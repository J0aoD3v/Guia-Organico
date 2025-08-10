import { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import styles from "./logs.module.css";
import Head from "next/head";
import { family } from "detect-libc";

export default function VisualizarLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      const res = await fetch("/api/relatorios/logs");
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Coral+Pixels&family=Jersey+10&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Navbar />
        <div
          style={{
            width: "100vw",
            margin: 0,
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              background: "#27272a",
              boxShadow: "0 2px 16px #0002",
              padding: 0,
              width: "100%",
              maxWidth: 900,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                color: "#22d3ee",
                fontFamily: "'Jersey 10'",
                fontSize: 40,
                padding: "8px 24px",
                margin: 0,
                borderBottom: "1px solid #222",
                textAlign: "center",
              }}
            >
              📋 Logs do Sistema
            </h2>
            <div
              style={{
                padding: 0,
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              {loading ? (
                <div style={{ color: "#a3e635", fontSize: 18, padding: 32 }}>
                  Carregando logs...
                </div>
              ) : logs.length === 0 ? (
                <div style={{ color: "#ef4444", fontSize: 16, padding: 32 }}>
                  Nenhum log encontrado.
                </div>
              ) : (
                <pre
                  className={styles.consoleLog}
                  style={{
                    background: "#18181b",
                    color: "#22c55e",
                    padding: 30,
                    fontSize: 30,
                    overflow: "auto",
                    maxHeight: 400,
                    margin: 0,
                    width: "100%",
                    boxSizing: "border-box",
                    textAlign: "left",
                    fontFamily: "'Jersey 10', sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                  }}
                >
                  {logs.map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        marginBottom: 12,
                        lineHeight: 1.7,
                      }}
                    >
                      [{new Date(log.timestamp).toLocaleString()}]{" "}
                      {log.usuario || log.email || "anon"} - {log.acao}{" "}
                      {log.endpoint}{" "}
                      {log.detalhes ? JSON.stringify(log.detalhes) : ""}
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
