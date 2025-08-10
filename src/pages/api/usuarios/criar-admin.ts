import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/db";
import { logAction } from "../../../lib/logAction";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  try {
    const session = await getSession({ req });
    const client = await clientPromise;
    const db = client.db("guia-organico");
    const users = db.collection("users");
    const admin = await users.findOne({ email: "admin@guia-organico.com" });
    if (admin) {
      // Log da tentativa de criar admin existente
      await logAction({
        usuario: session?.user?.email || "sistema",
        acao: "tentativa_criar_admin_existente",
        endpoint: req.url || "/api/usuarios/criar-admin",
        detalhes: {
          method: req.method || "POST",
          ipAddress:
            (req.headers["x-forwarded-for"] as string) ||
            req.socket.remoteAddress ||
            "unknown",
          userAgent: req.headers["user-agent"] || "unknown",
          resultado: "admin_ja_existe",
        },
      });
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

    // Log da criação do admin
    await logAction({
      usuario: session?.user?.email || "sistema",
      acao: "admin_criado",
      endpoint: req.url || "/api/usuarios/criar-admin",
      detalhes: {
        method: req.method || "POST",
        adminEmail: "admin@guia-organico.com",
        ipAddress:
          (req.headers["x-forwarded-for"] as string) ||
          req.socket.remoteAddress ||
          "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
        resultado: "sucesso",
      },
    });

    return res.status(201).json({ message: "Admin criado com sucesso." });
  } catch (err) {
    // Log do erro
    await logAction({
      usuario: "sistema",
      acao: "erro_criar_admin",
      endpoint: req.url || "/api/usuarios/criar-admin",
      detalhes: {
        method: req.method || "POST",
        erro: err.message,
        stack: err.stack,
        ipAddress:
          (req.headers["x-forwarded-for"] as string) ||
          req.socket.remoteAddress ||
          "unknown",
        userAgent: req.headers["user-agent"] || "unknown",
      },
    });
    return res.status(500).json({ error: "Erro ao criar admin." });
  }
}
