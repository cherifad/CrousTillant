import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("About");

  return (
    <div>
      <h1 className="font-bold text-3xl">{t("title")}</h1>
      <p className="mt-4">{t("content_1")}</p>
      <p className="mt-4">{t("content_2")}</p>
      <p className="mt-4">
        {t("content_3")}{" "}
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
      <p className="mt-4">{t("content_4")}</p>
    </div>
  );
}
