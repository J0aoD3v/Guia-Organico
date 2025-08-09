import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("guia-organico"); // Nome do banco
    const products = await db.collection("products").find({}).toArray();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao conectar ao banco ou buscar produtos." });
  }
}
