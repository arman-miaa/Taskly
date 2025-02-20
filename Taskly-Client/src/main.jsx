// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home";
// import routes from "./routes/Routes"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
       
        <Route path="/" element={<MainLayout />} >
        <Route index element={<Home/>} />
      </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
