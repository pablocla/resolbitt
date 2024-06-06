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
      </div>
    </Layout>
  );
};

export default QuotePage;
