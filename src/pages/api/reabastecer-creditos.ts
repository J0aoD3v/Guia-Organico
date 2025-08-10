import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("guia-organico");
    const config = await db
      .collection("configuracoes")
      .findOne({ chave: "global" });
    const creditoPadrao = config?.creditoPadrao ?? 0;
    const result = await db
      .collection("users")
      .updateMany(
        { role: { $ne: "admin" } },
        { $set: { credito: creditoPadrao, solicitacoesMes: 0 } }
      );
    res
      .status(200)
      .json({
        success: true,
        modifiedCount: result.modifiedCount,
        creditoPadrao,
      });
  } catch (error) {
    console.error("Erro ao reabastecer créditos:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}
