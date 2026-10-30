import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Basera — नए शहर का साथी | Settle in like a Local",
  description: "Find housing, tiffins, home services, gyms, and everything you need to settle into a new city like a local.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2d2621",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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

