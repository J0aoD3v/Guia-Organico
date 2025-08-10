import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";
import { logAction } from "../../lib/logAction";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("[API][usuarios] Iniciando handler", { method: req.method });
  const client = await clientPromise;
  console.log("[API][usuarios] Conectado ao MongoDB");
  const db = client.db();
  const collection = db.collection("users");
  const session = await getSession({ req });
  const usuarioLogado = session?.user?.email;

  if (req.method === "GET") {
    // Listar todos os usuários
    console.log("[API][usuarios][GET] Buscando todos os usuários...");
    const usuarios = await collection.find({}).toArray();
    console.log("[API][usuarios][GET] Usuários encontrados:", usuarios);
    await logAction({
      usuario: usuarioLogado || req.query.email || "anon",
      acao: "GET",
      endpoint: "/api/usuarios",
      detalhes: {
        totalUsuarios: usuarios.length,
        usuarios: usuarios.map((u) => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          credito: u.credito,
          provider: u.provider,
          createdAt: u.createdAt,
          solicitacoesMes: u.solicitacoesMes,
        })),
      },
    });
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
    await logAction({
      usuario: usuarioLogado || req.body.email || "anon",
      acao: "PUT",
      endpoint: "/api/usuarios",
      detalhes: req.body,
    });
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
    await logAction({
      usuario: usuarioLogado || req.body.email || "anon",
      acao: "DELETE",
      endpoint: "/api/usuarios",
      detalhes: req.body,
    });
    return res.status(200).json({ success: true });
  }

  if (req.method === "POST") {
    // Criar novo usuário
    console.log("[API][usuarios][POST] Dados recebidos:", req.body);
    const { nome, email, senha } = req.body;
    const result = await collection.insertOne({ nome, email, senha });
    console.log("[API][usuarios][POST] Usuário criado:", result);
    await logAction({
      usuario: usuarioLogado || req.body.email || "anon",
      acao: "POST",
      endpoint: "/api/usuarios",
      detalhes: req.body,
    });
    return res.status(201).json({ success: true, id: result.insertedId });
  }

  res.status(405).end();
  console.log("[API][usuarios] Método não permitido:", req.method);
}
