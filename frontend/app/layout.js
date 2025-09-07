import { Geist, Geist_Mono, Lato, Titillium_Web } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/lib/language/LanguageContext';
import LanguageLoader from '@/components/utilities/LanguageLoader';
import Hero from '@/components/utils/Hero';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const titilliumWeb = Titillium_Web({
  variable: "--font-titillium-web",
  subsets: ["latin"],
  weight: '400',
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: '400',
});


export const metadata = {
  title: "3D Vision AI - Your Travel Companion",
  description: "Plan your perfect trip with 3D Vision AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${lato.variable} antialiased`}
      >
        <ThemeProvider attribute="class">
          <LanguageProvider>
            <LanguageLoader>
              <div className="bg-main-bg dark:bg-menu-secondary scrollbar-hidden">
                {/* Global Navigation - appears on all pages */}
                {/* <nav className='sticky top-0 bg-main-bg dark:bg-menu-secondary z-50 h-16'>
                  <Hero landing={false} />
                </nav> */}
                {/* Main content */}
                {children}
              </div>
            </LanguageLoader>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
