import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./Dashboard";
import LicitacionList from "./LicitacionList";
import NewLicitacion from "./NewLicitacion";
import OfertaList from "./OfertaList";
import Login from "./Login";
import Signup from "./Signup";
import UserNotApproved from "./UserNotApproved";
import { AuthProvider } from "../context/AuthContext";
import { ServicesProvider } from "../context/ServicesContext";
import UserList from "./UserList";
import PendingUsers from "./PendingUsers";

export default function Main() {
  return (
    <AuthProvider>
      <ServicesProvider>
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route
            path="/user-not-approved"
            element={<UserNotApproved />}
          ></Route>
          <Route path="/licitaciones" element={<LicitacionList />}></Route>
          <Route path="/ofertas" element={<OfertaList />}></Route>
          <Route path="/nueva-licitacion" element={<NewLicitacion />}></Route>
          <Route path="/user-list" element={<UserList />}></Route>
          <Route path="/pending-users" element={<PendingUsers />}></Route>
        </Routes>
      </ServicesProvider>
    </AuthProvider>
  );
}
