import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const latestAnnouncements = await prisma.announcement.findMany({
    orderBy: {
      created_at: "desc",
    },
    take: 3,
  });

  res.status(200).json(latestAnnouncements);
}

// example: http://localhost:3000/api/announcement
