import Image from "next/image";

export default function About() {
  return (
    <div>
      <h1 className="font-bold text-3xl">À propos</h1>
      <div className="flex gap-4 items-center justify-center flex-wrap-reverse md:flex-nowrap mt-4">
        <Image src="/img/logo.png" width={400} height={400} alt="Logo" />
        <section>
          <p className="mt-4">
            Ce site a été réalisé car le site officiel du Crous de Lyon ne
            propose pas une interface utilisateur moderne et intuitive pour
            consulter les menus des restaurants universitaires.
          </p>
          <p className="mt-4">
            L'objectif était de réaliser une application web permettant de
            consulter les menus des restaurants universitaires du Crous de Lyon.
          </p>
          <p className="mt-4">
            Le projet a été réalisé par{" "}
            <a
              href="https://github.com/cherifad"
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              @nelda
            </a>{" "}
            .
          </p>
          <p className="mt-4">Merci à copilot pour avoir écrit ce texte 😘</p>
        </section>
      </div>
    </div>
  );
}
