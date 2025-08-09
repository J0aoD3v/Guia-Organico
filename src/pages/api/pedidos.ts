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
      // Retorna a contagem de pedidos do usuário no mês
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
      // Retorna todos os pedidos
      const all = await pedidos.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(all);
    }

    if (req.method === "POST") {
      console.log("📝 [API] Processando POST de pedido");
      try {
        console.log("📄 [API] Fazendo parse do formulário...");
        const { fields, files } = await parseForm(req);
        console.log("📄 [API] Formulário parseado:", {
          fields: Object.keys(fields),
          files: Object.keys(files),
        });
        console.log("📄 [API] Detalhes dos arquivos:", files);

        // Salva arquivos localmente (pode ser ajustado para cloud)
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

        console.log("💾 [API] Salvando arquivos:", { fichaPath, bulaPath });
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
          status: 'pendente',
          createdAt: new Date(),
        };
        console.log("🗄️ [API] Inserindo no MongoDB:", pedido);
        await pedidos.insertOne(pedido);
        console.log("✅ [API] Pedido salvo com sucesso");
        return res.status(201).json({ ok: true });
      } catch (err) {
        console.error("❌ [API] Erro no POST:", err);
        return res
          .status(500)
          .json({ error: "Erro ao salvar pedido", details: err.message });
      }
    }

    if (req.method === "PUT") {
      console.log("📝 [API] Processando PUT de pedido");
      try {
        const { id, action, motivo } = req.body;
        
        if (!id || !action) {
          return res.status(400).json({ error: "ID e ação são obrigatórios" });
        }

        const pedido = await pedidos.findOne({ _id: new ObjectId(id) });
        if (!pedido) {
          return res.status(404).json({ error: "Pedido não encontrado" });
        }

        if (action === 'aprovar') {
          // Atualizar status do pedido
          await pedidos.updateOne(
            { _id: new ObjectId(id) },
            { 
              $set: { 
                status: 'aprovado',
                aprovadoEm: new Date(),
                aprovadoPor: 'admin'
              }
            }
          );

          // Adicionar produto ao catálogo oficial
          const produtos = db.collection("produtos");
          await produtos.insertOne({
            nome: pedido.nome,
            fabricante: pedido.fabricante,
            categoria: pedido.categoria,
            finalidade: pedido.finalidade,
            fichaPath: pedido.fichaPath,
            bulaPath: pedido.bulaPath,
            status: 'ativo',
            origem: 'pedido_aprovado',
            pedidoId: id,
            criadoEm: new Date(),
            criadoPor: 'admin'
          });

          console.log("✅ [API] Pedido aprovado e produto adicionado ao catálogo");
          return res.status(200).json({ ok: true, message: "Pedido aprovado com sucesso" });

        } else if (action === 'rejeitar') {
          // Atualizar status do pedido
          await pedidos.updateOne(
            { _id: new ObjectId(id) },
            { 
              $set: { 
                status: 'rejeitado',
                rejeitadoEm: new Date(),
                rejeitadoPor: 'admin',
                motivoRejeicao: motivo
              }
            }
          );

          console.log("✅ [API] Pedido rejeitado");
          return res.status(200).json({ ok: true, message: "Pedido rejeitado" });
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
