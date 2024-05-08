import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!req.query.crousId) {
    return res.status(400).json({ message: "Missing crousId" });
  }

  const crousId = req.query.crousId as string;

  const restaurants = await prisma.restaurant.findMany({
    where: {
      crousId: parseInt(crousId),
    },
  });

  res.status(200).json(restaurants);
}

// example: http://localhost:3000/api/restaurant
