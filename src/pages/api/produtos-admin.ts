import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("🚀 [API] Iniciando handler produtos-admin:", req.method);

  try {
    const client = await clientPromise;
    const db = client.db();
    const produtos = db.collection("produtos");
    console.log("✅ [API] Conectado ao MongoDB");

    if (req.method === "GET") {
      // Retorna todos os produtos do catálogo oficial
      const all = await produtos.find({}).sort({ criadoEm: -1 }).toArray();
      return res.status(200).json(all);
    }

    if (req.method === "POST") {
      console.log("📝 [API] Criando novo produto");
      try {
        const {
          nome,
          fabricante,
          categoria,
          finalidade,
          composicao,
          modoUso,
          precaucoes,
          status = "ativo",
        } = req.body;

        if (!nome || !fabricante || !categoria) {
          return res.status(400).json({
            error: "Nome, fabricante e categoria são obrigatórios",
          });
        }

        const novoProduto = {
          nome,
          fabricante,
          categoria,
          finalidade,
          composicao,
          modoUso,
          precaucoes,
          status,
          origem: "manual",
          criadoEm: new Date(),
          criadoPor: "admin",
        };

        console.log("🗄️ [API] Inserindo produto no MongoDB:", novoProduto);
        const result = await produtos.insertOne(novoProduto);
        console.log("✅ [API] Produto criado com sucesso");

        return res.status(201).json({
          ok: true,
          id: result.insertedId,
          message: "Produto criado com sucesso",
        });
      } catch (err) {
        console.error("❌ [API] Erro no POST:", err);
        return res
          .status(500)
          .json({ error: "Erro ao criar produto", details: err.message });
      }
    }

    if (req.method === "PUT") {
      console.log("📝 [API] Atualizando produto");
      try {
        const { id, ...updateData } = req.body;

        if (!id) {
          return res.status(400).json({ error: "ID é obrigatório" });
        }

        const produto = await produtos.findOne({ _id: new ObjectId(id) });
        if (!produto) {
          return res.status(404).json({ error: "Produto não encontrado" });
        }

        await produtos.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              ...updateData,
              atualizadoEm: new Date(),
              atualizadoPor: "admin",
            },
          }
        );

        console.log("✅ [API] Produto atualizado");
        return res
          .status(200)
          .json({ ok: true, message: "Produto atualizado com sucesso" });
      } catch (err) {
        console.error("❌ [API] Erro no PUT:", err);
        return res
          .status(500)
          .json({ error: "Erro ao atualizar produto", details: err.message });
      }
    }

    if (req.method === "DELETE") {
      console.log("📝 [API] Removendo produto");
      try {
        const { id } = req.body;

        if (!id) {
          return res.status(400).json({ error: "ID é obrigatório" });
        }

        const produto = await produtos.findOne({ _id: new ObjectId(id) });
        if (!produto) {
          return res.status(404).json({ error: "Produto não encontrado" });
        }

        // Soft delete - apenas marca como inativo
        await produtos.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: "inativo",
              removidoEm: new Date(),
              removidoPor: "admin",
            },
          }
        );

        console.log("✅ [API] Produto removido (soft delete)");
        return res
          .status(200)
          .json({ ok: true, message: "Produto removido com sucesso" });
      } catch (err) {
        console.error("❌ [API] Erro no DELETE:", err);
        return res
          .status(500)
          .json({ error: "Erro ao remover produto", details: err.message });
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
