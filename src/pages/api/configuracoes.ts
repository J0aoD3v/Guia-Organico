import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("guia-organico");
    const configuracoes = db.collection("configuracoes");

    if (req.method === "GET") {
      // Buscar configurações globais
      const config = await configuracoes.findOne({ chave: "global" });
      const emailNotificacoes = config?.emailNotificacoes ?? true;
      const manutencao = config?.manutencao ?? false;
      const creditoPadrao = config?.creditoPadrao ?? 0;
      return res
        .status(200)
        .json({ emailNotificacoes, manutencao, creditoPadrao });
    }

    if (req.method === "POST") {
      const { emailNotificacoes, manutencao, creditoPadrao } = req.body;
      if (typeof creditoPadrao !== "number" || creditoPadrao < 0) {
        return res.status(400).json({ error: "Crédito inválido" });
      }
      await configuracoes.updateOne(
        { chave: "global" },
        { $set: { emailNotificacoes, manutencao, creditoPadrao } },
        { upsert: true }
      );
      return res
        .status(200)
        .json({ message: "Configurações atualizadas com sucesso" });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end("Método não permitido");
  } catch (err) {
    console.error("Erro na API de configurações:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
