import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  const handleQuickAction = (action: string) => {
    console.log(`Quick action triggered: ${action}`);
    // Implementa las acciones rápidas aquí
  };

  return (
    <SessionProvider session={pageProps.session}>
      <Layout onQuickAction={handleQuickAction}>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
