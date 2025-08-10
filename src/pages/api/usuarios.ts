import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("users");

  if (req.method === "GET") {
    // Listar todos os usuários
    const usuarios = await collection.find({}).toArray();
    return res.status(200).json(usuarios);
  }

  if (req.method === "PUT") {
    // Editar usuário
    const { id, credito } = req.body;
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { credito } }
    );
    return res.status(200).json({ success: true });
  }

  if (req.method === "DELETE") {
    // Deletar usuário e suas solicitações
    const { id } = req.body;
    await collection.deleteOne({ _id: new ObjectId(id) });
    // Opcional: deletar pedidos do usuário
    const pedidos = db.collection("pedidos");
    await pedidos.deleteMany({ usuarioId: id });
    return res.status(200).json({ success: true });
  }

  res.status(405).end();
}
