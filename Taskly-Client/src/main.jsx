// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";

import LoginPage from "./pages/LoginPage";
import AuthProvider from "./providers/AuthProvider";
import Tasks from "./pages/Tasks";
import About from "./pages/About";
// import routes from "./routes/Routes"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer position="top-center" autoClose={3000} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
