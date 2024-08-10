<<<<<<< HEAD
import styles from "../styles/Quote.module.css";
import Head from "next/head";

const QuotePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-purple-800 to-gray-900 text-white">
      <Head>
        <title>ResolbIT - Cotización</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-7xl mx-auto py-12 px-6 sm:px-8 text-center">
        <h2 className={`text-4xl font-extrabold mb-4 ${styles.title}`}>
          Cotización
        </h2>
        <p className="text-lg mb-8">
=======
// pages/quote.tsx
import Layout from "../components/Layout";
import styles from "../styles/Quote.module.css";

const QuotePage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          Cotización
        </h2>
        <p className="text-lg text-gray-700 mb-8">
>>>>>>> 6b7626470a55dafe12231f2164104a1a31fd70de
          Completa el formulario para cotizar tu proyecto de software
          personalizado.
        </p>
        <div className={styles.calendlyContainer}>
          <iframe
            src="https://calendly.com/pabloclavero03/cotizacion"
            width="100%"
            height="600px"
            frameBorder="0"
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
<<<<<<< HEAD
      </main>
    </div>
=======
      </div>
    </Layout>
>>>>>>> 6b7626470a55dafe12231f2164104a1a31fd70de
  );
};

export default QuotePage;
