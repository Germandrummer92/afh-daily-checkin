import { Route, Routes } from "react-router-dom";
import { App } from "./App";
import { CheckInPage } from "./CheckInPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/check-in" element={<CheckInPage />} />
    </Routes>
  );
}
