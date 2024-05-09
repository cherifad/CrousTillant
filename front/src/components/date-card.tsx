import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DateCardProps = {
  mealNumber: number;
  date: Date;
  onSelectedDateChange: (date: Date) => void;
  selectedDate: Date;
};

export default function DateCard({
  mealNumber,
  date,
  onSelectedDateChange,
  selectedDate,
}: DateCardProps) {
  return (
    <Card
      key={date.toISOString()}
      className={`${
        selectedDate.toLocaleDateString() === date.toLocaleDateString()
          ? "border-primary"
          : "border-card"
      } text-center flex-1 cursor-pointer relative dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80`}
      onClick={() => onSelectedDateChange(date)}
    >
      <CardHeader>
        <CardContent>
          <p className="capitalize">
            {date.toLocaleDateString("fr-FR", {
              weekday: "long",
            })}
          </p>
        </CardContent>
        <CardTitle>
          {date.toLocaleDateString("fr-FR", {
            day: "numeric",
          })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="capitalize">
          {date.toLocaleDateString("fr-FR", {
            month: "long",
          })}
        </p>
      </CardContent>
      <Badge className="absolute top-1 right-1">{mealNumber}</Badge>
    </Card>
  );
}
