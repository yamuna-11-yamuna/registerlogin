import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";

const App = () => {
  const [page, setPage] = useState("login");

  return (
    <div>
      {page === "login" && <Login switchToRegister={() => setPage("register")} onAdminLogin={() => setPage("admin")} />}
      {page === "register" && <Register switchToLogin={() => setPage("login")} />}
      {page === "admin" && <AdminDashboard switchToLogin={() => setPage("login")} />}
    </div>
  );
};

export default App;
