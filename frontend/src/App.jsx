import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Bookmarks from "./pages/Bookmarks";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route element={<ProtectedRoute />}>
          <Route element={<Bookmarks />} path="/bookmarks" />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
