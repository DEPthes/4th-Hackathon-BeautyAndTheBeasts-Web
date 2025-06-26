import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Page } from "./pages/page"

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Page />} />
      </Routes>
    </BrowserRouter>
  )
}