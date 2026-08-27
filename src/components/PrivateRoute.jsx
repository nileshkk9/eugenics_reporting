import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LOCAL_AUTH_KEY } from "../utils/constants";

const PrivateRoute = () => {
  return localStorage.getItem(LOCAL_AUTH_KEY) ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
