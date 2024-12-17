import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // find crous with its id
    const restaurants = await prisma.crous.findUnique({
        where: {
            id: Number(req.query.id),
        },
        include: {
            ScrapingLog: {
                orderBy: {
                    started_at: 'desc'
                },
                take: 1
            },
        }
    });

    res.status(200).json(restaurants);
}

// example: http://localhost:3000/api/crous/1
