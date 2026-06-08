import { Separator } from "@/components/ui/separator";

const footerSections = [
  {
    title: "Product",
    links: [
      { title: "Features",     href: "/features"  },
      { title: "Pricing",      href: "/pricing"   },
    ],
  },
  {
    title: "Company",
    links: [
      { title: "About Us",  href: "/about"    },
      { title: "Tutors",    href: "/tutors"   },

    ],
  },
  {
    title: "Support",
    links: [
      { title: "Contact Us",  href: "/contact" },
    ],
  },

];

const legalLinks = [
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms of Service", href: "/terms-of-service" },
];

const Footer = () => {
  return (
    <div className="w-full flex flex-col mt-10 border-t border-gray-100">
      <footer className="w-full px-6 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="py-14 flex flex-col md:flex-row justify-between gap-12">

            {/* ── Brand column ── */}
            <div className="max-w-xs shrink-0">
              {/* Logo — matches NavbarLoggedIn treatment */}
              <div className="flex flex-row items-center gap-x-0 text-2xl">
                <img
                  className="w-10 h-8"
                  src="/mathamagic_m_blue_star.svg"
                  alt="Mathamagic logo"
                />
                <span className="font-bold -ml-[11px] mt-[1px] text-xl">athamagic</span>
              </div>

              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                Foster amazing academic experiences that create more happy in the world.
              </p>

              {/* Contact details */}
              <div className="mt-6 space-y-1">
                <a
                  href="mailto:mathamagic.dkeum@gmail.com"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  mathamagic.dkeum@gmail.com
                </a>
                <a
                  href="tel:6044409543"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  604-440-9543
                </a>
              </div>
            </div>

            {/* ── Link columns ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
              {footerSections.map(({ title, links }) => (
                <div key={title}>
                  <h6 className="font-semibold text-sm text-foreground">{title}</h6>
                  <ul className="mt-4 space-y-3">
                    {links.map(({ title, href }) => (
                      <li key={title}>
                        <a
                          href={href}
                          className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                        >
                          {title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>

          <Separator />

          {/* ── Bottom bar ── */}
          <div className="py-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
            <span className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Mathamagic. All rights reserved.
            </span>
            <div className="flex items-center gap-6">
              {legalLinks.map(({ title, href }) => (
                <a
                  key={title}
                  href={href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {title}
                </a>
              ))}
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
};

export default Footer;