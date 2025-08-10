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
  const { password } = req.body;
  if (!password || typeof password !== "string") {
    return res.status(400).json({ error: "Senha inválida" });
  }
  try {
    const session = await getSession({ req });
    const client = await clientPromise;
    const db = client.db("guia-organico");
    const result = await db
      .collection("users")
      .updateOne({ email: "admin@guia-organico.com" }, { $set: { password } });
    if (result.modifiedCount === 1) {
      // Log da atualização da senha do admin
      await logAction({
        usuario: session?.user?.email || "sistema",
        acao: "senha_admin_atualizada",
        endpoint: req.url || "/api/usuarios/update-admin",
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

      return res
        .status(200)
        .json({ message: "Senha do admin atualizada com sucesso." });
    } else {
      // Log da tentativa de atualização sem admin encontrado
      await logAction({
        usuario: session?.user?.email || "sistema",
        acao: "tentativa_atualizar_admin_inexistente",
        endpoint: req.url || "/api/usuarios/update-admin",
        detalhes: {
          method: req.method || "POST",
          adminEmail: "admin@guia-organico.com",
          ipAddress:
            (req.headers["x-forwarded-for"] as string) ||
            req.socket.remoteAddress ||
            "unknown",
          userAgent: req.headers["user-agent"] || "unknown",
          resultado: "admin_nao_encontrado",
        },
      });

      return res.status(404).json({ error: "Admin não encontrado." });
    }
  } catch (err) {
    // Log do erro
    await logAction({
      usuario: "sistema",
      acao: "erro_atualizar_admin",
      endpoint: req.url || "/api/usuarios/update-admin",
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
    return res.status(500).json({ error: "Erro ao atualizar senha do admin." });
  }
}
