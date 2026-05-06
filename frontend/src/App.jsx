import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Stories = lazy(() => import("./pages/Stories"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen overflow-x-hidden">
        <Navbar />
        <Suspense
          fallback={
            <div className="flex min-h-[70vh] items-center justify-center">
              <LoadingSpinner label="Preparing experience" />
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route element={<Home />} path="/" />
              <Route element={<About />} path="/about" />
              <Route element={<Login />} path="/login" />
              <Route element={<Register />} path="/register" />
              <Route element={<ProtectedRoute />}>
                <Route element={<Stories />} path="/stories" />
                <Route element={<Bookmarks />} path="/bookmarks" />
              </Route>
              <Route element={<NotFound />} path="*" />
            </Routes>
          </AnimatePresence>
        </Suspense>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default App;
