import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";

const AuthContext = React.createContext({
  login: () => {},
  logout: () => {},
  CheckToken: () => {},
});

export const UseAuth = () => React.useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  useEffect(() => {
    CheckToken();
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    CheckToken();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const CheckToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const decoded = jwt_decode(token);
      if (decoded.exp < Date.now() / 1000) {
        navigate("/login");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ login, logout, CheckToken }}>
      {children}
    </AuthContext.Provider>
  );
};
