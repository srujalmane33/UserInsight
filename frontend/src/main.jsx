
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import DashBoard from "./pages/DashBoard";
import DetailedReportPage from "./pages/DetailedReportPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashBoard />} />
      <Route path="/report/:id" element={<DetailedReportPage />} />
    </Routes>
  </BrowserRouter>
);