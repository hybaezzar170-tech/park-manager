import React, { useState, useEffect } from "react";
import Maintenance from "./Maintenance";
import Pieces from "./Pieces";
import Reparations from "./Reparations";
import logo from "../assets/whitelogo.png";

function DashboardParametrage({ user, onLogout, onClose }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [statistics, setStatistics] = useState({
    alertes_count: 0,
    active_maintenances_count: 0,
    total_maintenances_count: 0,
    pieces_count: 0,
    reparations_count: 0
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
    grayTaupe: "#929CAA",
    darkNavy: "#2c3e50",
    steelBlue: "#4682B4",
    lightBlue: "#87CEEB",
    orange: "#FF6B35"
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/statistics");
      if (!response.ok) throw new Error("Failed to fetch statistics");
      const data = await response.json();
      console.log("Statistics data received:", data); // Debug log
      setStatistics(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
          style={{
            display: "block",
            width: "100%",
            marginBottom: "12px",
            padding: "14px 18px",
            backgroundColor: selectedModule === "pieces" ? colors.deepRed : "rgba(255, 255, 255, 0.1)",
            color: selectedModule === "pieces" ? "#fff" : colors.grayTaupe,
            border: selectedModule === "pieces" ? `2px solid ${colors.deepRed}` : "2px solid transparent",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 500,
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: selectedModule === "pieces" ? `0 8px 16px rgba(128, 12, 31, 0.3)` : "0 2px 8px rgba(0, 0, 0, 0.1)"
          }}
          onClick={() => setSelectedModule("pieces")}
        >
          Pièces
        </button>

        <button
          style={{
            display: "block",
            width: "100%",
            marginBottom: "12px",
            padding: "14px 18px",
            backgroundColor: selectedModule === "maintenance" ? colors.deepRed : "rgba(255, 255, 255, 0.1)",
            color: selectedModule === "maintenance" ? "#fff" : colors.grayTaupe,
            border: selectedModule === "maintenance" ? `2px solid ${colors.deepRed}` : "2px solid transparent",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 500,
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: selectedModule === "maintenance" ? `0 8px 16px rgba(128, 12, 31, 0.3)` : "0 2px 8px rgba(0, 0, 0, 0.1)"
          }}
          onClick={() => setSelectedModule("maintenance")}
        >
          Maintenance
        </button>

        <button
          style={{
            display: "block",
            width: "100%",
            marginBottom: "12px",
            padding: "14px 18px",
            backgroundColor: selectedModule === "reparations" ? colors.deepRed : "rgba(255, 255, 255, 0.1)",
            color: selectedModule === "reparations" ? "#fff" : colors.grayTaupe,
            border: selectedModule === "reparations" ? `2px solid ${colors.deepRed}` : "2px solid transparent",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: 500,
            transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: selectedModule === "reparations" ? `0 8px 16px rgba(128, 12, 31, 0.3)` : "0 2px 8px rgba(0, 0, 0, 0.1)"
          }}
          onClick={() => setSelectedModule("reparations")}
        >
          Réparations
        </button>
        
        <div style={{ marginTop: "20px" }}></div>
        
        <button
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
          onClick={onLogout}
        >
          Déconnexion
        </button>
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
        
        {selectedModule === "pieces" && <Pieces />}
        {selectedModule === "maintenance" && <Maintenance />}
        {selectedModule === "reparations" && <Reparations />}

        {!selectedModule && (
          <div>
            <h1 style={{ 
              fontSize: "32px", 
              fontWeight: 700, 
              color: colors.darkNavy, 
              marginBottom: "30px",
              letterSpacing: "-0.5px"
            }}>
              Dashbord Paramétrage
            </h1>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "25px",
              marginBottom: "40px"
            }}>
              <StatBox
                title="Nombre de pièces"
                value={statistics.pieces_count}
                color={colors.black}
              />
              <StatBox
                title="Maintenances actives"
                value={statistics.active_maintenances_count}
                color={colors.orange}
              />
              <StatBox
                title="Réparations totales"
                value={statistics.reparations_count}
                color={colors.deepRed}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardParametrage;
