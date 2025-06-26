import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InputPage from "./pages/InputPage";
import LoadingPage from "./pages/LoadingPage";
import ResultPage from "./pages/ResultPage";
import ErrorPage from "./pages/ErrorPage";

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/input" element={<InputPage />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/result" element={<ResultPage />} />
      <Route path="/error" element={<ErrorPage />} />
    </Routes>
  );
};

export default Router;
