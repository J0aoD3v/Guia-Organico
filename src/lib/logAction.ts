import clientPromise from "./db";
import { logServerAction } from "./serverLogger";

export async function logAction({ usuario, acao, endpoint, detalhes = {} }) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Salvar no collection de logs de ações (existente)
    await db.collection("logs").insertOne({
      usuario,
      acao,
      endpoint,
      detalhes,
      timestamp: new Date(),
    });

    // Salvar também nos logs do servidor
    await logServerAction(`API: ${acao}`, {
      usuario,
      endpoint,
      detalhes,
    });
  } catch (err) {
    // Não lança erro para não quebrar a API
    console.error("Erro ao registrar log:", err);
  }
}
