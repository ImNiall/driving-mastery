export const metadata = { title: "Driving Mastery" };

import type { ReactNode } from 'react';
import "./globals.css";
import SWKillRegister from "./sw-kill-register";
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SWKillRegister />
        {children}
      </body>
    </html>
  );
}
