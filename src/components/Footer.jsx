import { Separator } from "@/components/ui/separator";

const footerSections = [
    {
      title: "Contact",
      links: [
        { title: "danielkeum2@gmail.com", href: "/contact" },
        { title: "604-440-9543", href: "/contact" },
      ],
    },
  {
    title: "Company",
    links: [{ title: "About us", href: "/about" }],
  },
  {
    title: "Social",
    links: [{ title: "Discord", href: "#" }],
  },
];

const Footer = () => {
  return (
    <div className="w-full flex flex-col mt-10 border-t border-gray-100">
      <footer className="w-full px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="py-12 flex flex-col md:flex-row justify-between gap-10">
            
            {/* Brand col */}
            <div className="max-w-xs">
              <div className="flex flex-row gap-x-3 items-center">
                <img className="w-12 h-12" src="/logo.ico" alt="logo" />
                <p className="text-lg font-bold">Mathamagic</p>
              </div>
              <p className="mt-4 text-muted-foreground text-sm">
                Foster amazing academic experiences that create more happy in the world.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-row gap-x-16">
              {footerSections.map(({ title, links }) => (
                <div key={title}>
                  <h6 className="font-semibold">{title}</h6>
                  <ul className="mt-6 space-y-4">
                    {links.map(({ title, href }) => (
                      <li key={title}>
                        <a href={href} className="text-muted-foreground hover:text-foreground text-sm">
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
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5">
            <span className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} . All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
