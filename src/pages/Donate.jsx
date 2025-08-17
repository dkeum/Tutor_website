import React from "react";
import NavbarLoggedIn from "../components/NavbarLoggedIn"
import { Link } from "react-router-dom"; // Assuming you're using react-router

const Donate = () => {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <NavbarLoggedIn />

      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link to="/" className="flex items-center justify-center">
          <GiftIcon className="h-6 w-6" />
          <span className="sr-only">Donate Platform</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="#" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link to="#" className="text-sm font-medium hover:underline underline-offset-4">
            Testimonials
          </Link>
          <Link to="#" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
          <Link to="#" className="text-sm font-medium hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Make a Difference with Your Donation
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Donate securely and make an impact with our trusted donation platform. Your contribution can change lives.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    to="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                  >
                    Donate Now
                  </Link>
                  <Link
                    to="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <img
                src="/placeholder.svg"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Secure, Transparent, and Impactful Donations
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our donation platform ensures your contributions are processed securely, tax-deductible, and make a real difference in the lives of those in need.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                src="/placeholder.svg"
                width="550"
                height="310"
                alt="Image"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Secure Payments</h3>
                      <p className="text-muted-foreground">
                        Your donations are processed through our secure platform, ensuring your personal and financial information is protected.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Tax-Deductible</h3>
                      <p className="text-muted-foreground">
                        Your donations are tax-deductible, allowing you to maximize the impact of your contribution.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Impact Tracking</h3>
                      <p className="text-muted-foreground">
                        See how your donations are making a difference with our transparent impact reporting.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Hear from Our Donors</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                Our donors share their experiences and the impact their contributions have made.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">"Donating was easy and impactful"</h3>
                <p className="text-muted-foreground">
                  "I was impressed by the secure payment process and the transparency around how my donation was used. It's rewarding to see the real difference it made."
                </p>
                <p className="text-muted-foreground">- Sarah, Donor</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-xl font-bold">"Giving has never been easier"</h3>
                <p className="text-muted-foreground">
                  "The donation platform is user-friendly and the tax benefits make it a no-brainer. I'm glad my contribution is making a tangible impact."
                </p>
                <p className="text-muted-foreground">- Michael, Donor</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container grid items-center justify-center gap-4 px-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Ready to Make a Difference?</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Donate securely and start making an impact today. Your contribution can change lives.
            </p>
            <Link
              to="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Donate Now
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full items-center px-4 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 Donate Platform. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link to="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link to="#" className="text-xs hover:underline underline-offset-4">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

function GiftIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 010-5A4.8 8 0 0112 8a4.8 8 0 014.5-5 2.5 2.5 0 010 5" />
    </svg>
  );
}

export default Donate;
