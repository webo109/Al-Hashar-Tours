import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/components/ui/Button";

export default function NotFound() {
  const t = useTranslations("Common");
  return (
    <main id="content" className="flex min-h-[70dvh] items-center px-6">
      <div className="mx-auto w-full max-w-[1200px] py-32 md:px-10">
        <h1 className="text-4xl font-medium tracking-tight text-cream md:text-5xl">{t("notFound")}</h1>
        <Link href="/" className={buttonClass("secondary", "mt-8")}>
          {t("goHome")}
        </Link>
      </div>
    </main>
  );
}
