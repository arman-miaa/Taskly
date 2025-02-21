// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import AuthProvider from "./providers/AuthProvider";
// import routes from "./routes/Routes"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="welcome" element={<WelcomePage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
