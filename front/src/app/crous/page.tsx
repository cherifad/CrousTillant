"use client";

import CrousChoiceForm from "@/components/crous-choice-form";
import { useSearchParams } from "next/navigation";

export default function CrousChoicePage() {
  const params = useSearchParams();
  var clbk = null;

  if (params && params.get("clbk")) {
    clbk = params.get("clbk");
  }

  return (
    <div>
      <h1 className="font-bold text-3xl">Choisissez votre Crous</h1>
      <CrousChoiceForm callBackUrl={clbk} />
    </div>
  );
}
