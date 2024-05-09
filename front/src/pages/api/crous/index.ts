import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const crous = await prisma.crous.findMany();

  res.status(200).json(crous);
}

// example: http://localhost:3000/api/crous
