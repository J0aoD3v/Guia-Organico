import clientPromise from "./db";

export async function logAction({ usuario, acao, endpoint, detalhes = {} }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("logs").insertOne({
      usuario,
      acao,
      endpoint,
      detalhes,
      timestamp: new Date(),
    });
  } catch (err) {
    // Não lança erro para não quebrar a API
    console.error("Erro ao registrar log:", err);
  }
}
