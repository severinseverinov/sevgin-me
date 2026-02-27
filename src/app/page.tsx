import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sevgin Serbest | Personal Website",
  description: "Personal portfolio, projects, and thoughts of Sevgin Serbest.",
};

export default function Home() {
  return (
    <main className="container">
      <section className="section animate-fade-in">
        <div
          style={{
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto 4rem",
          }}
        >
          <h1 className="animate-fade-in">Sevgin Serbest</h1>
          <p className="animate-fade-in delay-100" style={{ margin: "0 auto" }}>
            Welcome to my personal corner on the internet. I build things, write
            code, and explore new technologies.
          </p>
          <div
            className="animate-fade-in delay-200"
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <a href="#projects" className="btn btn-primary">
              View My Projects
            </a>
            <a
              href="mailto:contact@sevginserbest.com"
              className="btn btn-secondary"
            >
              Get in Touch
            </a>
          </div>
        </div>

        <div id="projects" className="grid-2 animate-fade-in delay-300">
          <div className="glass-card">
            <h3 style={{ marginBottom: "1rem" }}>Project 1</h3>
            <p>
              A placeholder for a cool project you have worked on. This card
              uses a sleek glassmorphism effect.
            </p>
          </div>
          <div className="glass-card">
            <h3 style={{ marginBottom: "1rem" }}>Project 2</h3>
            <p>
              Another placeholder. You can connect this to the PostgreSQL
              database later to fetch these dynamically.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
