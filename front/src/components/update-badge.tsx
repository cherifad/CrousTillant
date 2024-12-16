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

    console.log(restaurant, scrapingLog);

    if (!restaurant || !scrapingLog) {
        return <p>Rien</p>
    }

    return (
        <Badge className="sm:ml-2 select-none">
            <span >
                Hello
            </span>
        </Badge>
    );
}
