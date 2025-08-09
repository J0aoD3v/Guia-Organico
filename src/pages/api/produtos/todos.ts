import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("guia-organico");

    const produtos = await db
      .collection("produtos")
      .find({ status: "ativo" })
      .sort({ criadoEm: -1 })
      .toArray();

    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao buscar todos os produtos:", error);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
}
