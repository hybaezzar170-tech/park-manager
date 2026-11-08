import React, { useState, useEffect } from "react";
import Alertes from "./Alertes";
import Ouvriers from "./Ouvriers";
import Fournisseurs from "./Fournisseurs";
import logo from "../assets/whitelogo.png";

function AdministrationDashboard({ user, onLogout, onClose }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [statistics, setStatistics] = useState({
    users_count: 0,
    alertes_count: 0,
    techniciens_count: 0,
    mecaniciens_count: 0,
    fournisseurs_count: 0
  });
  const [loading, setLoading] = useState(true);

  const colors = {
    black: "#000000",
    darkGray: "#1a1a1a",
    mediumGray: "#333333",
    lightGray: "#666666",
    offWhite: "#f5f5f5",
    darkBurgundy: "#3C0007",
    deepRed: "#800C1F",
    grayTaupe: "#929CAA"
  };

  // Récupérer les en-têtes d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/statistics", {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Token expiré, rediriger vers login
            localStorage.removeItem('authToken');
            window.location.reload();
            return;
          }
          throw new Error("Failed to fetch statistics");
        }
        
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const StatBox = ({ title, value, color }) => (
    <div style={{
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      borderRadius: "15px",
      padding: "25px",
      color: "#fff",
      boxShadow: `0 10px 25px rgba(0, 0, 0, 0.1)`,
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = `0 15px 35px rgba(0, 0, 0, 0.15)`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = `0 10px 25px rgba(0, 0, 0, 0.1)`;
    }}
    >
      <div style={{
        fontSize: "14px",
        fontWeight: "500",
        marginBottom: "10px",
        opacity: 0.9
      }}>
        {title}
      </div>
      <div style={{
        fontSize: "32px",
        fontWeight: "700",
        marginBottom: "15px"
      }}>
        {loading ? "..." : value}
      </div>
    </div>
  );

  const sidebarButtonStyle = (module) => ({
    display: "block",
    width: "100%",
    marginBottom: "12px",
    padding: "14px 18px",
    backgroundColor: selectedModule === module ? colors.deepRed : "rgba(255, 255, 255, 0.1)",
    color: selectedModule === module ? "#fff" : colors.grayTaupe,
    border: selectedModule === module ? `2px solid ${colors.deepRed}` : "2px solid transparent",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 500,
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: selectedModule === module ? `0 8px 16px rgba(128, 12, 31, 0.3)` : "0 2px 8px rgba(0, 0, 0, 0.1)"
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: colors.black }}>
      <div style={{ 
        width: "280px", 
        background: colors.black,
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "white", 
        padding: "30px 20px", 
        boxShadow: `8px 0 24px rgba(0, 0, 0, 0.3)` 
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <img 
            src={logo} 
            alt="AutoPark Logo" 
            style={{ height: "200px", marginBottom: "10px" }} 
          />
        </div>
        <button
          style={sidebarButtonStyle("alertes")}
          onClick={() => setSelectedModule("alertes")}
        >
          Alertes
        </button>

        <button
          style={sidebarButtonStyle("ouvriers")}
          onClick={() => setSelectedModule("ouvriers")}
        >
          Ouvriers
        </button>

        <button
          style={sidebarButtonStyle("fournisseurs")}
          onClick={() => setSelectedModule("fournisseurs")}
        >
          Fournisseurs
        </button>
        
        <div style={{ marginTop: "30px", borderTop: `1px solid ${colors.lightGray}`, paddingTop: "20px" }}>
          <button 
            onClick={onLogout}
            style={{
              display: "block",
              width: "100%",
              padding: "14px 18px",
              backgroundColor: colors.deepRed,
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: `0 8px 16px rgba(128, 12, 31, 0.3)`
            }}
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div style={{ flexGrow: 1, padding: "40px 50px", backgroundColor: "#f8f9fa", overflowY: "auto", position: "relative" }}>
        <button 
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "10px 16px",
            backgroundColor: colors.grayTaupe,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "14px",
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: `0 4px 12px rgba(146, 156, 170, 0.3)`,
            zIndex: 1000
          }}
        >
          Fermer
        </button>
        {selectedModule === "alertes" && <Alertes />}
        {selectedModule === "ouvriers" && <Ouvriers />}
        {selectedModule === "fournisseurs" && <Fournisseurs />}

        {!selectedModule && (
          <div>
            <h1 style={{ 
              fontSize: "32px", 
              fontWeight: 700, 
              color: colors.darkNavy, 
              marginBottom: "30px",
              letterSpacing: "-0.5px"
            }}>
              Administration 
            </h1>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "25px",
              marginBottom: "40px"
            }}>
            
              <StatBox
                title="Nombre d'alertes"
                value={statistics.alertes_count}
                color={colors.deepRed}
              />
              <StatBox
                title="Nombre de techniciens"
                value={statistics.techniciens_count}
                color={colors.black}
              />
              <StatBox
                title="Nombre de mécaniciens"
                value={statistics.mecaniciens_count}
                color={colors.grayTaupe}
              />
              <StatBox
                title="Nombre de fournisseurs"
                value={statistics.fournisseurs_count}
                color={colors.darkBurgundy}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdministrationDashboard;
