import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConversationProvider } from "@/contexts/ConversationContext";


export const metadata: Metadata = {
  title: "ConsultAI - Assistente Virtual Inteligente",
  description: "Assistente virtual para consultas e atendimento automatizado da Prefeitura de Juiz de Fora",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning className="h-screen w-full m-0 p-0 flex flex-col bg-white overflow-hidden">
        <div vw="true" className="enabled">
          <div vw-access-button="true" className="active"></div>
          <div vw-plugin-wrapper="true">
            <div className="vw-plugin-top-wrapper"></div>
          </div>
        </div>
        <AuthProvider>
          <ConversationProvider>
            <Header />
            <div className="flex-1 flex flex-col min-h-0">
              {children}
            </div>
            <Footer />
          </ConversationProvider>
        </AuthProvider>
        <Script src="https://vlibras.gov.br/app/vlibras-plugin.js" strategy="beforeInteractive" />
        <Script id="vlibras-init" strategy="afterInteractive">
          {`new window.VLibras.Widget('https://vlibras.gov.br/app');`}
        </Script>
      </body>
    </html>
  );
}
