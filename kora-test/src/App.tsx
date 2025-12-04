//src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import LoginSuccess from "./pages/LoginSuccess";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login/success" element={<LoginSuccess />} />
      </Routes>
    </BrowserRouter>
  );
}
