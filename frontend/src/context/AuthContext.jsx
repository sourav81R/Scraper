import { signInWithPopup, signOut } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi } from "../api/services";
import { auth, googleProvider } from "../firebase";

const TOKEN_KEY = "hn-tracker-token";
const USER_KEY = "hn-tracker-user";

const AuthContext = createContext(null);

const parseStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => parseStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [status, setStatus] = useState("loading");
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const [googleStatusLoading, setGoogleStatusLoading] = useState(true);

  const persistSession = useCallback((nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setStatus("authenticated");
  }, []);

  const clearSession = useCallback(async () => {
    await signOut(auth).catch(() => {});
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setStatus("unauthenticated");
  }, []);

  const refreshGoogleStatus = useCallback(async () => {
    try {
      const response = await authApi.googleStatus();
      setGoogleAvailable(Boolean(response.data?.configured));
    } catch (error) {
      setGoogleAvailable(false);
    } finally {
      setGoogleStatusLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setStatus("unauthenticated");
      return null;
    }

    try {
      const response = await authApi.me();
      persistSession(localStorage.getItem(TOKEN_KEY), response.data);
      return response.data;
    } catch (error) {
      await clearSession();
      return null;
    }
  }, [clearSession, persistSession]);

  useEffect(() => {
    refreshGoogleStatus();
  }, [refreshGoogleStatus]);

  useEffect(() => {
    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    refreshProfile();
  }, [refreshProfile, token]);

  const login = useCallback(
    async (credentials) => {
      const response = await authApi.login(credentials);
      persistSession(response.data.token, response.data.user);
      return response;
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload) => {
      const response = await authApi.register(payload);
      persistSession(response.data.token, response.data.user);
      return response;
    },
    [persistSession]
  );

  const loginWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    const response = await authApi.google(idToken);
    persistSession(response.data.token, response.data.user);
    return response;
  }, [persistSession]);

  const updateBookmarks = useCallback((bookmarks) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return currentUser;
      }

      const updatedUser = { ...currentUser, bookmarks };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      status,
      isAuthenticated: Boolean(token && user),
      googleAvailable,
      googleStatusLoading,
      login,
      register,
      loginWithGoogle,
      logout: clearSession,
      refreshProfile,
      refreshGoogleStatus,
      updateBookmarks,
    }),
    [
      clearSession,
      googleAvailable,
      googleStatusLoading,
      login,
      refreshGoogleStatus,
      refreshProfile,
      register,
      status,
      token,
      updateBookmarks,
      user,
      loginWithGoogle,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
