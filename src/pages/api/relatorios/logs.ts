import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";
import { logAction } from "../../../lib/logAction";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const session = await getSession({ req });
    const usuarioLogado = session?.user?.email;
    if (req.method === "DELETE") {
      // Limpa todos os logs
      const result = await db.collection("logs").deleteMany({});
      await logAction({
        usuario: usuarioLogado || "anon",
        acao: "DELETE",
        endpoint: "/api/relatorios/logs",
        detalhes: { deletedCount: result.deletedCount },
      });
      return res.status(200).json({ deletedCount: result.deletedCount });
    }
    if (req.method === "GET") {
      // Busca todos os logs de ações no banco
      const logs = await db
        .collection("logs")
        .find({})
        .sort({ timestamp: -1 })
        .toArray();
      await logAction({
        usuario: usuarioLogado || "anon",
        acao: "GET",
        endpoint: "/api/relatorios/logs",
        detalhes: {
          totalLogs: logs.length,
          logs: logs.slice(0, 10).map((l) => ({
            timestamp: l.timestamp,
            usuario: l.usuario,
            acao: l.acao,
            endpoint: l.endpoint,
          })),
        },
      });
      return res.status(200).json(logs);
    }
    res.setHeader("Allow", ["GET", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar requisição" });
  }
}
