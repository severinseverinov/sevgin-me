import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Sevgin Serbest | Personal Website",
  description: "Personal portfolio, projects, and thoughts of Sevgin Serbest.",
};

export default async function Home() {
  const projects = await prisma.portfolioItem.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <main className="container">
      {/* Hero Section */}
      <section
        className="section animate-fade-in"
        style={{ paddingBottom: "4rem" }}
      >
        <div
          style={{
            maxWidth: "900px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "var(--accent-primary)",
              color: "white",
              padding: "0.25rem 0.75rem",
              fontWeight: "600",
              letterSpacing: "0.1em",
              fontSize: "0.875rem",
              borderRadius: "100px",
              marginBottom: "1.5rem",
            }}
            className="animate-fade-in delay-100"
          >
            SOFTWARE ENGINEER
          </div>
          <h1
            className="animate-fade-in delay-200"
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              textTransform: "uppercase",
              lineHeight: "1",
            }}
          >
            Sevgin Serbest
          </h1>
          <p
            className="animate-fade-in delay-300"
            style={{
              fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
              color: "var(--text-primary)",
              fontWeight: "500",
              marginTop: "1.5rem",
              maxWidth: "800px",
            }}
          >
            I build digital products with clean code, solid architectures, and
            an energetic aesthetic. Based on the internet.
          </p>
          <div
            className="animate-fade-in delay-300"
            style={{
              display: "flex",
              gap: "1.5rem",
              marginTop: "2.5rem",
            }}
          >
            <a href="#projects" className="btn btn-primary">
              View Work
            </a>
            <a
              href="mailto:contact@sevginserbest.com"
              className="btn btn-secondary"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        className="section animate-fade-in delay-300"
        style={{ paddingTop: "2rem" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "3rem",
            borderBottom: "4px solid var(--text-primary)",
            paddingBottom: "1rem",
          }}
        >
          <h2
            style={{ margin: 0, fontSize: "3rem", textTransform: "uppercase" }}
          >
            Projects
          </h2>
          <span style={{ fontWeight: 600, fontSize: "1.25rem" }}>
            {projects.length} ITEMS
          </span>
        </div>

        <div className="grid-2">
          {projects.length === 0 ? (
            <p
              style={{
                gridColumn: "1 / -1",
                fontSize: "1.5rem",
                fontWeight: 500,
                fontStyle: "italic",
              }}
            >
              Projects compiling... Check back soon.
            </p>
          ) : (
            projects.map(
              (project: {
                id: string;
                title: string;
                description: string;
                link: string | null;
              }) => (
                <div
                  key={project.id}
                  className="glass-card"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <h3
                    style={{
                      fontSize: "1.75rem",
                      marginBottom: "1rem",
                      borderBottom: "2px solid var(--bg-secondary)",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      flexGrow: 1,
                      marginBottom: "2rem",
                      color: "var(--text-primary)",
                    }}
                  >
                    {project.description}
                  </p>

                  {project.link && (
                    <div style={{ marginTop: "auto" }}>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{
                          width: "100%",
                        }}
                      >
                        Visit Project →
                      </a>
                    </div>
                  )}
                </div>
              ),
            )
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "2px solid var(--text-primary)",
          padding: "4rem 0",
          marginTop: "4rem",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        <div>
          <h3 style={{ fontSize: "1.5rem" }}>Sevgin Serbest</h3>
          <p style={{ margin: "0.5rem 0 0", fontSize: "1rem" }}>
            Building for the web.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <a href="#" style={{ fontWeight: 600, textTransform: "uppercase" }}>
            GitHub
          </a>
          <a href="#" style={{ fontWeight: 600, textTransform: "uppercase" }}>
            LinkedIn
          </a>
          <a
            href="/login"
            style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
          >
            Admin
          </a>
        </div>
      </footer>
    </main>
  );
}
