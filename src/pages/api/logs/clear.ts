import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("logs").deleteMany({});
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Erro ao limpar logs" });
  }
}
