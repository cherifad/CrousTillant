import { Github, Bug } from "lucide-react";

export default function Footer() {
  return (
    <footer className="absolute bottom-4 right-0 w-full flex flex-col md:flex-row h-9 items-center justify-between space-x-1 bg-background p-1 mb-2 shadow-sm rounded-none px-2 lg:px-4">
      <div>
        <p>{new Date().getFullYear()} Made with ❤️ by <a href="https://cherifad.github.io" className="hover:underline" target="_blank" rel="noreferrer">Adlen Cherif</a></p>
      </div>
      <div>
        <ul className="flex gap-4">
          <li>
            <a
              href="https://github.com/cherifad/SmartRU"
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
              href="https://github.com/cherifad/SmartRU/issues/new?title=Huston%2C+on+a+un+probl%C3%A8me&body=J%27ai+un+probl%C3%A8me+avec+le+site+et+voici+ce+que+c%27est%3A"
              className="hover:underline flex items-center"
              target="_blank"
              rel="noreferrer"
            >
              <Bug className="h-4 w-4 mr-2" />
              Signaler un bug
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
