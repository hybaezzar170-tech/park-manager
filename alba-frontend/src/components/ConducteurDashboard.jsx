import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ConducteurDashboard() {
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

  const [conducteur, setConducteur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const conducteurData = localStorage.getItem('conducteur');
    const token = localStorage.getItem('conducteur_token');
    
    if (!conducteurData || !token) {
      navigate('/conducteur/login');
      return;
    }
    try {
      setConducteur(JSON.parse(conducteurData));
    } catch (error) {
      console.error("Erreur de parsing des données conducteur:", error);
      navigate('/conducteur/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  const handleLogout = () => {
    localStorage.removeItem('conducteur');
    localStorage.removeItem('conducteur_token');
    navigate('/conducteur/login');
};
  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.offWhite
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: `4px solid ${colors.lightGray}`,
            borderTop: `4px solid ${colors.deepRed}`,
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <p style={{ color: colors.lightGray, fontSize: "16px" }}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (!conducteur) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: colors.offWhite }}>
      {/* Header */}
      <header style={{
        backgroundColor: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <h1 style={{
              color: colors.deepRed,
              fontSize: "24px",
              fontWeight: "700",
              margin: 0
            }}>
              Dashboard Conducteur
            </h1>
            <span style={{
              backgroundColor: colors.deepRed,
              color: "white",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "600"
            }}>
              {conducteur.nom} {conducteur.prenom}
            </span>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: colors.grayTaupe,
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.3s ease"
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {/* Tabs Navigation */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "24px",
          borderBottom: `2px solid ${colors.lightGray}`,
          paddingBottom: "16px"
        }}>
          {["profile", "missions"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "12px 24px",
                backgroundColor: activeTab === tab ? colors.deepRed : "transparent",
                color: activeTab === tab ? "white" : colors.mediumGray,
                border: activeTab === tab ? "none" : `1px solid ${colors.lightGray}`,
                borderRadius: activeTab === tab ? "8px 8px 0 0" : "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
            >
              {tab === "profile" ? "Mon Profil" : "Mes Missions"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div style={{
            backgroundColor: "white",
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{
              color: colors.darkGray,
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "24px",
              paddingBottom: "16px",
              borderBottom: `1px solid ${colors.lightGray}`
            }}>
              Informations Personnelles
            </h2>
            
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  color: colors.lightGray,
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  marginBottom: "8px"
                }}>
                  Nom
                </label>
                <p style={{
                  color: colors.darkGray,
                  fontSize: "16px",
                  margin: 0,
                  padding: "12px",
                  backgroundColor: colors.offWhite,
                  borderRadius: "8px",
                  border: `1px solid ${colors.lightGray}`
                }}>
                  {conducteur.nom}
                </p>
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: colors.lightGray,
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  marginBottom: "8px"
                }}>
                  Prénom
                </label>
                <p style={{
                  color: colors.darkGray,
                  fontSize: "16px",
                  margin: 0,
                  padding: "12px",
                  backgroundColor: colors.offWhite,
                  borderRadius: "8px",
                  border: `1px solid ${colors.lightGray}`
                }}>
                  {conducteur.prenom}
                </p>
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: colors.lightGray,
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  marginBottom: "8px"
                }}>
                  Email
                </label>
                <p style={{
                  color: colors.darkGray,
                  fontSize: "16px",
                  margin: 0,
                  padding: "12px",
                  backgroundColor: colors.offWhite,
                  borderRadius: "8px",
                  border: `1px solid ${colors.lightGray}`
                }}>
                  {conducteur.email}
                </p>
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: colors.lightGray,
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  marginBottom: "8px"
                }}>
                  Téléphone
                </label>
                <p style={{
                  color: colors.darkGray,
                  fontSize: "16px",
                  margin: 0,
                  padding: "12px",
                  backgroundColor: colors.offWhite,
                  borderRadius: "8px",
                  border: `1px solid ${colors.lightGray}`
                }}>
                  {conducteur.telephone}
                </p>
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: colors.lightGray,
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  marginBottom: "8px"
                }}>
                  Adresse
                </label>
                <p style={{
                  color: colors.darkGray,
                  fontSize: "16px",
                  margin: 0,
                  padding: "12px",
                  backgroundColor: colors.offWhite,
                  borderRadius: "8px",
                  border: `1px solid ${colors.lightGray}`
                }}>
                  {conducteur.adresse}
                </p>
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: colors.lightGray,
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  marginBottom: "8px"
                }}>
                  Ville
                </label>
                <p style={{
                  color: colors.darkGray,
                  fontSize: "16px",
                  margin: 0,
                  padding: "12px",
                  backgroundColor: colors.offWhite,
                  borderRadius: "8px",
                  border: `1px solid ${colors.lightGray}`
                }}>
                  {conducteur.ville}
                </p>
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: colors.lightGray,
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  marginBottom: "8px"
                }}>
                  Numéro de permis
                </label>
                <p style={{
                  color: colors.darkGray,
                  fontSize: "16px",
                  margin: 0,
                  padding: "12px",
                  backgroundColor: colors.offWhite,
                  borderRadius: "8px",
                  border: `1px solid ${colors.lightGray}`
                }}>
                  {conducteur.numero_permis}
                </p>
              </div>

              <div>
                <label style={{
                  display: "block",
                  color: colors.lightGray,
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  marginBottom: "8px"
                }}>
                  Date d'embauche
                </label>
                <p style={{
                  color: colors.darkGray,
                  fontSize: "16px",
                  margin: 0,
                  padding: "12px",
                  backgroundColor: colors.offWhite,
                  borderRadius: "8px",
                  border: `1px solid ${colors.lightGray}`
                }}>
                  {new Date(conducteur.date_embauche).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "missions" && (
          <div style={{
            backgroundColor: "white",
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            textAlign: "center"
          }}>
            <h2 style={{
              color: colors.darkGray,
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "24px"
            }}>
              Mes Missions
            </h2>
            <div style={{
              padding: "40px",
              backgroundColor: colors.offWhite,
              borderRadius: "12px",
              border: `2px dashed ${colors.lightGray}`
            }}>
              <p style={{
                color: colors.lightGray,
                fontSize: "16px",
                margin: "0 0 16px 0"
              }}>
                Aucune mission assignée pour le moment.
              </p>
              <p style={{
                color: colors.mediumGray,
                fontSize: "14px",
                margin: 0
              }}>
                Veuillez consulter régulièrement cette section pour voir vos nouvelles missions.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Animation CSS */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default ConducteurDashboard;
