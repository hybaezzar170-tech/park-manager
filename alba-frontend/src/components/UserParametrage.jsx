import React, { useState } from "react";

import Maintenance from "./Maintenance";
import Reparations from "./Reparations";

// Composant simple pour afficher les informations de l'utilisateur connecté
const UserInfo = ({ user }) => {
  const colors = {
    black: "#000000",
    mediumGray: "#333333",
    lightGray: "#666666",
    offWhite: "#f5f5f5",
    darkBurgundy: "#3C0007",
    deepRed: "#800C1F",
    background: "#f5f5f5",
    text: "#333333"
  };

  return (
    <div style={{
      background: colors.background,
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "20px",
      border: `1px solid ${colors.lightGray}`
    }}>
      <h3 style={{ color: colors.black, marginBottom: "10px", fontSize: "16px" }}>
        Informations du Compte
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
        <div>
          <label style={{ color: colors.mediumGray, fontSize: "14px", fontWeight: "500" }}>Email:</label>
          <div style={{
            padding: "10px",
            background: colors.background,
            borderRadius: "4px",
            border: `1px solid ${colors.lightGray}`,
            color: colors.text
          }}>
            {user?.email || 'Non renseigné'}
          </div>
        </div>
        <div>
          <label style={{ color: colors.mediumGray, fontSize: "14px", fontWeight: "500" }}>Nom:</label>
          <div style={{
            padding: "10px",
            background: colors.background,
            borderRadius: "4px",
            border: `1px solid ${colors.lightGray}`,
            color: colors.text
          }}>
            {user?.name || 'Non renseigné'}
          </div>
        </div>
        <div>
          <label style={{ color: colors.mediumGray, fontSize: "14px", fontWeight: "500" }}>Rôle:</label>
          <div style={{
            padding: "10px",
            background: colors.background,
            borderRadius: "4px",
            border: `1px solid ${colors.lightGray}`,
            color: colors.text
          }}>
            {user?.role || 'Non renseigné'}
          </div>
        </div>
        <div>
          <label style={{ color: colors.mediumGray, fontSize: "14px", fontWeight: "500" }}>Téléphone:</label>
          <div style={{
            padding: "10px",
            background: colors.background,
            borderRadius: "4px",
            border: `1px solid ${colors.lightGray}`,
            color: colors.text
          }}>
            {user?.telephone || 'Non renseigné'}
          </div>
        </div>
      </div>
    </div>
  );
};

const UserParametrage = ({ onClose }) => {
  const [userData, setUserData] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const isOuvrier = userData?.role === 'ouvrier';

  const colors = {
    black: "#000000",
    mediumGray: "#333333",
    lightGray: "#666666",
    offWhite: "#f5f5f5",
    darkBurgundy: "#3C0007",
    deepRed: "#800C1F",
  };

  const [activeTab, setActiveTab] = useState("maintenance");

  const tabs = [
    { id: "maintenance", label: "Maintenance" },
    { id: "reparation", label: "Réparation" },
  ];

  const tabStyles = {
    tabContainer: {
      display: "flex",
      gap: "12px",
      marginBottom: "30px",
      padding: "8px",
      borderRadius: "20px"
    },
    tab: (isActive) => ({
      flex: 1,
      padding: "16px 24px",
      border: "none",
      background: isActive
        ? "linear-gradient(135deg, rgba(128,12,31,0.9), rgba(60,0,7,0.9))"
        : "transparent",
      color: isActive ? "#fff" : colors.mediumGray,
      cursor: "pointer",
      fontWeight: "700",
      borderRadius: "16px",
      transition: "0.3s",
      boxShadow: isActive
        ? "0 8px 24px rgba(128,12,31,0.4)"
        : "none",
      textTransform: "uppercase",
      letterSpacing: "1px"
    }),
    content: {
      background: colors.offWhite,
      padding: "30px",
      borderRadius: "12px",
      minHeight: "500px"
    }
  };

  return (
    <div style={{ padding: "40px", background: colors.offWhite, minHeight: "100vh" }}>
      
      {/* Header with close button */}
      <div style={{ position: "relative", marginBottom: "40px" }}>
        <button
          onClick={onClose}
          style={{
        }}
        >
          Fermer
        </button>
      </div>
      
      
      {/* Afficher le contenu seulement si ce n'est pas un ouvrier */}
      {!isOuvrier && (
        <>
          <h2 style={{ color: colors.darkGray, marginBottom: "20px" }}>Paramétrage du Compte</h2>
          
          <div style={tabStyles.tabContainer}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={tabStyles.tab(activeTab === tab.id)}
                onMouseEnter={e => {
                  if (activeTab !== tab.id)
                    e.currentTarget.style.background = "rgba(128,12,31,0.2)";
                }}
                onMouseLeave={e => {
                  if (activeTab !== tab.id)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={tabStyles.content}>
            {activeTab === "maintenance" && <Maintenance />}
            {activeTab === "reparation" && <Reparations />}
          </div>
        </>
      )}
    </div>
  );
};

export default UserParametrage;
