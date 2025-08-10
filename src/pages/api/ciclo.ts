import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    // Calcula a data do próximo ciclo (primeiro dia do próximo mês)
    const agora = new Date();
    const proximoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 1);

    // Formatar data no padrão brasileiro (DD/MM/AAAA)
    const dia = proximoMes.getDate().toString().padStart(2, "0");
    const mes = (proximoMes.getMonth() + 1).toString().padStart(2, "0");
    const ano = proximoMes.getFullYear();

    const dataFormatada = `${dia}/${mes}/${ano}`;

    res.status(200).json({
      proximoCiclo: dataFormatada,
      proximoCicloISO: proximoMes.toISOString(),
    });
  } catch (error) {
    console.error("Erro ao calcular próximo ciclo:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}
