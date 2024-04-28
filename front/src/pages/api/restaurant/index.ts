import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const restaurants = await prisma.restaurant.findMany();

  res.status(200).json(restaurants);
}

// example: http://localhost:3000/api/restaurant
