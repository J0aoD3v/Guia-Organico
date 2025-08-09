import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db("guia-organico");
    const configuracoes = db.collection("configuracoes");

    if (req.method === "GET") {
      const config = await configuracoes.findOne({ chave: "limitePedidos" });
      const limitePedidos = config?.valor ?? 5; // Valor padrão: 5
      return res.status(200).json({ limitePedidos });
    }

    if (req.method === "POST") {
      const { limitePedidos } = req.body;
      if (typeof limitePedidos !== "number" || limitePedidos < 1) {
        return res.status(400).json({ error: "Limite inválido" });
      }

      await configuracoes.updateOne(
        { chave: "limitePedidos" },
        { $set: { valor: limitePedidos } },
        { upsert: true }
      );

      return res.status(200).json({ message: "Limite atualizado com sucesso" });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end("Método não permitido");
  } catch (err) {
    console.error("Erro na API de configurações:", err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}