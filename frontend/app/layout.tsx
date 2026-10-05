import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "TaskFlow — Make things happen.",
  description:
    "Big ideas. Small steps. A neo-brutalist workspace for your tasks.",
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
