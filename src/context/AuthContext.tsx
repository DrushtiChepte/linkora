import { User } from "@supabase/supabase-js";
import { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../supabase-client";

interface CustomProfile {
  username: string | null;
  profilePhoto: string | null;
}

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => void;
  signOut: () => void;
  profile: CustomProfile;
  setProfile: React.Dispatch<React.SetStateAction<CustomProfile>>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomProfile>({
    username: null,
    profilePhoto: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, profile_photo")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user profile:", error.message);
      return;
    }

    if (!data) {
      // No profile yet
      setProfile({
        username: null,
        profilePhoto: null,
      });
      return;
    }

    setProfile({
      username: data.username,
      profilePhoto: data.profile_photo,
    });
  };

  useEffect(() => {
    setIsLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) {
        fetchUserProfile(authUser.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) {
        setIsLoading(true);
        fetchUserProfile(authUser.id).finally(() => setIsLoading(false));
      } else {
        setProfile({ username: null, profilePhoto: null });
        setIsLoading(false);
      } // reset on logout
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/",
      },
    });
    if (error) {
      console.error("Error signing in with Google:", error.message);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        signOut,
        profile,
        setProfile,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
