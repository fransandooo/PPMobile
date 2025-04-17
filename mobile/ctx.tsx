import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

type SessionContextType = {
  session: string | null;
  isLoading: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const token = await AsyncStorage.getItem("authToken");
      setSession(token);
      setIsLoading(false);
    };
    loadSession();
  }, []);

  const signIn = async (token: string) => {
    await AsyncStorage.setItem("authToken", token);
    setSession(token);
    router.replace("/");
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("authToken");
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
