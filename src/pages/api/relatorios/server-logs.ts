import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";
import { logAction } from "../../../lib/logAction";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    try {
      const client = await clientPromise;
      const db = client.db();
      const session = await getSession({ req });
      const usuarioLogado = session?.user?.email || "anon";
      // Limpa todos os logs do servidor
      const result = await db.collection("server_logs").deleteMany({});
      await logAction({
        usuario: usuarioLogado,
        acao: "DELETE",
        endpoint: "/api/relatorios/server-logs",
        detalhes: { deletedCount: result.deletedCount },
      });
      return res.status(200).json({ deletedCount: result.deletedCount });
    } catch (error) {
      console.error("Erro ao limpar logs do servidor:", error);
      return res
        .status(500)
        .json({ message: "Erro ao limpar logs do servidor" });
    }
  }
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET", "DELETE"]);
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const session = await getSession({ req });
    const usuarioLogado = session?.user?.email;

    const { type, level, limit = "100" } = req.query;

    // Construir filtro baseado nos parâmetros
    const filter: any = {};
    if (type) filter.type = type;
    if (level) filter.level = level;

    // Buscar logs do servidor
    const serverLogs = await db
      .collection("server_logs")
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(String(limit)))
      .toArray();

    // Log da consulta
    await logAction({
      usuario: usuarioLogado || "sistema",
      acao: "consulta_logs_servidor",
      endpoint: req.url || "/api/relatorios/server-logs",
      detalhes: {
        method: req.method || "GET",
        filtros: { type, level, limit },
        totalEncontrados: serverLogs.length,
        ipAddress:
          (req.headers["x-forwarded-for"] as string) ||
          req.socket.remoteAddress ||
          "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
      },
    });

    res.status(200).json(serverLogs);
  } catch (error) {
    console.error("Erro ao buscar logs do servidor:", error);

    // Log do erro
    await logAction({
      usuario: "sistema",
      acao: "erro_consulta_logs_servidor",
      endpoint: req.url || "/api/relatorios/server-logs",
      detalhes: {
        method: req.method || "GET",
        erro: error.message,
        stack: error.stack,
        ipAddress:
          (req.headers["x-forwarded-for"] as string) ||
          req.socket.remoteAddress ||
          "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
      },
    });

    res.status(500).json({ message: "Erro interno do servidor" });
  }
}
