"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";

export default function NotFoundPage() {
  const pathname = usePathname();

  return (
    <>
      <h1 className="font-bold text-3xl">
        Errance dans les méandres du cyberespace : La page égarée
      </h1>
      <div className="flex gap-4 items-center justify-center flex-wrap-reverse md:flex-nowrap">
        <Image src="/img/logo.png" width={400} height={400} alt="Logo" />
        <section>
          <p className="mb-4">
            Par ma foi ! Voici la lande obscure où vos pas vous ont fourvoyé. La
            page convoitée, telle la brume, s'est évanouie. Rebattez vos cartes,
            prenez un autre sentier, car celui-ci se perd dans les méandres du
            cyberespace. Ensemble, quêteurs d'aventure, cherchons la lumière
            dans les ténèbres numériques. Adieu, et que la fortune vous sourie
            en vos pérégrinations futures !
          </p>
          <Button asChild className="mr-4">
            <Link href="/">Retourner au foyer de la toile</Link>
          </Button>
          <Button asChild variant="outline" className="mt-4">
            <Link
              href={
                typeof window !== "undefined" && window.history.length > 1
                  ? "javascript:history.back()"
                  : "/"
              }
            >
              Reculer comme l'écho du cor
            </Link>
          </Button>
        </section>
      </div>
    </>
  );
}
