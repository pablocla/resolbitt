import { useSession } from "next-auth/react";

const useAuth = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return {
    user: session?.user || null,
    loading,
  };
};

export default useAuth;
