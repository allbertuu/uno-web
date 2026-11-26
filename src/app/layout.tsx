import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ActiveTaskProvider } from "@/contexts/active-task";
import { StatsProvider } from "@/contexts/stats";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uno: clareza radical para você terminar o que importa",
  description:
    "O Uno coloca apenas uma tarefa no centro da tela para tornar o trabalho mais fácil sem distrações, mais claro com critérios de aceite objetivos e mais satisfatório ao transformar cada entrega em uma conquista imediata.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <StatsProvider>
          <ActiveTaskProvider>{children}</ActiveTaskProvider>
        </StatsProvider>
      </body>
    </html>
  );
}
