import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";
import { ObjectId } from "mongodb";
import formidable from "formidable";
import { logAction } from "../../lib/logAction";
import { getSession } from "next-auth/react";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(
  req: NextApiRequest
): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    console.log("📋 [PARSEFORM] Iniciando parse do formulário...");
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("❌ [PARSEFORM] Erro ao fazer parse:", err);
        reject(err);
      } else {
        console.log("✅ [PARSEFORM] Parse concluído");
        resolve({ fields, files });
      }
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

  // Recupera sessão do usuário
  const session = await getSession({ req });
  const usuarioLogado = session?.user?.email;

  try {
    const client = await clientPromise;
    const db = client.db("guia-organico");
    const pedidos = db.collection("pedidos");
    console.log("✅ [API] Conectado ao MongoDB");

    if (req.method === "GET") {
      const { email, status, categoria } = req.query;
      // Se email, retorna todos os pedidos do usuário
      if (email) {
        const pedidosUsuario = await pedidos
          .find({ email })
          .sort({ createdAt: -1 })
          .toArray();
        return res.status(200).json(pedidosUsuario);
      }
      // Monta filtro dinâmico
      const filtro: any = {};
      if (status) filtro.status = status;
      if (categoria) filtro.categoria = categoria;
      const all = await pedidos.find(filtro).sort({ createdAt: -1 }).toArray();
      await logAction({
        usuario: usuarioLogado || req.query.email || "anon",
        acao: "GET",
        endpoint: "/api/pedidos",
      });
      return res.status(200).json(all);
    }

    if (req.method === "POST") {
      console.log("📨 [API] Processando POST para pedidos...");
      try {
        const { fields, files } = await parseForm(req);
        console.log("[DEBUG] Files recebidos:", files);

        const fichaFile = Array.isArray(files.ficha)
          ? files.ficha[0]
          : files.ficha;
        const bulaFile = Array.isArray(files.bula) ? files.bula[0] : files.bula;

        // Função utilitária para ler o buffer do arquivo
        async function getFileBuffer(file: any) {
          if (!file || !file.filepath) return null;
          const fs = await import("fs/promises");
          try {
            const buffer = await fs.readFile(file.filepath);
            console.log(
              `[DEBUG] Buffer lido (${
                file.originalFilename || file.newFilename
              }):`,
              buffer?.length,
              typeof buffer
            );
            return buffer;
          } catch (err) {
            console.log(`[DEBUG] Erro ao ler buffer:`, err);
            return null;
          }
        }

        const fichaBuffer = await getFileBuffer(fichaFile);
        const bulaBuffer = await getFileBuffer(bulaFile);
        console.log(
          "[DEBUG] Buffer ficha:",
          fichaBuffer?.length,
          typeof fichaBuffer
        );
        console.log(
          "[DEBUG] Buffer bula:",
          bulaBuffer?.length,
          typeof bulaBuffer
        );

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
          fichaInfo: fichaFile
            ? {
                nome: fichaFile.originalFilename || fichaFile.newFilename,
                tamanho: fichaFile.size,
                tipo: fichaFile.mimetype,
                buffer: fichaBuffer ? Buffer.from(fichaBuffer) : null,
              }
            : null,
          bulaInfo: bulaFile
            ? {
                nome: bulaFile.originalFilename || bulaFile.newFilename,
                tamanho: bulaFile.size,
                tipo: bulaFile.mimetype,
                buffer: bulaBuffer ? Buffer.from(bulaBuffer) : null,
              }
            : null,
          status: "pendente",
          createdAt: new Date(),
        };

        console.log("📋 [API] Objeto pedido criado:", pedido);
        console.log("[DEBUG] Pedido a ser salvo:", pedido);
        console.log("💾 [API] Salvando no banco de dados...");

        const result = await pedidos.insertOne(pedido);
        console.log(
          "✅ [API] Pedido salvo com sucesso. ID:",
          result.insertedId
        );

        // Descontar crédito do usuário e incrementar solicitacoesMes
        const users = db.collection("users");
        const usuario = await users.findOne({ email: pedido.email });
        // Corrige tipo do campo credito para garantir operação $inc
        if (usuario) {
          let creditoAtual = usuario.credito;
          if (typeof creditoAtual === "string") {
            creditoAtual = parseInt(creditoAtual, 10);
          }
          if (typeof creditoAtual !== "number" || isNaN(creditoAtual)) {
            creditoAtual = 0;
          }
          if (creditoAtual > 0) {
            await users.updateOne({ email: pedido.email }, [
              {
                $set: {
                  credito: { $subtract: [{ $toInt: "$credito" }, 1] },
                  solicitacoesMes: {
                    $add: [{ $ifNull: ["$solicitacoesMes", 0] }, 1],
                  },
                },
              },
            ]);
            console.log(`🟢 Crédito descontado de ${pedido.email}`);
          } else {
            console.log(`⚠️ Usuário sem crédito: ${pedido.email}`);
          }
        } else {
          console.log(`⚠️ Usuário não encontrado: ${pedido.email}`);
        }

        await logAction({
          usuario: usuarioLogado || fields.email || "anon",
          acao: "POST",
          endpoint: "/api/pedidos",
          detalhes: fields,
        });

        return res.status(201).json({ ok: true, id: result.insertedId });
      } catch (err) {
        console.error("❌ [API] Erro no POST:", err);
        console.error("❌ [API] Stack trace:", err.stack);
        return res
          .status(500)
          .json({ error: "Erro ao salvar pedido", details: err.message });
      }
    }

    if (req.method === "DELETE") {
      await logAction({
        usuario: usuarioLogado || req.body?.email || "anon",
        acao: "DELETE",
        endpoint: "/api/pedidos",
        detalhes: req.body,
      });
      try {
        const body = await readJsonBody(req);
        const { id } = body;
        if (!id) {
          return res.status(400).json({ error: "ID do pedido é obrigatório" });
        }
        const result = await pedidos.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          return res
            .status(200)
            .json({ ok: true, message: "Pedido excluído com sucesso" });
        } else {
          return res.status(404).json({ error: "Pedido não encontrado" });
        }
      } catch (err) {
        console.error("❌ [API] Erro no DELETE:", err);
        return res
          .status(500)
          .json({ error: "Erro ao excluir pedido", details: err.message });
      }
    }

    if (req.method === "PUT") {
      await logAction({
        usuario: usuarioLogado || req.body?.email || "anon",
        acao: "PUT",
        endpoint: "/api/pedidos",
        detalhes: req.body,
      });
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
            fichaInfo: pedido.fichaInfo,
            bulaInfo: pedido.bulaInfo,
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
          await pedidos.updateOne(
            { _id: new ObjectId(id) },
            {
              $set: {
                status: "rejeitado",
                rejeitadoEm: new Date(),
                rejeitadoPor: "admin",
                motivoRejeicao: motivo || null,
              },
            }
          );
          return res
            .status(200)
            .json({ ok: true, message: "Pedido rejeitado com sucesso" });
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
    console.error("❌ [API] Erro geral na API de pedidos:", err);
    console.error("❌ [API] Stack trace completo:", err.stack);
    console.error("❌ [API] Método da requisição:", req.method);
    console.error("❌ [API] URL da requisição:", req.url);
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: err.message,
      method: req.method,
      url: req.url,
    });
  }
}
