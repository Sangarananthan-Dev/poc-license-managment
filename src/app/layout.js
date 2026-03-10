import "./globals.css";

import { SimulationProvider } from "@/components/simulation-provider";

export const metadata = {
  title: "ENG License Management Dashboard",
  description: "Enterprise engineering software license utilization dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SimulationProvider>{children}</SimulationProvider>
      </body>
    </html>
  );
}
