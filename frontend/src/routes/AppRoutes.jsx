import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/dashboard/Dashboard";
import Books from "../pages/books/Books";
import Users from "../pages/users/Users";
import Loans from "../pages/loans/Loans";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/books" element={<Books />} />
        <Route path="/users" element={<Users />} />
        <Route path="/loans" element={<Loans />} />
      </Routes>
    </BrowserRouter>
  );
}