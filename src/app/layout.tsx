import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sevgin Serbest",
  description: "Personal website of Sevgin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav
          style={{
            height: "var(--nav-height)",
            borderBottom: "2px solid var(--text-primary)",
            display: "flex",
            alignItems: "center",
            position: "sticky",
            top: 0,
            background: "var(--bg-primary)",
            zIndex: 100,
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: "1.5rem",
                letterSpacing: "-0.03em",
                fontFamily: "var(--font-heading, 'Archivo', sans-serif)",
                textTransform: "uppercase",
              }}
            >
              sevgin<span style={{ color: "var(--accent-primary)" }}>.me</span>
            </div>
            <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
              <a
                href="#"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Home
              </a>
              <a
                href="#projects"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                }}
              >
                Projects
              </a>
              <a
                href="/login"
                className="btn btn-primary"
                style={{
                  fontSize: "0.75rem",
                  padding: "0.5rem 1rem",
                }}
              >
                ADMIN
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
