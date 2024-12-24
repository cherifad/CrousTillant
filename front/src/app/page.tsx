"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Utensils } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Hero() {
  const { resolvedTheme } = useTheme();
  let src;

  switch (resolvedTheme) {
    case "light":
      src = "/app-light.png";
      break;
    case "dark":
      src = "/app-dark.png";
      break;
    default:
      src = "/app-dark.png";
      break;
  }

  return (
    <div className="fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0">
      <div className="mx-auto flex max-w-container flex-col gap-12 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          <Badge variant="outline" className="animate-appear">
            <span className="text-muted-foreground">
              Le projet est 100% open-source
            </span>
            <a href="/" className="flex items-center gap-1 ml-1">
              En savoir plus
              <ArrowRight className="h-3 w-3" />
            </a>
          </Badge>
          <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            Vos repas, <br /> simples et accessibles.
          </h1>
          <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-muted-foreground delay-100 sm:text-xl">
            CROUStillant vous permet de consulter les menus des restaurants
            CROUS de France et d'outre-mer.
          </p>
          <div className="relative z-10 flex animate-appear justify-center gap-4 delay-300">
            <div className="relative z-10 flex animate-appear justify-center gap-4 delay-300">
              <Button variant="default" size="lg" asChild className="group">
                <Link href="/restaurants">
                  Découvrir votre menu
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/">
                  Voir les restaurants
                  <Utensils className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
