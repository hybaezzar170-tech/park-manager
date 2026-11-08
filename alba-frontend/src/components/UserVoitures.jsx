import React, { useState } from "react";
import FormLocation from "./FormLocation";
import FormVoiture from "./FormVoiture";

const UserVoitures = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState("location");
  
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

  const tabs = [
    { id: "location", label: "Location" },
    { id: "achat", label: "Achat" }
  ];

  const tabStyles = {
    tabContainer: {
      display: "flex",
      marginBottom: "20px",
      borderBottom: `2px solid ${colors.lightGray}`,
      background: colors.background
    },
    tab: (isActive) => ({
      padding: "15px 25px",
      background: isActive ? colors.deepRed : "transparent",
      color: isActive ? "#ffffff" : colors.mediumGray,
      border: "none",
      cursor: "pointer",
      borderRadius: "8px 8px 0 0",
      marginRight: "5px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      fontSize: "14px"
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
            position: "absolute",
            top: "-10px",
            right: "0",
            background: colors.deepRed,
            color: "#ffffff",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = colors.darkBurgundy;
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = colors.deepRed;
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ×
        </button>
        
        <h2 style={{ color: colors.black, marginBottom: "10px", fontSize: "28px", fontWeight: "bold" }}>
          Gestion des Voitures
        </h2>
        <p style={{ color: colors.mediumGray, fontSize: "16px", marginBottom: "0" }}>
          Gérez la location et l'achat de voitures
        </p>
      </div>

      {/* Tabs */}
      <div style={tabStyles.tabContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={tabStyles.tab(activeTab === tab.id)}
            onMouseEnter={e => {
              if (activeTab !== tab.id)
                e.currentTarget.style.background = "rgba(128,12,31,0.1)";
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

      {/* Tab Content */}
      <div style={tabStyles.content}>
        {activeTab === "location" && <FormLocation onClose={onClose} />}
        {activeTab === "achat" && <FormVoiture onClose={onClose} />}
      </div>
    </div>
  );
};

export default UserVoitures;
