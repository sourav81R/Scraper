import { AuthProvider } from "../context/AuthContext";
import { StoryProvider } from "../context/StoryContext";
import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../context/ToastContext";

export const AppProviders = ({ children }) => (
  <ThemeProvider>
    <ToastProvider>
      <AuthProvider>
        <StoryProvider>{children}</StoryProvider>
      </AuthProvider>
    </ToastProvider>
  </ThemeProvider>
);
