import { Restaurant, ScrapingLog } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck } from "lucide-react";

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
            <Badge className={`sm:ml-2 select-none text-white ${restaurant.last_scraping_status === "success" ? "bg-green-500  hover:bg-green-500" : restaurant.last_scraping_status === "pending" ? "bg-yellow-500 hover:bg-yellow-500" : "bg-red-500 hover:bg-red-500"}`}>
                <span >
                    {/* Mis à jour : {restaurant.last_scraping_at ? new Date(restaurant.last_scraping_at).toLocaleString() : "jamais"} */}
                    {restaurant.last_scraping_status === "success" ? (
                        <>
                            <BadgeCheck size={16} className="inline mr-1" />
                            Mis à jour : {restaurant.last_scraping_at ? new Date(restaurant.last_scraping_at).toLocaleString() : "jamais"}
                        </>
                    ) : restaurant.last_scraping_status === "pending" ? (
                        <>
                            Mise à jour en cours
                        </>
                    ) : (
                        <>
                            Erreur lors de la dernière mise à jour : {restaurant.last_scraping_at ? new Date(restaurant.last_scraping_at).toLocaleString() : "jamais"}
                        </>
                    )}
                </span>
            </Badge>
        ) : scrapingLog ? (
            <Badge className={`sm:ml-2 select-none hover:bg-inherit text-white ${scrapingLog.status === "success" ? "bg-green-500 hover:bg-green-500" : scrapingLog.status === "pending" ? "bg-yellow-500 hover:bg-yellow-500" : "bg-red-500 hover:bg-red-500"}`}>
                <span >
                    {
                        scrapingLog.status === "success" ? (
                            <>
                                <BadgeCheck size={16} className="inline mr-1" />
                                Mis à jour : {scrapingLog.ended_at ? new Date(scrapingLog.ended_at).toLocaleString() : "jamais"}
                            </>
                        ) : scrapingLog.status === "pending" ? (
                            <>
                                Mise à jour en cours
                            </>
                        ) : (
                            <>
                                Erreur lors de la dernière mise à jour : {scrapingLog.ended_at ? new Date(scrapingLog.ended_at).toLocaleString() : "jamais"}
                            </>
                        )
                    }
                </span>
            </Badge>
        ) : (
            <></>
        )
    );
}
