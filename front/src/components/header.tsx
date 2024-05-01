"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ModeToggle from "@/components/theme-switcher";
import { Settings, Home, Info, Mail, ArrowUp } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";
import Image from "next/image";

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
      <div className="flex gap-2">
        <Button size="icon" variant="outline" asChild>
          <a href="https://www.unrwa.org/" target="_blank" rel="noreferrer">
            <Image
              src="/img/Flag_of_Palestine_png.png"
              alt="Next.js logo"
              width={20}
              height={20}
              className="inline"
            />
          </a>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
