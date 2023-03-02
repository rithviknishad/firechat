import { Inter, Roboto_Mono, Comfortaa } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto_mono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  display: "swap",
});

export const metadata = {
  title: "Firechat",
  description: "A simple react chat client using firebase realtime database.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto_mono.variable} ${comfortaa.variable} bg-black text-white`}
    >
      <body>{children}</body>
    </html>
  );
}
