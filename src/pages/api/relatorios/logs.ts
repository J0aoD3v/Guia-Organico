import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    // Busca todos os logs de ações no banco
    const logs = await db
      .collection("logs")
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar logs" });
  }
}
