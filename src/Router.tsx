import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import InputPage from "./pages/InputPage";
import ResultPage from "./pages/ResultPage";
import { HomePage } from "./pages/HomePage";
import { InputPage } from "./pages/InputPage";
import { Loading } from "./components/Loading";
import { ResultPage } from "./pages/ResultPage";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/input" element={<InputPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
};
