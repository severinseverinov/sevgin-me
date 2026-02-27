import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <nav
          style={{
            height: "var(--nav-height)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            position: "sticky",
            top: 0,
            background: "rgba(10, 10, 15, 0.8)",
            backdropFilter: "blur(12px)",
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
                fontSize: "1.25rem",
                letterSpacing: "-0.02em",
              }}
            >
              sevgin<span style={{ color: "var(--accent-primary)" }}>.me</span>
            </div>
            <div style={{ display: "flex", gap: "2rem" }}>
              <a href="#" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                Home
              </a>
              <a
                href="#projects"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                }}
              >
                Projects
              </a>
              <a
                href="#"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                }}
              >
                About
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
