import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";
import { logAction } from "../../../lib/logAction";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const session = await getSession({ req });
    const client = await clientPromise;
    const db = client.db("guia-organico");

    // Buscar histórico dos usuários
    const historico = await db
      .collection("usuarios_historico")
      .find({})
      .sort({ ciclo: -1 })
      .toArray();

    // Log da ação
    await logAction({
      usuario: session?.user?.email || "sistema",
      acao: "relatório_usuarios_consultado",
      endpoint: req.url || "/api/relatorios/usuarios",
      detalhes: {
        method: req.method || "GET",
        totalRegistros: historico.length,
        ipAddress:
          (req.headers["x-forwarded-for"] as string) ||
          req.socket.remoteAddress ||
          "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
        query: req.query,
      },
    });

    res.status(200).json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico de usuários:", error);

    // Log do erro
    await logAction({
      usuario: "sistema",
      acao: "erro_relatório_usuarios",
      endpoint: req.url || "/api/relatorios/usuarios",
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
