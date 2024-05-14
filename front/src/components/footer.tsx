import { Github, Bug, BarChartBig } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="absolute bottom-4 right-0 w-full flex flex-col md:flex-row h-9 items-center justify-between space-x-1 bg-background p-1 mb-2 shadow-sm rounded-none px-2 lg:px-4">
      <div className="flex items-center flex-col lg:flex-row">
        <p>
          {new Date().getFullYear()} Made with ❤️ by{" "}
          <a
            href="https://cherifad.github.io"
            className="hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Adlen Cherif
          </a>
        </p>
        <span className="mx-2 hidden lg:block">&nbsp;&#8226;</span>
        <p>
          <a
            href="https://www.unrwa.org/"
            className="hover:underline flex items-center"
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src="/img/Flag_of_Palestine_png.png"
              alt="Next.js logo"
              width={20}
              height={20}
              className="inline"
            />
            &nbsp;Free Palestine
          </a>
        </p>
      </div>
      <div>
        <ul className="flex gap-4 flex-wrap justify-center py-4">
          <li>
            <a
              href="https://github.com/cherifad/CrousTillant"
              className="hover:underline flex items-center"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://github.com/cherifad/CrousTillant/issues/new?title=Huston%2C+on+a+un+probl%C3%A8me&body=J%27ai+un+probl%C3%A8me+avec+le+site+et+voici+ce+que+c%27est%3A"
              className="hover:underline flex items-center"
              target="_blank"
              rel="noreferrer"
            >
              <Bug className="h-4 w-4 mr-2" />
              Signaler un bug
            </a>
          </li>
          <li>
            <a
              href="https://ru-stats.servperso.me/share/8OPVBdWGT24WUCIw/ru.servperso.me"
              className="hover:underline flex items-center"
              target="_blank"
              rel="noreferrer"
            >
              <BarChartBig className="h-4 w-4 mr-2" />
              Statistiques
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
