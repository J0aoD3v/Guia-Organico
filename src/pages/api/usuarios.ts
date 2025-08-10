import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("[API][usuarios] Iniciando handler", { method: req.method });
  const client = await clientPromise;
  console.log("[API][usuarios] Conectado ao MongoDB");
  const db = client.db();
  const collection = db.collection("users");

  if (req.method === "GET") {
    // Listar todos os usuários
    console.log("[API][usuarios][GET] Buscando todos os usuários...");
    const usuarios = await collection.find({}).toArray();
    console.log("[API][usuarios][GET] Usuários encontrados:", usuarios);
    return res.status(200).json(usuarios);
  }

  if (req.method === "PUT") {
    // Editar usuário
    console.log("[API][usuarios][PUT] Dados recebidos:", req.body);
    const { id, credito } = req.body;
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { credito } }
    );
    console.log("[API][usuarios][PUT] Resultado do update:", result);
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    // Deletar usuário e suas solicitações
    console.log("[API][usuarios][DELETE] Dados recebidos:", req.body);
    const { id } = req.body;
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });
    console.log("[API][usuarios][DELETE] Resultado do delete:", deleteResult);
    // Opcional: deletar pedidos do usuário
    const pedidos = db.collection("pedidos");
    const pedidosDeleteResult = await pedidos.deleteMany({ usuarioId: id });
    console.log(
      "[API][usuarios][DELETE] Pedidos deletados:",
      pedidosDeleteResult
    );
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
  console.log("[API][usuarios] Método não permitido:", req.method);
}
