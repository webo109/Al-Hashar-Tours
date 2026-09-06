import { useTranslations } from "next-intl";
import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/data/company";
import { whatsappUrl } from "@/lib/whatsapp";

const socialIcon = {
  instagram: InstagramLogo,
  facebook: FacebookLogo,
  linkedin: LinkedinLogo,
} as const;

const serviceSlugs = ["flights", "hotels", "holidays", "visa", "insurance", "cargo"] as const;

export function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Nav");
  const contact = useTranslations("Contact");
  const services = useTranslations("Services.pages");
  const branches = useTranslations("Branches");
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-fg/10 bg-surface text-fg">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:px-10 md:py-20">
        <div>
          <Logo size="footer" />
          <p className="mt-6 max-w-[34ch] text-[15px] leading-relaxed text-fg/70">
            {t("established")}
          </p>
          <ul className="mt-6 flex gap-2">
            {company.socials.map((s) => {
              const Icon = socialIcon[s.key as keyof typeof socialIcon];
              return (
                <li key={s.key}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-pill border border-fg/15 text-fg/80 transition-colors hover:border-gold hover:text-accent-text"
                  >
                    <Icon size={20} weight="fill" />
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href={whatsappUrl(company.whatsapp.digits, "")}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={contact("whatsapp")}
                className="flex h-11 w-11 items-center justify-center rounded-pill border border-fg/15 text-fg/80 transition-colors hover:border-gold hover:text-accent-text"
              >
                <WhatsappLogo size={20} weight="fill" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[13px] font-medium text-fg/55">{t("explore")}</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
            <li><Link className="hover:text-accent-text" href="/tours">{nav("omanTours")}</Link></li>
            <li><Link className="hover:text-accent-text" href="/umrah">{nav("umrah")}</Link></li>
            <li><Link className="hover:text-accent-text" href="/contact">{nav("contact")}</Link></li>
            <li><Link className="hover:text-accent-text" href="/bookings/lookup">{t("findRequest")}</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-[13px] font-medium text-fg/55">{t("services")}</h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-[15px]">
            {serviceSlugs.map((slug) => (
              <li key={slug}>
                <Link className="hover:text-accent-text" href={`/services/${slug}`}>
                  {services(`${slug}.title`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-[13px] font-medium text-fg/55">{t("company")}</h2>
          <address className="mt-4 flex flex-col gap-2.5 text-[15px] not-italic text-fg/85">
            <span>
              {branches(company.headOffice.areaKey)}, {company.headOffice.postal}
            </span>
            <a className="hover:text-accent-text" href={`tel:${company.phone.tel}`} dir="ltr">
              {company.phone.display}
            </a>
            <a className="hover:text-accent-text" href={`mailto:${company.email}`}>
              {company.email}
            </a>
          </address>
        </div>
      </div>

      <div className="border-t border-fg/10">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-6 py-6 text-[13px] text-fg/55 md:flex-row md:items-center md:justify-between md:px-10">
          <p>
            <span lang="en" dir="ltr" className="font-latin">
              {t("companyName")}
            </span>
            . {year}. {t("rights")}
          </p>
          <a className="hover:text-accent-text" href="/videos/CREDITS.md">
            {t("videoCredits")}
          </a>
          <a className="hover:text-accent-text" href="/images/CREDITS.md">
            {t("credits")}
          </a>
        </div>
      </div>
    </footer>
  );
}
