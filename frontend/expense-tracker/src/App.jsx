import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import UserProvider from "./context/userContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route 
            path="/" element={<Navigate to={localStorage.getItem("token") ? "/dashboard" : "/login"} />} />

            <Route path="/login" exact element={<Login />} />
            <Route path="/signUp" exact element={<SignUp />} />

            <Route path="/dashboard" exact element={<ProtectedRoute><Home /></ProtectedRoute> } />
            <Route path="/income" exact element={<ProtectedRoute><Income /></ProtectedRoute>} />
            <Route path="/expense" exact element={<ProtectedRoute><Expense /></ProtectedRoute>} />
          </Routes>
        </Router>
      </div>

      <Toaster 
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          }
        }}
      />
    </UserProvider>
  );
};

export default App;

