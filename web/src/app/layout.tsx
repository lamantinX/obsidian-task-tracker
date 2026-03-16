import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";

import "@/app/globals.css";
import { NewTaskModal } from "@/components/new-task-modal";
import { SearchBox } from "@/components/search-box";
import { getOptionalSession } from "@/server/auth/server-session";
import { getVaultAdapter } from "@/server/vault";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Task Tracker Panel",
  description: "Web panel for the Obsidian task tracker vault"
};

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products", label: "Products" },
  { href: "/projects", label: "Projects" },
  { href: "/tasks", label: "Tasks" }
];

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await getOptionalSession();
  const [products, projects] = session
    ? await Promise.all([getVaultAdapter().listProducts(), getVaultAdapter().listProjects()])
    : [[], []];

  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <div className="app-shell">
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-mark">OT</div>
              <div className="brand-copy">
                <strong>Task Tracker</strong>
                <span className="sidebar-note">Vault workspace</span>
              </div>
            </div>
            <nav className="sidebar-nav">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="sidebar-footer">
              {session ? (
                <>
                  <strong>{session.name}</strong>
                  <span>{session.email}</span>
                  <form action="/api/auth/logout" method="post">
                    <button className="ghost-button" type="submit">
                      Sign out
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login" className="ghost-button">
                  Sign in
                </Link>
              )}
            </div>
          </aside>
          <div className="page-shell">
            <header className="page-header">
              <div>
                <h1>Workspace</h1>
              </div>
              {session ? (
                <div className="topbar-actions">
                  <SearchBox />
                  <NewTaskModal products={products} projects={projects} sessionUser={session} />
                </div>
              ) : null}
            </header>
            <main className="page-content">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
