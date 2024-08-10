import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useAuth from "../lib/useAuth";

interface ErrorState {
  message: string;
}

const FacturadorPage = () => {
  const { user, loading, error } = useAuth();
  const router = useRouter();
  const [errorState, setErrorState] = useState<ErrorState | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
    if (error) {
      setErrorState({ message: error.message });
    }
  }, [loading, user, error, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorState) {
    return <div>Error: {errorState.message}</div>;
  }

  return (
    <div className="main">
      <Head>
        <title>ResolbIT - Facturador</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-7xl mx-auto py-12 px-6 sm:px-8 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Facturador</h1>
        {user ? (
          <>
            <p className="text-lg mb-8">Welcome, {user.name}!</p>
            <div>
              <Link href="/factura" passHref legacyBehavior>
                <a className="button">Ir a Facturación</a>
              </Link>
              <Link href="/producto" passHref legacyBehavior>
                <a className="button">Administrar Productos</a>
              </Link>
              <Link href="/cliente" passHref legacyBehavior>
                <a className="button">Administrar Clientes</a>
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg mb-8">
              Please log in or sign up to access the Facturador.
            </p>
            <div>
              <Link href="/auth/signin" passHref legacyBehavior>
                <a className="button">Login</a>
              </Link>
              <Link href="/auth/signup" passHref legacyBehavior>
                <a className="button">Sign Up</a>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default FacturadorPage;
