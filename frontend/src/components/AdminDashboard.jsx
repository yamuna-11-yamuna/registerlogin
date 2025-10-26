// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import "./AdminDashboard.css"; 

const AdminDashboard = ({ switchToLogin }) => {
  const [users, setUsers] = useState([]);
  const [totalLogins, setTotalLogins] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/users", {
      headers: { adminkey: "mySecretAdminKey" },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        const logins = data.reduce((sum, user) => sum + (user.loginCount || 0), 0);
        setTotalLogins(logins);
      })
      .catch(() => alert("Failed to load users"));
  }, []);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>👩‍💼 Admin Dashboard</h2>
        <button className="logout-btn" onClick={switchToLogin}>
          Logout
        </button>
      </div>

      {/* ✅ Dashboard cards */}
      <div className="dashboard-cards">
        <div className="card total-users">
          <div className="card-icon">👥</div>
          <div className="card-info">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="card total-logins">
          <div className="card-icon">🔑</div>
          <div className="card-info">
            <h3>{totalLogins}</h3>
            <p>Total Logins</p>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Login Count</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.loginCount || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-users">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
