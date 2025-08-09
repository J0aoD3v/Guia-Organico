import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from "formidable";
import fs from "fs";

async function parseForm(
  req: NextApiRequest
): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

async function readJsonBody(req: NextApiRequest): Promise<any> {
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  return JSON.parse(Buffer.concat(buffers).toString());
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("🚀 [API] Iniciando handler pedidos:", req.method);

  try {
    const client = await clientPromise;
    const db = client.db();
    const pedidos = db.collection("pedidos");
    console.log("✅ [API] Conectado ao MongoDB");

    if (req.method === "GET") {
      const { email } = req.query;
      if (email) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const count = await pedidos.countDocuments({
          email,
          createdAt: { $gte: firstDay, $lte: lastDay },
        });
        return res.status(200).json({ count });
      }
      const all = await pedidos.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(all);
    }

    if (req.method === "POST") {
      try {
        const { fields, files } = await parseForm(req);
        const fichaFile = Array.isArray(files.ficha)
          ? files.ficha[0]
          : files.ficha;
        const bulaFile = Array.isArray(files.bula) ? files.bula[0] : files.bula;

        const fichaPath = fichaFile
          ? `uploads/${Date.now()}_${
              fichaFile.originalFilename || fichaFile.newFilename
            }`
          : null;
        const bulaPath = bulaFile
          ? `uploads/${Date.now()}_${
              bulaFile.originalFilename || bulaFile.newFilename
            }`
          : null;

        if (fichaFile && fichaFile.filepath) {
          fs.copyFileSync(fichaFile.filepath, fichaPath);
        }
        if (bulaFile && bulaFile.filepath) {
          fs.copyFileSync(bulaFile.filepath, bulaPath);
        }

        const pedido = {
          email: Array.isArray(fields.email) ? fields.email[0] : fields.email,
          nome: Array.isArray(fields.nome) ? fields.nome[0] : fields.nome,
          fabricante: Array.isArray(fields.fabricante)
            ? fields.fabricante[0]
            : fields.fabricante,
          categoria: Array.isArray(fields.categoria)
            ? fields.categoria[0]
            : fields.categoria,
          finalidade: Array.isArray(fields.finalidade)
            ? fields.finalidade[0]
            : fields.finalidade,
          fichaPath,
          bulaPath,
          status: "pendente",
          createdAt: new Date(),
        };
        await pedidos.insertOne(pedido);
        return res.status(201).json({ ok: true });
      } catch (err) {
        console.error("❌ [API] Erro no POST:", err);
        return res
          .status(500)
          .json({ error: "Erro ao salvar pedido", details: err.message });
      }
    }

    if (req.method === "PUT") {
      try {
        const body = await readJsonBody(req);
        const { id, action, motivo } = body;

        if (!id || !action) {
          return res.status(400).json({ error: "ID e ação são obrigatórios" });
        }

        const pedido = await pedidos.findOne({ _id: new ObjectId(id) });
        if (!pedido) {
          return res.status(404).json({ error: "Pedido não encontrado" });
        }

        if (action === "aprovar") {
          await pedidos.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: "aprovado",
                aprovadoEm: new Date(),
                aprovadoPor: "admin",
              },
            }
          );

          const produtos = db.collection("produtos");
          await produtos.insertOne({
            nome: pedido.nome,
            fabricante: pedido.fabricante,
            categoria: pedido.categoria,
            finalidade: pedido.finalidade,
            fichaPath: pedido.fichaPath,
            bulaPath: pedido.bulaPath,
            status: "ativo",
            origem: "pedido_aprovado",
            pedidoId: id,
            criadoEm: new Date(),
            criadoPor: "admin",
          });

          return res
            .status(200)
            .json({ ok: true, message: "Pedido aprovado com sucesso" });
        } else if (action === "rejeitar") {
          await pedidos.deleteOne({ _id: new ObjectId(id) });
          return res
            .status(200)
            .json({ ok: true, message: "Pedido rejeitado e excluído" });
        }

        return res.status(400).json({ error: "Ação inválida" });
      } catch (err) {
        console.error("❌ [API] Erro no PUT:", err);
        return res
          .status(500)
          .json({ error: "Erro ao atualizar pedido", details: err.message });
      }
    }

    res.status(405).end();
  } catch (err) {
    console.error("❌ [API] Erro geral:", err);
    return res
      .status(500)
      .json({ error: "Erro interno do servidor", details: err.message });
  }
}
