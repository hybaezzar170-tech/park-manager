import React, { useState } from "react";
import FormVente from "./FormVente";
import FormLocation from "./FormLocation";
import FormVoiture from "./FormVoiture";

export default function TransactionVoiture() {
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

  const [activeTab, setActiveTab] = useState("vente");

  const tabs = [
    { id: "vente", label: "Vente"},
    { id: "location", label: "Location" },
    { id: "achat", label: "Achat" }
  ];

  const tabStyles = {
    tabContainer: {
      display: "flex",
      gap: "12px",
      marginBottom: "30px",
      background: "transparent",
      backdropFilter: "blur(20px)",
      padding: "8px",
      borderRadius: "20px",
    },
    tab: (isActive) => ({
      flex: 1,
      padding: "16px 24px",
      border: "none",
      background: isActive 
        ? "linear-gradient(135deg, rgba(128, 12, 31, 0.9) 0%, rgba(60, 0, 7, 0.9) 100%)"
        : "transparent",
      color: isActive ? "#ffffff" : colors.black,
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: isActive ? "700" : "500",
      borderRadius: "16px",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: isActive 
        ? "0 8px 24px rgba(128, 12, 31, 0.4), 0 0 40px rgba(128, 12, 31, 0.2)"
        : "none",
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      position: "relative",
      overflow: "hidden"
    }),
    contentContainer: {
      padding: "40px",
      background: "#f5f5f5",
      backdropFilter: "blur(20px)",
      borderRadius: "0 20px 20px 20px",
      minHeight: "500px",
      animation: "fadeIn 0.6s ease-in-out",
      position: "relative"
    }
  };

  return (
    <div style={{ 
      padding: "40px", 
      maxWidth: "1200px", 
      backgroundColor: colors.offWhite, 
      minHeight: "100vh",
      position: "relative",
      overflow: "hidden"

}}>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(128, 12, 31, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(128, 12, 31, 0.6);
          }
        }
        .tab-active {
          animation: glow 3s ease-in-out infinite;
        }
      `}</style>
            <div style={{
        textAlign: "center",
        marginBottom: "40px",
        position: "relative",
        zIndex: 10
      }}>
        <h2 style={{ 
          color: "#000000ff",
          marginBottom: "15px", 
          fontSize: "36px", 
          fontWeight: "800",
          letterSpacing: "2px",
          textTransform: "uppercase",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}>
          Gestion Achat/Vente/Location
        </h2>
        <div style={{
          width: "100px",
          height: "4px",
          background: "linear-gradient(135deg, rgba(128, 12, 31, 0.9) 0%, rgba(60, 0, 7, 0.9) 100%)",
          margin: "0 auto",
          borderRadius: "2px",
          boxShadow: "0 2px 8px rgba(128, 12, 31, 0.4)"
        }}></div>
      </div>  
      <div style={tabStyles.tabContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              ...tabStyles.tab(activeTab === tab.id),
              ...(activeTab === tab.id ? { className: "tab-active" } : {})
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.background = "rgba(128, 12, 31, 0.2)";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.target.style.background = "transparent";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            <span style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}>
              {tab.id === "vente"}
              {tab.id === "location"}
              {tab.id === "achat"}
              {tab.label}
            </span>
          </button>
        ))}
      </div>
      <div style={tabStyles.contentContainer}>
        <div style={{
          animation: "slideIn 0.5s ease-out"
        }}>
          {activeTab === "vente" && <FormVente />}
          {activeTab === "location" && <FormLocation />}
          {activeTab === "achat" && <FormVoiture />}
        </div>
      </div>
    </div>
  );
}
