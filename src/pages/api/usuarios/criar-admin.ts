import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  try {
    const client = await clientPromise;
    const db = client.db("guia-organico");
    const users = db.collection("users");
    const admin = await users.findOne({ email: "admin@guia-organico.com" });
    if (admin) {
      return res.status(200).json({ message: "Admin já existe." });
    }
    await users.insertOne({
      name: "Administrador",
      email: "admin@guia-organico.com",
      role: "admin",
      credito: 9999,
      password:
        "af89d56f8b00bf3d32a3eee1962ed989bb29434c2e1dd7c6836c8b0bcb5175c0", // igual ao hardcoded
      createdAt: new Date(),
    });
    return res.status(201).json({ message: "Admin criado com sucesso." });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao criar admin." });
  }
}
