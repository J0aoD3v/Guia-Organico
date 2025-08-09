import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Log para debug no Vercel
    console.log("Tentando conectar ao MongoDB...");
    console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
    
    const client = await clientPromise;
    console.log("Cliente conectado com sucesso");
    
    const db = client.db("guia-organico"); // Nome específico do banco
    console.log("Banco selecionado: guia-organico");
    
    const products = await db.collection("products").find({}).toArray();
    console.log(`Encontrados ${products.length} produtos`);
    
    res.status(200).json(products);
  } catch (error) {
    console.error("Erro detalhado:", error);
    res
      .status(500)
      .json({ 
        error: "Erro ao conectar ao banco ou buscar produtos.",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      });
  }
}
