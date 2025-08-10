import clientPromise from "./db";

// Interceptar console.log e console.error para salvar no banco
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleInfo = console.info;

let isIntercepting = false;

export function initializeServerLogging() {
  if (isIntercepting) return;
  isIntercepting = true;

  console.log = (...args: any[]) => {
    originalConsoleLog(...args);
    saveServerLog("log", args);
  };

  console.error = (...args: any[]) => {
    originalConsoleError(...args);
    saveServerLog("error", args);
  };

  console.warn = (...args: any[]) => {
    originalConsoleWarn(...args);
    saveServerLog("warn", args);
  };

  console.info = (...args: any[]) => {
    originalConsoleInfo(...args);
    saveServerLog("info", args);
  };
}

async function saveServerLog(level: string, args: any[]) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Converter argumentos para string
    const message = args
      .map((arg) => {
        if (typeof arg === "object") {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        const argStr = String(arg);
        return argStr;
      })
      .join(" ");

    await db.collection("server_logs").insertOne({
      level,
      message,
      timestamp: new Date(),
      type: "server_console",
    });
  } catch (err) {
    // Usar console original para evitar loop infinito
    originalConsoleError("Erro ao salvar log do servidor:", err);
  }
}

export async function logServerAction(action: string, details: any = {}) {
  try {
    const client = await clientPromise;
    const db = client.db();

    await db.collection("server_logs").insertOne({
      level: "info",
      action,
      details,
      timestamp: new Date(),
      type: "server_action",
    });
  } catch (err) {
    originalConsoleError("Erro ao salvar ação do servidor:", err);
  }
}
