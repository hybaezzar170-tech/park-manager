import React, { useState } from "react";
import AdministrationDashboard from "./components/AdministrationDashboard";
import Dashboard from "./components/Dashboard";
import DashboardParametrage from "./components/DashboardParametrage";
import UserVoitures from "./components/UserVoitures";
import UserParametrage from "./components/UserParametrage";
import UserReclamation from "./components/UserReclamation";
import Login from "./components/login";
import logo from "./assets/autopark.png";

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem("authToken", userData.token);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  if (currentView === "admin")
    return (
      <AdministrationDashboard
        user={user}
        onLogout={handleLogout}
        onClose={() => setCurrentView(null)}
      />
    );

  if (currentView === "dashboard")
    return (
      user.role === 'admin' ? (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onClose={() => setCurrentView(null)}
        />
      ) : (
        <UserVoitures
          user={user}
          onLogout={handleLogout}
          onClose={() => setCurrentView(null)}
        />
      )
    );

  if (currentView === "parametrage")
    return (
      user.role === 'admin' ? (
        <DashboardParametrage
          user={user}
          onLogout={handleLogout}
          onClose={() => setCurrentView(null)}
        />
      ) : (
        <UserParametrage
          user={user}
          onLogout={handleLogout}
          onClose={() => setCurrentView(null)}
        />
      )
    );

  if (currentView === "reclamation")
    return (
      <UserReclamation
        user={user}
        onLogout={handleLogout}
        onClose={() => setCurrentView(null)}
      />
    );

  return (
    <div
      style={{
        fontFamily:
          "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 16px",
          background: "rgba(220, 53, 69, 0.9)",
          color: "#ffffff",
          borderRadius: "20px",
          cursor: "pointer",
        }}
      >
        Déconnexion
      </button>

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <img
          src={logo}
          alt="Alba Parc Logo"
          style={{
            height: "300px",
            marginBottom: "30px",
            borderRadius: "20px",
          }}
        />

        <div
          style={{
            display: "flex",
            gap: "30px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {user.role === "admin" ? (
            [
              { view: "dashboard", label: "Voitures" },
              { view: "admin", label: "Administration" },
              { view: "parametrage", label: "Paramétrage" },
            ].map(({ view, label }) => (
              <div
                key={view}
                onClick={() => setCurrentView(view)}
                style={{
                  background: "#800c1f",
                  color: "#ffffff",
                  padding: "35px 45px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  textAlign: "center",
                  minWidth: "250px",
                  fontSize: "18px",
                  fontWeight: "600",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: "600" }}>
                  {label}
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              </div>
            ))
          ) : (
            [
              { view: "dashboard", label: "Voitures" },
              { view: "parametrage", label: "Paramétrage" },
              { view: "reclamation", label: "Réclamation" },
            ].map(({ view, label }) => (
              <div
                key={view}
                onClick={() => setCurrentView(view)}
                style={{
                  background: "#800c1f",
                  color: "#ffffff",
                  padding: "35px 45px",
                  borderRadius: "25px",
                  cursor: "pointer",
                  textAlign: "center",
                  minWidth: "250px",
                  fontSize: "18px",
                  fontWeight: "600",
                  position: "relative",
                }}
              >
                <div style={{ fontSize: "20px", fontWeight: "600" }}>
                  {label}
                </div>

                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
