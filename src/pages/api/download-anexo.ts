import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { pedidoId, tipo } = req.query;
  if (!pedidoId || !tipo || (tipo !== "ficha" && tipo !== "bula")) {
    return res.status(400).json({ message: "Parâmetros inválidos" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("guia-organico");
    const pedido = await db
      .collection("pedidos")
      .findOne({ _id: new ObjectId(String(pedidoId)) });
    console.log("[DEBUG] Pedido encontrado:", pedido);
    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }
    const info = tipo === "ficha" ? pedido.fichaInfo : pedido.bulaInfo;
    console.log(`[DEBUG] info (${tipo}):`, info);
    if (info && info.buffer) {
      console.log("[DEBUG] info.buffer type:", typeof info.buffer);
      if (Buffer.isBuffer(info.buffer)) {
        console.log(
          "[DEBUG] info.buffer é Buffer nativo, length:",
          info.buffer.length
        );
      } else if (
        info.buffer?.type === "Buffer" &&
        Array.isArray(info.buffer.data)
      ) {
        console.log(
          "[DEBUG] info.buffer é objeto Buffer, length:",
          info.buffer.data.length
        );
      } else if (info.buffer && info.buffer._bsontype === "Binary") {
        console.log(
          "[DEBUG] info.buffer é Binary BSON, length:",
          info.buffer.length || info.buffer.buffer?.length
        );
      } else {
        console.log("[DEBUG] info.buffer formato desconhecido:", info.buffer);
      }
    }
    if (!info || !info.buffer) {
      return res.status(404).json({ message: "Arquivo não encontrado" });
    }
    let fileBuffer;
    if (Buffer.isBuffer(info.buffer)) {
      fileBuffer = info.buffer;
    } else if (
      info.buffer?.type === "Buffer" &&
      Array.isArray(info.buffer.data)
    ) {
      fileBuffer = Buffer.from(info.buffer.data);
    } else if (
      info.buffer &&
      info.buffer._bsontype === "Binary" &&
      typeof info.buffer.buffer === "object"
    ) {
      fileBuffer = Buffer.from(info.buffer.buffer);
    } else {
      return res.status(404).json({ message: "Buffer inválido" });
    }
    res.setHeader("Content-Type", info.tipo || "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=\"${info.nome}\"`);
    res.send(fileBuffer);
  } catch (error) {
    console.error("Erro ao baixar anexo:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}
