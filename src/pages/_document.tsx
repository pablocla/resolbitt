import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Aquí puedes agregar cualquier etiqueta <meta> o <link> adicional */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
