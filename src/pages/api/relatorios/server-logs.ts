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

    // Processar logs para extrair JSON separadamente
    const processedLogs = serverLogs.map((log) => {
      const processedLog = { ...log };

      // Tentar extrair JSON da mensagem
      if (log.message && typeof log.message === "string") {
        try {
          // Tenta encontrar JSON na mensagem de forma mais robusta
          let jsonMatch = null;

          // Primeiro tenta encontrar arrays JSON (mais comum em logs)
          const arrayMatches = log.message.match(/\[[\s\S]*?\]/g);
          if (arrayMatches) {
            // Tenta parsear cada match de array encontrado
            for (const match of arrayMatches) {
              try {
                const parsed = JSON.parse(match);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  jsonMatch = { match, parsed };
                  break;
                }
              } catch {
                continue;
              }
            }
          }

          // Se não encontrou array válido, tenta objetos
          if (!jsonMatch) {
            const objectMatches = log.message.match(/\{[\s\S]*?\}/g);
            if (objectMatches) {
              for (const match of objectMatches) {
                try {
                  const parsed = JSON.parse(match);
                  if (parsed && typeof parsed === "object") {
                    jsonMatch = { match, parsed };
                    break;
                  }
                } catch {
                  continue;
                }
              }
            }
          }

          // Se encontrou JSON válido, processa
          if (jsonMatch) {
            processedLog.extractedJson = jsonMatch.parsed;
            processedLog.messageWithoutJson = log.message
              .replace(jsonMatch.match, "")
              .trim();
          }
        } catch (error) {
          // Se não conseguir extrair JSON, mantém o log original
          console.error("Erro ao processar JSON do log:", error);
        }
      }

      return processedLog;
    });

    // Log da consulta
    await logAction({
      usuario: usuarioLogado || "sistema",
      acao: "consulta_logs_servidor",
      endpoint: req.url || "/api/relatorios/server-logs",
      detalhes: {
        method: req.method || "GET",
        filtros: { type, level, limit },
        totalEncontrados: processedLogs.length,
        ipAddress:
          (req.headers["x-forwarded-for"] as string) ||
          req.socket.remoteAddress ||
          "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
      },
    });

    res.status(200).json(processedLogs);
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
