import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";
import { logAction } from "../../../lib/logAction";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const session = await getSession({ req });
    const client = await clientPromise;
    const db = client.db();

    // Contar logs antes de limpar
    const logCount = await db.collection("logs").countDocuments();

    await db.collection("logs").deleteMany({});

    // Log da limpeza de logs
    await logAction({
      usuario: session?.user?.email || "sistema",
      acao: "logs_limpos",
      endpoint: req.url || "/api/logs/clear",
      detalhes: {
        method: req.method || "POST",
        logsRemovidosCount: logCount,
        ipAddress:
          (req.headers["x-forwarded-for"] as string) ||
          req.socket.remoteAddress ||
          "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
        resultado: "sucesso",
      },
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    // Log do erro
    await logAction({
      usuario: "sistema",
      acao: "erro_limpar_logs",
      endpoint: req.url || "/api/logs/clear",
      detalhes: {
        method: req.method || "POST",
        erro: err.message,
        stack: err.stack,
        ipAddress:
          (req.headers["x-forwarded-for"] as string) ||
          req.socket.remoteAddress ||
          "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
      },
    });
    res.status(500).json({ error: "Erro ao limpar logs" });
  }
}
