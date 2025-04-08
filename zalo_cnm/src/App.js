import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeScreen from "./screen/HomeScreen";
import ContactsScreen from "./screen/ContactsScreen";
import LoginScreen from "./screen/LoginScreen";
import RegisterScreen from "./screen/RegisterScreen"; // 👉 Thêm dòng này
import ForgotPasswordScreen from "./screen/ForgotPasswordScreen";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} /> {/* 👈 Thêm route mới */}
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/contacts" element={<ContactsScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
