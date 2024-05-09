"use client";

import { useEffect, useState } from "react";
import { getSelectedCrous, setSelectedCrous, Crous } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface CrousChoiceFormProps {
  callBackUrl?: string | null;
}

export default function CrousChoiceForm({ callBackUrl }: CrousChoiceFormProps) {
  const [crousList, setCrousList] = useState<Crous[]>([]);
  const [selectedCrousLocal, setSelectedCrousLocal] = useState<Crous | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleSelectCrous = (crous: Crous) => {
    setSelectedCrous(crous);
    router.push(callBackUrl || "/");
  };

  useEffect(() => {
    setSelectedCrousLocal(getSelectedCrous());
    fetch("/api/crous")
      .then((res) => res.json())
      .then((data) => {
        setCrousList(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <ul className="flex flex-wrap gap-2 justify-center">
        {crousList.map((crous) => (
          <li key={crous.id}>
            <Card
              //   className="bg-[#e40513] cursor-pointer hover:bg-[#ff1d25] text-white dark:text-black min-h-96 w-44 items-center justify-center flex flex-col"
              className={`bg-[#e40513] cursor-pointer hover:bg-[#ff1d25] text-white dark:text-black min-h-96 w-44 items-center justify-center flex flex-col transition-transform ${
                selectedCrousLocal?.id === crous.id && "bg-[#ff1d25] scale-105"
              }`}
              onClick={() => setSelectedCrousLocal(crous)}
            >
              <CardHeader>
                <CardTitle className="text-center font-bold text-5xl">
                  {crous.name.split("Crous de ")[1].charAt(0)}
                </CardTitle>
                <CardDescription className="text-white dark:text-black text-center">
                  {crous.name}
                </CardDescription>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => handleSelectCrous(selectedCrousLocal!)}
          disabled={!selectedCrousLocal}
        >
          {selectedCrousLocal
            ? `Choisir le ${selectedCrousLocal.name}`
            : "Choisissez un Crous"}
        </Button>
      </div>
    </div>
  );
}
