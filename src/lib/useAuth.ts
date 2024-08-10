import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const useAuth = (): AuthState => {
  const { data: session, status } = useSession();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: status === "loading",
    error: null,
  });

  useEffect(() => {
    if (status === "loading") {
      setAuthState((prev) => ({ ...prev, loading: true }));
    } else if (status === "authenticated") {
      setAuthState({
        user: session?.user as User,
        loading: false,
        error: null,
      });
    } else if (status === "unauthenticated") {
      setAuthState({ user: null, loading: false, error: null });
    } else if (status === "error") {
      setAuthState((prev) => ({
        ...prev,
        error: new Error("Authentication error"),
      }));
    }
  }, [status, session]);

  return authState;
};

export default useAuth;
