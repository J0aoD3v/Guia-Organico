import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  const { password } = req.body;
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Senha inválida" });
  }
  try {
    const client = await clientPromise;
    const db = client.db("guia-organico");
    const result = await db
      .collection("users")
      .updateOne({ email: "admin@guia-organico.com" }, { $set: { password } });
    if (result.modifiedCount === 1) {
      return res
        .status(200)
        .json({ message: "Senha do admin atualizada com sucesso." });
    } else {
      return res.status(404).json({ error: "Admin não encontrado." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Erro ao atualizar senha do admin." });
  }
}
