import React, { useState } from "react";
import FormLocation from "./FormLocation";
import FormVoiture from "./FormVoiture";

export default function UserVoitures({ onClose }) {
  const colors = {
    black: "#000000",
    mediumGray: "#333333",
    lightGray: "#666666",
    offWhite: "#f5f5f5",
    darkBurgundy: "#3C0007",
    deepRed: "#800C1F",
  };

  const [activeTab, setActiveTab] = useState("location");

  const tabs = [
    { id: "location", label: "Location Voiture" },
    { id: "achat", label: "Achat Voiture" }
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
            position: "absolute",
            top: "0",
            right: "0",
            padding: "10px 20px",
            background: colors.deepRed,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            transition: "all 0.3s ease",
            zIndex: 1000
          }}
        >
          Fermer
        </button>
        
        <div style={{ textAlign: "center" }}>
          <h2 style={{
            fontSize: "36px",
            fontWeight: "800",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: colors.black
          }}>
            Gestion Location & Achat
          </h2>

          <div style={{
            width: "100px",
            height: "4px",
            margin: "10px auto",
            borderRadius: "2px",
            background: "linear-gradient(135deg, rgba(128,12,31,0.9), rgba(60,0,7,0.9))"
          }} />
        </div>
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

      {/* Content */}
      <div style={tabStyles.content}>
        {activeTab === "location" && <FormLocation />}
        {activeTab === "achat" && <FormVoiture />}
      </div>
    </div>
  );
}
