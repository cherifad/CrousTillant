"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useUserPreferences, Crous } from "@/store/userPreferencesStore";
import Loading from "@/app/loading";

interface CrousChoiceFormProps {
  callBackUrl?: string | null;
}

export default function CrousChoiceForm({ callBackUrl }: CrousChoiceFormProps) {
  const [crousList, setCrousList] = useState<Crous[]>([]);
  const [selectedCrousLocal, setSelectedCrousLocal] = useState<Crous | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const { selectedCrous, setSelectedCrous } = useUserPreferences();

  const router = useRouter();

  useEffect(() => {
    setSelectedCrousLocal(selectedCrous);
    fetch("/api/crous")
      .then((res) => res.json())
      .then((data) => {
        setCrousList(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mt-4">
      {
        loading ? (
          <Loading message="Chargement des Crous..." />
        ) : (
          <ul className="flex flex-wrap gap-2 justify-center">
            {crousList.length ? (crousList.map((crous) => (
              <li key={crous.id}>
                <Card
                  className={`bg-primary cursor-pointer hover:bg-[#ff1d25] text-white dark:text-black min-h-full md:min-h-96 w-44 items-center justify-center flex flex-col transition-transform ${selectedCrousLocal?.id === crous.id && " scale-105"
                    }`}
                  onClick={() => setSelectedCrousLocal(crous)}
                  onDoubleClick={() => {
                    setSelectedCrous(crous);
                    router.push(callBackUrl || "/");
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-center font-bold text-5xl select-none">
                      {crous.name.split("Crous de ")[1].charAt(0)}
                    </CardTitle>
                    <CardDescription className="text-white dark:text-black text-center">
                      {crous.name}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))) : (
              <div className="text-center text-lg text-gray-500 dark:text-gray-400">
                Aucun Crous trouvé
              </div>
            )}
          </ul>
        )}
      <div className="flex justify-center mt-4">
        <Button
          onClick={() => {
            if (!selectedCrousLocal) return;
            setSelectedCrous(selectedCrousLocal);
            router.push(callBackUrl || "/");
          }}
          disabled={!selectedCrousLocal || loading}
        >
          {selectedCrousLocal
            ? `Choisir le ${selectedCrousLocal.name}`
            : "Choisissez un Crous"}
        </Button>
      </div>
    </div>
  );
}
