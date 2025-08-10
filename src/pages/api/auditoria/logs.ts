import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { logAction } from "../../../lib/logAction";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  const usuarioLogado = session?.user?.email;

  // Caminho do arquivo de log do servidor
  const logPath = path.resolve(process.cwd(), "server.log");
  try {
    if (!fs.existsSync(logPath)) {
      await logAction({
        usuario: usuarioLogado || "anon",
        acao: "GET",
        endpoint: "/api/auditoria/logs",
        detalhes: {
          serverLogsFound: false,
          message: "Nenhum log de servidor encontrado",
        },
      });

      return res
        .status(200)
        .json({ logs: ["Nenhum log de servidor encontrado."] });
    }
    const data = fs.readFileSync(logPath, "utf-8");
    const logs = data.split("\n").filter(Boolean).slice(-200); // últimos 200 logs

    await logAction({
      usuario: usuarioLogado || "anon",
      acao: "GET",
      endpoint: "/api/auditoria/logs",
      detalhes: {
        serverLogsFound: true,
        totalServerLogs: logs.length,
        recentLogs: logs.slice(-5), // Apenas os 5 mais recentes
      },
    });

    return res.status(200).json({ logs });
  } catch (err) {
    await logAction({
      usuario: usuarioLogado || "anon",
      acao: "GET",
      endpoint: "/api/auditoria/logs",
      detalhes: {
        error: "Erro ao ler logs do servidor",
        errorMessage: err.message,
      },
    });

    return res.status(500).json({ error: "Erro ao ler logs do servidor." });
  }
}
