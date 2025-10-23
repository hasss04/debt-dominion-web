// components/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  FC,
  ComponentType,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { ref, set, get, update } from "firebase/database";
import { rtdb } from "../services/firebase";
import Spinner from "./Spinner";
import { Navigate } from "react-router-dom";
import type { User, Theme } from "../services/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  theme: Theme;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<User>;
  setTheme: (theme: Theme) => void;
  updateUser: (userData: Partial<Pick<User, "displayName" | "photoURL">>) => Promise<void>;
  protectedRoute: <P extends object>(Component: ComponentType<P>) => React.FC<P>;
  adminProtectedRoute: <P extends object>(Component: ComponentType<P>) => React.FC<P>;
  getAllUsers: () => Promise<User[]>;
  updateUserRole: (uid: string, role: "admin" | "member") => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const auth = getAuth();

export const AuthProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<Theme>(
    (localStorage.getItem("theme") as Theme) || "dark"
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = ref(rtdb, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);
          let role = "subscriber";

          if (!snapshot.exists()) {
            await set(userRef, {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || "New User",
              email: firebaseUser.email,
              role: "subscriber",
              avatarUrl:
                firebaseUser.photoURL ||
                `https://picsum.photos/seed/${firebaseUser.uid}/40/40`,
              createdAt: new Date().toISOString(),
            });
          } else {
            const data = snapshot.val();
            role = (data.role || "subscriber").toLowerCase();
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || "User",
            photoURL: firebaseUser.photoURL || "",
            role: role as "admin" | "member" | "subscriber",
          });
        } catch (err) {
          console.error("Error loading user data:", err);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (name: string, email: string, password: string): Promise<User> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    await updateProfile(newUser, { displayName: name });

    await set(ref(rtdb, `users/${newUser.uid}`), {
      id: newUser.uid,
      name,
      email,
      role: "subscriber",
      avatarUrl: `https://picsum.photos/seed/${newUser.uid}/40/40`,
      createdAt: new Date().toISOString(),
    });

    const userData: User = {
      uid: newUser.uid,
      email: newUser.email!,
      displayName: name,
      photoURL: `https://picsum.photos/seed/${newUser.uid}/40/40`,
      role: "subscriber",
    };

    setUser(userData);
    return userData;
  };

  const login = async (email: string, password: string): Promise<User> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    const snapshot = await get(ref(rtdb, `users/${firebaseUser.uid}`));
    const dbData = snapshot.exists() ? snapshot.val() : {};

    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: dbData.name || firebaseUser.displayName || "User",
      photoURL: dbData.avatarUrl || firebaseUser.photoURL || "",
      role: (dbData.role || "subscriber").toLowerCase(),
    };

    setUser(userData);
    return userData;
  };

  const signInWithGoogle = async (): Promise<User> => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;
    const userRef = ref(rtdb, `users/${firebaseUser.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || "Google User",
        email: firebaseUser.email,
        role: "subscriber",
        avatarUrl: firebaseUser.photoURL || "",
        createdAt: new Date().toISOString(),
      });
    }

    const dbData = snapshot.exists() ? snapshot.val() : {};
    const userData: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: dbData.name || firebaseUser.displayName || "Google User",
      photoURL: dbData.avatarUrl || firebaseUser.photoURL || "",
      role: (dbData.role || "subscriber").toLowerCase(),
    };

    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateUser = async (userData: Partial<Pick<User, "displayName" | "photoURL">>) => {
    if (!user) throw new Error("No user is signed in.");
    await update(ref(rtdb, `users/${user.uid}`), userData);
    setUser({ ...user, ...userData });
  };

  const getAllUsers = async (): Promise<User[]> => {
    const snapshot = await get(ref(rtdb, "users"));
    if (!snapshot.exists()) return [];
    const data = snapshot.val();
    return Object.keys(data).map((uid) => ({
      uid,
      email: data[uid].email,
      displayName: data[uid].name,
      photoURL: data[uid].avatarUrl,
      role: (data[uid].role || "subscriber").toLowerCase(),
    }));
  };

  const updateUserRole = async (uid: string, role: "admin" | "member") => {
    await update(ref(rtdb, `users/${uid}`), { role });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const protectedRoute = <P extends object>(Component: ComponentType<P>): React.FC<P> => {
    const ProtectedComponent: React.FC<P> = (props) => {
      if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;
      if (!user) return <Navigate to="/login" replace />;
      return <Component {...props} />;
    };
    return ProtectedComponent;
  };

  const adminProtectedRoute = <P extends object>(Component: ComponentType<P>): React.FC<P> => {
    const AdminProtectedComponent: React.FC<P> = (props) => {
      if (loading) return <div className="flex justify-center items-center h-96"><Spinner /></div>;
      if (!user) return <Navigate to="/login" replace />;
      if (user.role !== "admin") return <Navigate to="/" replace />;
      return <Component {...props} />;
    };
    return AdminProtectedComponent;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        theme,
        setTheme,
        login,
        signup,
        logout,
        signInWithGoogle,
        updateUser,
        protectedRoute,
        adminProtectedRoute,
        getAllUsers,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};