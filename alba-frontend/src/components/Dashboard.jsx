import React, { useState, useEffect } from "react";
import GestionDepartement from "./GestionDepartement";
import GestionConducteur from "./GestionConducteur";
import GestionVoitures from "./GestionVoitures";
import TransactionVoiture from "./TransactionVoiture";
import Asvita from "./Asvita";
import logo from "../assets/whitelogo.png";

function Dashboard({ user, onLogout, onClose }) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [statistics, setStatistics] = useState({
    conducteurs_count: 0,
    departements_count: 0,
    voitures_count: 0,
    voitures_en_location_count: 0,
    voitures_vendues_count: 0,
    active_maintenances_count: 0,
    total_maintenances_count: 0
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
    lightBlue: "#4A90E2",
    steelBlue: "#4682B4",
    darkNavy: "#1a2332"
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
            // window.location.reload(); // Supprimé - pas de redirection automatique
            return;
          }
          throw new Error("Failed to fetch statistics");
        }
        
        const data = await response.json();
        console.log("Statistics data received:", data); // Debug log
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

  const sidebarButtonStyle = (isActive) => ({
    display: "block",
    width: "100%",
    marginBottom: "12px",
    padding: "14px 18px",
    backgroundColor: isActive ? colors.deepRed : "rgba(255, 255, 255, 0.1)",
    color: isActive ? "#fff" : colors.grayTaupe,
    border: isActive ? `2px solid ${colors.deepRed}` : `2px solid transparent`,
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: isActive ? 600 : 500,
    fontSize: "15px",
    textAlign: "left",
    transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: isActive ? `0 8px 16px rgba(128, 12, 31, 0.3)` : "0 2px 8px rgba(0, 0, 0, 0.1)",
    letterSpacing: "0.3px",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: colors.black }}>
      <div style={{ 
        width: "280px", 
        background: colors.black,
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#fff", 
        padding: "40px 25px",
        boxShadow: `8px 0 24px rgba(0, 0, 0, 0.3)`,
        overflowY: "auto",
        position: "sticky",
        top: 0,
        height: "100vh"
      }}>
       <div style={{ textAlign: "center" }}>
  <img 
    src={logo} 
    alt="AutoPark Logo" 
    style={{ height: "200px", marginBottom: "10px" }} 
  />
  <div 
    style={{ 
      width: "60px", 
      height: "3px", 
      background: `linear-gradient(90deg, ${colors.lightBlue}, ${colors.steelBlue})`, 
      margin: "6px auto" 
    }} 
  ></div>
</div>

        <button style={{...sidebarButtonStyle(selectedModule === "departement")}} onClick={() => setSelectedModule("departement")}>
          Department
        </button>
        <button style={{...sidebarButtonStyle(selectedModule === "conducteur")}} onClick={() => setSelectedModule("conducteur")}>
          Conducteur
        </button>
        <button style={{...sidebarButtonStyle(selectedModule === "voiture")}} onClick={() => setSelectedModule("voiture")}>
          Voiture
        </button>
        <button style={{...sidebarButtonStyle(selectedModule === "transaction")}} onClick={() => setSelectedModule("transaction")}>
          Contrats </button>
        <button style={{...sidebarButtonStyle(selectedModule === "asvita")}} onClick={() => setSelectedModule("asvita")}>
Documents des voitures
        </button>
        
        <div style={{ marginTop: "20px" }}></div>
        
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
      <div style={{ flexGrow: 1, padding: "40px 50px", backgroundColor: "#f5f5f5", overflowY: "auto", position: "relative" }}>
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
        
        {selectedModule === "departement" && <GestionDepartement />}
        {selectedModule === "conducteur" && <GestionConducteur />}
        {selectedModule === "voiture" && <GestionVoitures />}
        {selectedModule === "transaction" && <TransactionVoiture />}
        {selectedModule === "asvita" && <Asvita />}

        {!selectedModule && (
          <div>
            <h1 style={{ 
              fontSize: "36px", 
              fontWeight: 700, 
              color: colors.darkNavy, 
              marginBottom: "30px",
              letterSpacing: "-0.5px"
            }}>
Voitures             </h1>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "25px",
              marginBottom: "40px"
            }}>
              <StatBox
                title="Nombre de conducteurs"
                value={statistics.conducteurs_count}
                color={colors.black}
              />
              <StatBox
                title="Nombre de départements"
                value={statistics.departements_count}
                color={colors.deepRed}
              />
              <StatBox
                title="Nombre de voitures"
                value={statistics.voitures_count}
                color={colors.mediumGray}
              />
              <StatBox
                title="Voitures en location"
                value={statistics.voitures_en_location_count}
                color={colors.darkBurgundy}
              />
              <StatBox
                title="Voitures vendues"
                value={statistics.voitures_vendues_count}
                color={colors.grayTaupe}
              />
  
             
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
