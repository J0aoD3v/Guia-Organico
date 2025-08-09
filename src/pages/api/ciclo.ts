import type { NextApiRequest, NextApiResponse } from "next";

// Função para calcular o próximo ciclo (primeiro dia do próximo mês)
function getNextCycleDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  // Próximo mês
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  const nextCycle = new Date(nextYear, nextMonth, 1, 0, 0, 0, 0);
  return nextCycle.toISOString();
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const nextCycleDate = getNextCycleDate();
    res.status(200).json({ nextCycleDate });
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
