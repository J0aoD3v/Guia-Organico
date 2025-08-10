import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";
import { logAction } from "../../lib/logAction";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("🚀 [API] Iniciando handler produtos:", req.method);

  try {
    const client = await clientPromise;
    const db = client.db("guia-organico");
    const produtos = db.collection("produtos");
    const session = await getSession({ req });
    const usuarioLogado = session?.user?.email;
    console.log("✅ [API] Conectado ao MongoDB");

    if (req.method === "GET") {
      const { q, categoria, id } = req.query;

      const filter: any = {};

      // Filtrar apenas produtos ativos para consultas públicas
      // Se vier de admin, não filtrar por status
      const isAdminRequest = req.headers.referer?.includes("/admin");
      if (!isAdminRequest) {
        filter.status = "ativo";
      }

      if (q && typeof q === "string" && q.trim()) {
        const regex = new RegExp(q.trim(), "i");
        filter.$or = [
          { nome: regex },
          { fabricante: regex },
          { categoria: regex },
          { certificacao: regex },
          { classeAgronomica: regex },
          { finalidade: regex },
          { composicao: regex },
        ];
      }

      if (categoria && typeof categoria === "string" && categoria.trim()) {
        filter.categoria = categoria.trim();
      }

      // Se solicitar um produto específico por ID
      if (id && typeof id === "string") {
        let produto: any = null;
        if (ObjectId.isValid(id)) {
          produto = await produtos.findOne({ _id: new ObjectId(id) });
        } else {
          produto = await produtos.findOne({ _id: id } as any);
        }
        return res.status(200).json(produto);
      }

      // Listar produtos
      const result = await produtos
        .find(filter)
        .sort({ criadoEm: -1 })
        .toArray();

      await logAction({
        usuario: usuarioLogado || req.query.email || "anon",
        acao: "GET",
        endpoint: "/api/produtos",
        detalhes: {
          totalProdutos: result.length,
          filtros: filter,
          produtos: result.map((p) => ({
            _id: p._id,
            nome: p.nome,
            fabricante: p.fabricante,
            categoria: p.categoria,
            status: p.status,
            criadoEm: p.criadoEm,
          })),
        },
      });

      return res.status(200).json(result);
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
          certificacao,
          classeAgronomica,
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
          certificacao,
          classeAgronomica,
          status,
          origem: "manual",
          criadoEm: new Date(),
          criadoPor: "admin",
        };

        console.log("🗄️ [API] Inserindo produto no MongoDB:", novoProduto);
        const result = await produtos.insertOne(novoProduto);
        console.log("✅ [API] Produto criado com sucesso");

        await logAction({
          usuario: usuarioLogado || "anon",
          acao: "POST",
          endpoint: "/api/produtos",
          detalhes: { produtoId: result.insertedId, produto: novoProduto },
        });

        return res.status(201).json({
          message: "Produto criado com sucesso",
          produto: { _id: result.insertedId, ...novoProduto },
        });
      } catch (error) {
        console.error("❌ [API] Erro ao criar produto:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
    }

    if (req.method === "PUT") {
      console.log("📝 [API] Atualizando produto");
      try {
        const { id } = req.query;
        const updateData = req.body;

        if (!id) {
          return res.status(400).json({ error: "ID do produto é obrigatório" });
        }

        // Remove campos que não devem ser atualizados diretamente
        delete updateData._id;
        delete updateData.criadoEm;
        delete updateData.criadoPor;

        // Adiciona timestamp de atualização
        updateData.atualizadoEm = new Date();

        let result;
        if (ObjectId.isValid(id as string)) {
          result = await produtos.updateOne(
            { _id: new ObjectId(id as string) },
            { $set: updateData }
          );
        } else {
          result = await produtos.updateOne(
            { _id: id as any },
            { $set: updateData }
          );
        }

        if (result.matchedCount === 0) {
          return res.status(404).json({ error: "Produto não encontrado" });
        }

        await logAction({
          usuario: usuarioLogado || "anon",
          acao: "PUT",
          endpoint: "/api/produtos",
          detalhes: { produtoId: id, updateData },
        });

        console.log("✅ [API] Produto atualizado com sucesso");
        return res
          .status(200)
          .json({ message: "Produto atualizado com sucesso" });
      } catch (error) {
        console.error("❌ [API] Erro ao atualizar produto:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
    }

    if (req.method === "DELETE") {
      console.log("🗑️ [API] Deletando produto");
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ error: "ID do produto é obrigatório" });
        }

        let result;
        if (ObjectId.isValid(id as string)) {
          result = await produtos.deleteOne({
            _id: new ObjectId(id as string),
          });
        } else {
          result = await produtos.deleteOne({ _id: id as any });
        }

        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Produto não encontrado" });
        }

        await logAction({
          usuario: usuarioLogado || "anon",
          acao: "DELETE",
          endpoint: "/api/produtos",
          detalhes: { produtoId: id },
        });

        console.log("✅ [API] Produto deletado com sucesso");
        return res
          .status(200)
          .json({ message: "Produto deletado com sucesso" });
      } catch (error) {
        console.error("❌ [API] Erro ao deletar produto:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
    }

    return res.status(405).json({ error: "Método não permitido" });
  } catch (error) {
    console.error("❌ [API] Erro geral na API produtos:", error);
    res
      .status(500)
      .json({ error: "Erro ao conectar ao banco ou processar requisição." });
  }
}
