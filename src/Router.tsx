import { BrowserRouter, Route, Routes } from "react-router-dom";
import InputPage from "./pages/InputPage";
import HomePage from "./pages/HomePage";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/input" element={<InputPage />} />
      </Routes>
    </BrowserRouter>
  );
};
