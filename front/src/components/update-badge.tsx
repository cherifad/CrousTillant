import { Restaurant, ScrapingLog } from "@prisma/client";
import { Heart, HeartOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UpdateBadgeProps {
    restaurant?: Restaurant | undefined | null;
    scrapingLog?: ScrapingLog | undefined | null;
}

export default function UpdateBadge({
    restaurant,
    scrapingLog,
}: UpdateBadgeProps) {

    return (
        restaurant ? (
            <Badge className={`sm:ml-2 select-none text-white ${restaurant.last_scraping_status === "success" ? "bg-green-500  hover:bg-green-500" : "bg-yellow-500 hover:bg-yellow-500"}`}>
                <span >
                    Mis à jour : {restaurant.last_scraping_at ? new Date(restaurant.last_scraping_at).toLocaleString() : "jamais"}
                </span>
            </Badge>
        ) : scrapingLog ? (
            <Badge className={`sm:ml-2 select-none hover:bg-inherit text-white ${scrapingLog.status === "success" ? "bg-green-500" : "bg-red-500"}`}>
                <span >
                    Mis à jour : {scrapingLog.ended_at ? new Date(scrapingLog.ended_at).toLocaleString() : "jamais"}
                </span>
            </Badge>
        ) : (
            <Badge className={`sm:ml-2 select-none bg-gray-500 text-white`}>
                <span >
                    Non mis à jour
                </span>
            </Badge>
        )
    );
}
