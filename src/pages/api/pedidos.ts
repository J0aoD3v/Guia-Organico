import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/db';
import { ObjectId } from 'mongodb';

export const config = {
  api: {
    bodyParser: false,
  },
};

import formidable from 'formidable';
import fs from 'fs';

async function parseForm(req: NextApiRequest): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const pedidos = db.collection('pedidos');

  if (req.method === 'GET') {
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

  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req);
      // Salva arquivos localmente (pode ser ajustado para cloud)
      const fichaPath = files.ficha ? `uploads/${Date.now()}_${files.ficha.originalFilename}` : null;
      const bulaPath = files.bula ? `uploads/${Date.now()}_${files.bula.originalFilename}` : null;
      if (files.ficha) fs.copyFileSync(files.ficha.filepath, fichaPath);
      if (files.bula) fs.copyFileSync(files.bula.filepath, bulaPath);
      const pedido = {
        ...fields,
        fichaPath,
        bulaPath,
        createdAt: new Date(),
      };
      await pedidos.insertOne(pedido);
      return res.status(201).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao salvar pedido' });
    }
  }

  res.status(405).end();
}
