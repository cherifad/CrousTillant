"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeToggle from "@/components/theme-switcher";
import { Settings, Home, Info, Mail } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

export default function Header() {
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <header className="flex justify-between items-center">
      <nav>
        <ul
          className={`flex h-9 items-center space-x-1 bg-background p-1 shadow-sm rounded-none border-none px-2 lg:px-4 ${
            isDesktop ? "border border-b" : "gap-2"
          }`}
        >
          <li>
            <Button
              size={isDesktop ? "default" : "icon"}
              asChild
              variant={pathname === "/" ? "default" : "outline"}
              className={`select-none h-fit rounded-sm text-sm ${
                isDesktop ? "px-3 py-1" : "p-2"
              }`}
            >
              <Link
                href={{
                  pathname: "/",
                  query: { referer: "me" },
                }}
              >
                {isDesktop ? "Accueil" : <Home className="h-6 w-6" />}
              </Link>
            </Button>
          </li>
          <li>
            <Button
              asChild
              variant={pathname === "/about" ? "default" : "outline"}
              className={`select-none h-fit rounded-sm text-sm ${
                isDesktop ? "px-3 py-1" : "p-2"
              }`}
            >
              <Link href="/about">
                {isDesktop ? "À propos" : <Info className="h-6 w-6" />}
              </Link>
            </Button>
          </li>
          <li>
            <Button
              asChild
              variant={pathname === "/contact" ? "default" : "outline"}
              className={`select-none h-fit rounded-sm text-sm ${
                isDesktop ? "px-3 py-1" : "p-2"
              }`}
            >
              <Link href="/contact">
                {isDesktop ? "Contact" : <Mail className="h-6 w-6" />}
              </Link>
            </Button>
          </li>
          <li>
            <Button
              asChild
              variant={pathname === "/settings" ? "default" : "outline"}
              className={`select-none h-fit rounded-sm text-sm ${
                isDesktop ? "px-3 py-1" : "p-2"
              }`}
            >
              <Link href="/settings">
                {isDesktop ? "Paramètres" : <Settings className="h-6 w-6" />}
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
      <ModeToggle />
    </header>
  );
}
