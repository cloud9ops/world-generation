import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  username: string;
  title: string;
  fragmentsCollected: number;
  // other user-related fields can be added later
}

interface AuthContextType {
  authUser: User | null;
  login: (username: string, password: string, remember?: boolean) => void;
  logout: () => void;
  signup: (username: string, password: string, initialTitle: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<User | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cosmogony_user');
    if (stored) {
      try {
        setAuthUser(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse stored cosmogony_user:", err);
        localStorage.removeItem('cosmogony_user');
      }
    }
  }, []);

  const persistUser = (user: User | null, remember?: boolean) => {
    if (user && remember) {
      localStorage.setItem('cosmogony_user', JSON.stringify(user));
    } else if (!user) {
      localStorage.removeItem('cosmogony_user');
    }
    setAuthUser(user);
  };

  const login = (username: string, _password: string, remember: boolean = true) => {
    // Mock authentication: just store the username with a default title
    const user: User = {
      username,
      title: 'Novice Explorer',
      fragmentsCollected: 0,
    };
    persistUser(user, remember);
  };

  const logout = () => {
    persistUser(null);
  };

  const signup = (username: string, _password: string, initialTitle: string) => {
    const user: User = {
      username,
      title: initialTitle,
      fragmentsCollected: 0,
    };
    persistUser(user, true);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};
