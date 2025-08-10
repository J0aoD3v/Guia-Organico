import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";

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
    // Buscar histórico dos usuários
    const historico = await db
      .collection("usuarios_historico")
      .find({})
      .sort({ ciclo: -1 })
      .toArray();
    res.status(200).json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico de usuários:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}
