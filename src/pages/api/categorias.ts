import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("guia-organico");
  const categorias = db.collection("categorias");
  const produtos = db.collection("produtos");

  if (req.method === "GET") {
    const all = await categorias.find({}).sort({ nome: 1 }).toArray();
    return res.status(200).json(all);
  }

  if (req.method === "POST") {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: "Nome obrigatório" });
    const exists = await categorias.findOne({ nome });
    if (exists) return res.status(409).json({ error: "Categoria já existe" });
    const result = await categorias.insertOne({ nome });
    return res.status(201).json({ ok: true, id: result.insertedId });
  }

  if (req.method === "PUT") {
    const { nome, emoji } = req.body;
    if (!nome || !emoji)
      return res.status(400).json({ error: "Nome e emoji obrigatórios" });
    const result = await categorias.updateOne({ nome }, { $set: { emoji } });
    if (result.matchedCount === 0)
      return res.status(404).json({ error: "Categoria não encontrada" });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID obrigatório" });
    const categoria = await categorias.findOne({ _id: new ObjectId(id) });
    if (!categoria)
      return res.status(404).json({ error: "Categoria não encontrada" });
    await categorias.deleteOne({ _id: new ObjectId(id) });
    await produtos.deleteMany({ categoria: categoria.nome });
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}
