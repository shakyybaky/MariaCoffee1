import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login"; 
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";
import CustomerOrder from "./pages/CustomerOrder";
import OrdersAdmin from "./pages/OrdersAdmin";


function App() {
  return (
    <BrowserRouter>

      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/customer-order" element={<CustomerOrder />} />
      <Route path="/orders-admin" element={<OrdersAdmin />} />


      </Routes>
    </BrowserRouter>
  );
}
  export default App;
