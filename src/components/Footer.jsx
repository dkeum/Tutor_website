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
  //   {
  //     title: "Resources",
  //     links: [
  //       { title: "Blog", href: "#" },
  //       { title: "Newsletter", href: "#" },
  //       { title: "Events", href: "#" },
  //       { title: "Help centre", href: "#" },
  //       { title: "Tutorials", href: "#" },
  //       { title: "Support", href: "#" },
  //     ],
  //   },
  {
    title: "Social",
    links: [{ title: "Discord", href: "#" }],
  },
];

const Footer = () => {
  return (
    <div className=" min-h-[380px] w-full max-w-[70rem] ml-20  flex flex-col mt-10">
      <div className="grow bg-muted " />
      <footer>
        <div className="max-w-screen-xl mx-auto">
          <div className="py-12 grid grid-cols-2  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-8 gap-y-10 px-6 xl:px-0">
            <div className="col col-span-full justify-end xl:col-span-2">
              <div className="flex flex-row gap-x-3  items-center">
                <img className="w-12 h-12 " src="/logo.ico" alt="logo" />
                <p className="text-lg font-bold pt-4">Mathamagic</p>
              </div>

              <svg
                id="logo-7"
                width="124"
                height="32"
                viewBox="0 0 124 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* SVG paths omitted for brevity */}
              </svg>
              <p className="mt-4 text-muted-foreground">
                Foster amazing academic experiences that create more happy in
                the world.
              </p>
            </div>

            <div className="  ml-[500px] w-full flex flex-row  gap-x-30 justify-end items-start">
              {footerSections.map(({ title, links }) => (
                <div className='pt-5' key={title}>
                  <h6 className="font-semibold">{title}</h6>
                  <ul className="mt-6 space-y-4">
                    {links.map(({ title, href }) => (
                      <li key={title}>
                        <a
                          href={href}
                          className="text-muted-foreground hover:text-foreground"
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
          <div className="py-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-x-2 gap-y-5 px-6 xl:px-0">
            <span className="text-muted-foreground">
              &copy; {new Date().getFullYear()} . All rights reserved.
            </span>
            <div className="flex items-center gap-5 text-muted-foreground"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
