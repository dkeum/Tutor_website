import { useState, useEffect } from "react";

// const testimonials = [
//   {
//     quote: "Absolutely revolutionary, a game-changer for our industry. It has exceeded all of our expectations so far.",
//     name: "Bob Smith",
//     role: "Industry Analyst",
//     avatar: "https://assets.aceternity.com/avatars/4.webp",
//   },
//   {
//     quote: "I can't imagine going back to how things were before this AI. It's become essential to our daily workflow.",
//     name: "Cathy Lee",
//     role: "Product Manager",
//     avatar: "https://assets.aceternity.com/avatars/5.webp",
//   },
//   {
//     quote: "It's like having a superpower! This AI tool has given us abilities we never thought were possible before.",
//     name: "David Wright",
//     role: "Research Scientist",
//     avatar: "https://assets.aceternity.com/avatars/6.webp",
//   },
//   {
//     quote: "The productivity gains are unreal. We've shipped more in the last quarter than in the entire previous year.",
//     name: "Priya Patel",
//     role: "Engineering Lead",
//     avatar: "https://assets.aceternity.com/avatars/1.webp",
//   },
//   {
//     quote: "Onboarding was seamless. Within a week, our entire team was fully up to speed and running faster than ever.",
//     name: "Marcus Chen",
//     role: "Head of Operations",
//     avatar: "https://assets.aceternity.com/avatars/2.webp",
//   },
//   {
//     quote: "The depth of insight we get now is incredible. It surfaces things we would have missed entirely before.",
//     name: "Lena Fischer",
//     role: "Data Scientist",
//     avatar: "https://assets.aceternity.com/avatars/3.webp",
//   },
// ];

const testimonials = [
  {
    quote: "I can't wait to have Daniel as a math tutor again for my next term! I went from 63% to 77%.",
    name: "Hudson gr.9",
    role: "Grade 9 Math Student",
    avatar: "./student1.png"
  },
  {
    quote: "I got a 98% on my Pre-cal 12 final! 93% on my physics 12. Thank you.",
    name: "Dajeong gr.12",
    role: "Pre-Calculus & Physics 12 Student",
    avatar: "./student2.png"
  },
  {
    quote: "My physics 11 grade went up, I'm really happy with the tutoring.",
    name: "Jackson gr.11",
    role: "Physics 11 Student",
    avatar: "./student3.png"
  },
  {
    quote: "I didn't really like math before and I still don't but at least now I can do it",
    name: "Anatasizia gr.7",
    role: "Grade 7 Math Student",
    avatar: "./student5.png"
  },
  {
    quote: "I play a lot of soccer after school but with tutoring I don't have to worry about my grades anymore.",
    name: "Yousif gr.8",
    role: "Grade 8 Math Student",
    avatar: "./student4.png"
  },
  {
    quote: "I play a lot of soccer after school but with tutoring I don't have to worry about my grades anymore.",
    name: "Roman gr.10",
    role: "Grade 10 Math Student",
    avatar: "./student6.png"
  },
];


const PAGE_SIZE = 3;
const TOTAL_PAGES = Math.ceil(testimonials.length / PAGE_SIZE);

function TestimonialCard({ quote, name, role, avatar, index, animKey }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), index * 90 + 30);
    return () => clearTimeout(t);
  }, [animKey, index]);

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        filter: visible ? "blur(0px)" : "blur(6px)",
        transition: `opacity 0.45s ease ${index * 90}ms, transform 0.45s ease ${index * 90}ms, filter 0.45s ease ${index * 90}ms`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "16px",
        padding: "28px",
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        boxShadow: "0 4px 24px var(--card-shadow)",
        minHeight: "220px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "56px",
          lineHeight: 1,
          color: "var(--accent)",
          marginBottom: "4px",
          userSelect: "none",
          opacity: 0.7,
        }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "clamp(0.95rem, 1.8vw, 1.2rem)",
          lineHeight: 1.65,
          color: "var(--text-body)",
          flex: 1,
        }}
      >
        {quote}
      </p>

      <div
        style={{
          marginTop: "28px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <img
          src={avatar}
          alt={name}
          width={40}
          height={40}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid var(--accent)",
            flexShrink: 0,
          }}
        />
        <div    className="!tracking-normal">
          <div
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--text-heading)",
              fontFamily: "'Instrument Serif', Georgia, serif",
            }}
         
          >
            {name}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginTop: "2px",
              letterSpacing: "0.03em",
            }}
          >
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavButton({ onClick, label, children }) {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "1.5px solid var(--nav-border)",
        background: hovered ? "var(--nav-hover-bg)" : "transparent",
        color: "var(--text-heading)",
        cursor: "pointer",
        transform: active ? "scale(0.94)" : "scale(1)",
        transition: "background 0.2s, transform 0.15s",
        outline: "none",
      }}
    >
      {children}
    </button>
  );
}



export default function TestimonialsCarousel() {
  const [page, setPage] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const goTo = (newPage) => {
    const clamped = ((newPage % TOTAL_PAGES) + TOTAL_PAGES) % TOTAL_PAGES;
    setPage(clamped);
    setAnimKey((k) => k + 1);
  };

  const currentItems = testimonials.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

        :root {
          --accent: #1a4fd6;
          --card-bg: #f0f5ff;
          --card-border: #c7d9f8;
          --card-shadow: rgba(10, 30, 100, 0.07);
          --nav-border: #b5cef6;
          --nav-hover-bg: #dce9fd;
          --text-heading: #0a1628;
          --text-body: #2a3a5c;
          --text-muted: #6b85b5;
          --bg: #e8f0fe;
          --tag-color: #1a4fd6;
        }

        .testimonials-section * {
          box-sizing: border-box;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <section
        className="testimonials-section"
        style={{
          padding: "72px 24px",
          minHeight: "40vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", width: "100%" }}>
          {/* Label */}
          <div
            className="inline-block text-2xl tracking-[0.18em] uppercase px-[14px] py-[4px] mb-6"
            style={{ color: "var(--accent)" }}
          >
            <header className="text-4xl font-extrabold font-inter mx-auto text-black tracking-wide">
              Testimonials
            </header>

          </div>

          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "24px",
              flexWrap: "wrap",
              marginBottom: "52px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontWeight: 500,
                fontStyle: "italic",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "var(--text-heading)",
                lineHeight: 1.15,
                maxWidth: "640px",
                // letterSpacing: "-0.01em",
              }}
              className="tracking-normal "
            >
              Students love us,{" "}
              <span style={{ color: "var(--accent)" }}>you know.</span>
            </h2>

            {/* Navigation + counter */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "12px",
                paddingTop: "8px",
              }}
            >
              <div style={{ display: "flex", gap: "8px" }}>
                <NavButton onClick={() => goTo(page - 1)} label="Previous testimonials">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </NavButton>
                <NavButton onClick={() => goTo(page + 1)} label="Next testimonials">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </NavButton>
              </div>

              {/* Dot indicators */}
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Go to page ${i + 1}`}
                    style={{
                      width: i === page ? "20px" : "6px",
                      height: "6px",
                      borderRadius: "100px",
                      background: i === page ? "var(--accent)" : "var(--nav-border)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "width 0.3s ease, background 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Cards grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {currentItems.map((t, i) => (
              <TestimonialCard
                key={`${animKey}-${i}`}
                {...t}
                index={i}
                animKey={animKey}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}