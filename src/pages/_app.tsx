<<<<<<< HEAD
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Modal from "react-modal";
import { useTheme } from "../hooks/useTheme";

Modal.setAppElement("#__next");

function MyApp({ Component, pageProps }: AppProps) {
  const { theme } = useTheme();

  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action);
  };

  return (
    <SessionProvider session={pageProps.session}>
      <div className={theme}>
        <Layout onQuickAction={handleQuickAction}>
          <Component {...pageProps} />
        </Layout>
      </div>
    </SessionProvider>
  );
=======
// src/pages/_app.tsx

import type { AppProps } from "next/app";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
>>>>>>> 6b7626470a55dafe12231f2164104a1a31fd70de
}

export default MyApp;
