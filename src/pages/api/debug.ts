import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const mongoUri = process.env.MONGODB_URI;
  
  res.status(200).json({
    hasMongoUri: !!mongoUri,
    nodeEnv: process.env.NODE_ENV,
    mongoUriLength: mongoUri?.length || 0,
    mongoUriStart: mongoUri?.substring(0, 20) + "...",
  });
}
