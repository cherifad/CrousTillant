import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // find restaurant with its id
  const restaurants = await prisma.restaurant.findUnique({
    where: {
      id: Number(req.query.id),
    },
    include: {
      meals: true,
    },
  });

  res.status(200).json(restaurants);
}

// example: http://localhost:3000/api/restaurant/1
