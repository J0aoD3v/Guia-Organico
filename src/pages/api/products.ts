import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("guia-organico"); // Nome do banco
  const { q, categoria, id } = req.query;

    const filter: any = {};
    if (q && typeof q === "string" && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [
        { nome: regex },
        { fabricante: regex },
        { categoria: regex },
        { certificacao: regex },
        { classeAgronomica: regex },
      ];
    }
    if (categoria && typeof categoria === "string" && categoria.trim()) {
      filter.categoria = categoria.trim();
    }

    if (id && typeof id === "string") {
      let one: any = null;
      if (ObjectId.isValid(id)) {
        one = await db.collection("products").findOne({ _id: new ObjectId(id) });
      } else {
        // Alguns registros podem usar string como _id; usar casting para evitar erro de tipagem
        one = await db.collection("products").findOne({ _id: id } as any);
      }
      return res.status(200).json(one);
    }

    const products = await db.collection("products").find(filter).limit(100).toArray();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao conectar ao banco ou buscar produtos." });
  }
}
