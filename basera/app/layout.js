import { Quicksand, Plus_Jakarta_Sans, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-devanagari",
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "700", "900"],
});

export const metadata = {
  title: "Basera — नए शहर का साथी | Settle in like a Local",
  description: "Find housing, tiffins, home services, gyms, and everything you need to settle into a new city like a local.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${quicksand.variable} ${plusJakartaSans.variable} ${notoSansDevanagari.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface relative">
        {/* Global Hardware-Accelerated Animated Mesh Gradients */}
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none">
          <div className="mesh-blob-1 top-[-10%] left-[-5%]"></div>
          <div className="mesh-blob-2 top-[25%] right-[-10%]"></div>
          <div className="mesh-blob-3 bottom-[-10%] left-[20%]"></div>
        </div>

        {/* Global SVG Tactile Film Grain Noise Overlay */}
        <svg className="fixed inset-0 w-full h-full opacity-[0.015] pointer-events-none -z-40 select-none mix-blend-overlay" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

