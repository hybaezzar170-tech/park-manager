import React, { useState, useEffect } from "react";

const Alertes = () => {
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
  
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAlertes();
  };

  const fetchAlertes = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/expiration-alerts", {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error("Failed to fetch alerts");
      const data = await response.json();
      setAlertes(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setAlertes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchAlertes();
  }, [fetchAlertes]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Urgent':
        return colors.deepRed;
      case 'Warning':
        return '#FFA500'; 
      default:
        return colors.steelBlue;
    }
  };
  const getTypeIcon = (category) => {
    switch (category) {
      case 'Assurance':
        return 'A';
      case 'Taxe circulation':
        return 'T';
      case 'Visite technique':
        return 'V';
      default:
        return '!';
    }
  };
  const formatDaysRemaining = (days) => {
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Demain";
    if (days < 0) return `Expiré depuis ${Math.abs(days)} jour(s)`;
    return `Dans ${days} jour(s)`;
  };
  const getVoitureDisplay = (matricule, modele) => {
    if (matricule && modele) {
      return `${matricule} - ${modele}`;
    }
    return matricule || 'Voiture inconnue';
  };
  return (
    <div style={{ padding: "30px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: colors.white, borderRadius: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ color: colors.black, fontSize: "28px", fontWeight: 700 }}>Alertes</h2>
        <button 
          onClick={handleRefresh} 
          style={{ 
            padding: "8px 16px", 
            background: colors.deepRed, 
            color: "white", 
            border: "none", 
            borderRadius: "6px", 
            cursor: "pointer",
            fontSize: "14px",
            transition: "all 0.3s"
          }}
        >
          Actualiser
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: colors.grayTaupe }}>
          <div>Chargement des alertes...</div>
        </div>
      ) : (
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          backgroundColor: "white",
          borderRadius: "12px",
          overflow: "hidden"
        }}>
          <thead style={{ backgroundColor: colors.steelBlue, color: "black" }}>
            <tr>
              <th style={{ padding: "14px", textAlign: "left", fontWeight: 600 }}>Type</th>
              <th style={{ padding: "14px", textAlign: "left", fontWeight: 600 }}>Catégorie</th>
              <th style={{ padding: "14px", textAlign: "left", fontWeight: 600 }}>Voiture</th>
              <th style={{ padding: "14px", textAlign: "left", fontWeight: 600 }}>Message</th>
              <th style={{ padding: "14px", textAlign: "left", fontWeight: 600 }}>Temps restant</th>
              <th style={{ padding: "14px", textAlign: "left", fontWeight: 600 }}>Date d'expiration</th>
            </tr>
          </thead>
          <tbody>
            {alertes.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: colors.grayTaupe, fontSize: "16px" }}>
                   Aucune alerte d'expiration à afficher. Tous les documents sont à jour!
                </td>
              </tr>
            ) : (
              alertes.map(a => (
                <tr key={a.reference_id} style={{ 
                  backgroundColor: a.urgency === 'Urgent' ? '#FFF5F5' : '#FFFAF0', 
                  borderBottom: `1px solid #e0e0e0`,
                  transition: "all 0.3s"
                }}>
                  <td style={{ padding: "14px", color: getTypeColor(a.urgency), fontWeight: "bold" }}>
                    <span style={{ 
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      backgroundColor: getTypeColor(a.urgency) + '20',
                      fontSize: "12px"
                    }}>
                      {a.urgency}
                    </span>
                  </td>
                  <td style={{ padding: "14px", color: colors.darkNavy, fontWeight: 600 }}>
                    {getTypeIcon(a.alert_type)} {a.alert_type}
                  </td>
                  <td style={{ padding: "14px", color: colors.darkNavy }}>
                    {getVoitureDisplay(a.voiture_matricule, a.voiture_modele)}
                  </td>
                  <td style={{ padding: "14px", color: colors.darkNavy }}>{a.message}</td>
                  <td style={{ padding: "14px", color: colors.darkNavy, fontWeight: 600 }}>
                    {formatDaysRemaining(a.days_remaining)}
                  </td>
                  <td style={{ padding: "14px", color: colors.darkNavy }}>
                    {new Date(a.expiration_date).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Alertes;
