import React, { useState, useEffect } from "react";
function Asvita() {
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

  const [activeTab, setActiveTab] = useState("assurance");
  const [voitures, setVoitures] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [assurances, setAssurances] = useState([]);
  const [visites, setVisites] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [formData, setFormData] = useState({});
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/voitures", {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch voitures");
        return res.json();
      })
      .then(data => {
        setVoitures(data);
      })
      .catch(err => {
        console.error("Erreur voitures:", err);
      });
    fetch("http://127.0.0.1:8000/api/fournisseurs", {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch fournisseurs");
        return res.json();
      })
      .then(data => {
        setFournisseurs(data);
      })
      .catch(err => {
        console.error("Erreur fournisseurs:", err);
      });
    fetch("http://127.0.0.1:8000/api/assurances", {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch assurances");
        return res.json();
      })
      .then(data => {
        setAssurances(data);
      })
      .catch(err => {
        console.error("Erreur assurances:", err);
      });
    fetch("http://127.0.0.1:8000/api/visites", {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch visites");
        return res.json();
      })
      .then(data => {
        setVisites(data);
      })
      .catch(err => {
        console.error("Erreur visites:", err);
      });

    fetch("http://127.0.0.1:8000/api/taxes-circulation", {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch taxes");
        return res.json();
      })
      .then(data => {
        setTaxes(data);
      })
      .catch(err => {
        console.error("Erreur taxes:", err);
      });
  }, []);

  const tabs = [
    { id: "assurance", label: "Assurance" },
    { id: "visite", label: "Visite Circulation" },
    { id: "taxe", label: "Taxe" }
  ];

  const tabStyles = {
    tabContainer: {
      display: "flex",
      gap: "12px",
      marginBottom: "30px",
      background: "transparent",
      padding: "8px",
      borderRadius: "20px"
    },
    tab: (isActive) => ({
      flex: 1,
      padding: "16px 24px",
      border: "none",
      background: isActive 
        ? "linear-gradient(135deg, rgba(128, 12, 31, 0.9) 0%, rgba(60, 0, 7, 0.9) 100%)"
        : "transparent",
      color: isActive ? "#ffffff" : colors.mediumGray,
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
      background: "offWhite",
      minHeight: "500px",
      animation: "fadeIn 0.6s ease-in-out",
      position: "relative"
    }
  };

  const handleFormChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    
    try {
      let url = "";
      let method = "POST";
      
      if (activeTab === "assurance") {
        url = "http://127.0.0.1:8000/api/assurances";
      } else if (activeTab === "visite") {
        url = "http://127.0.0.1:8000/api/visites";
      } else if (activeTab === "taxe") {
        url = "http://127.0.0.1:8000/api/taxes-circulation";
      }
      
      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        await response.json();
        alert("Enregistrement ajouté avec succès!");
        setFormData({});
                try {
          if (activeTab === "assurance") {
            const res = await fetch("http://127.0.0.1:8000/api/assurances", {
              headers: getAuthHeaders()
            });
            const data = await res.json();
            setAssurances(data);
          } else if (activeTab === "visite") {
            const res = await fetch("http://127.0.0.1:8000/api/visites", {
              headers: getAuthHeaders()
            });
            const data = await res.json();
            setVisites(data);
          } else if (activeTab === "taxe") {
            const res = await fetch("http://127.0.0.1:8000/api/taxes-circulation", {
              headers: getAuthHeaders()
            });
            const data = await res.json();
            setTaxes(data);
          }
        } catch (err) {
          console.error("Error refreshing data:", err);
        }
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { message: errorText };
        }
        alert("Erreur lors de l'enregistrement: " + (error.message || JSON.stringify(error)));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Erreur de connexion au serveur: " + err.message);
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
     
      
      {/* Header */}
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
          textTransform: "uppercase"
        }}>
          Gestion Assurances/Visite/Taxe
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
              {tab.id === "assurance"}
              {tab.id === "visite"}
              {tab.id === "taxe"}
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      <div style={tabStyles.contentContainer}>
        <div style={{
          animation: "slideIn 0.5s ease-out"
        }}>
          {activeTab === "assurance" && (
            <div>
              <h3 style={{ color: "black", marginBottom: "20px", fontSize: "24px", fontWeight: "700" }}>Gestion des Assurances</h3>
            
            <form onSubmit={handleFormSubmit} style={{ marginBottom: "25px", padding: "20px", border: `2px solid ${colors.deepRed}`, borderRadius: "8px", background: "white" }}>
              <h4 style={{ color: colors.black, marginBottom: "15px" }}>Ajouter/Modifier Assurance</h4>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Voiture</label>
                <select name="voiture_id" value={formData.voiture_id || ""} onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    backgroundColor: "white",
                    color: colors.black
                  }}
                >
                  <option value="">-- Sélectionner une voiture --</option>
                  {voitures.filter(v => !v.assurance).map(v => <option key={v.id} value={v.id}>{v.matricule} - {v.modele}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Type d'assurance</label>
                <select name="type_assurance" value={formData.type_assurance || ""} onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    backgroundColor: "white",
                    color: colors.black
                  }}
                >
                  <option value="">-- Sélectionner le type --</option>
                  <option value="tous risques">Tous risques</option>
                  <option value="tiers">Tiers</option>
                  <option value="tiers plus">Tiers plus</option>
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Date de début</label>
                <input type="date" name="date_debut" value={formData.date_debut || ""} onChange={handleFormChange} 
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.darkNavy, fontSize: "14px" }}>Date d'expiration</label>
                <input type="date" name="date_expiration" value={formData.date_expiration || ""} onChange={handleFormChange} 
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Fournisseur</label>
                <select name="fournisseur_id" value={formData.fournisseur_id || ""} onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    backgroundColor: "white",
                    color: colors.black
                  }}
                >
                  <option value="">-- Sélectionner un fournisseur --</option>
                  {fournisseurs.filter(f => f.type === 'Assurance').map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Note</label>
                <input type="text" name="note" value={formData.note || ""} onChange={handleFormChange} placeholder="Note" 
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={{ 
                  flex: 1,
                  padding: "12px", 
                  background: `linear-gradient(135deg, ${colors.deepRed}, ${colors.darkBurgundy})`, 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.target.style.transform = "translateY(0)"}
                >Enregistrer</button>
              </div>
            </form>

            {/* Tableau des assurances */}
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              borderRadius: "8px",
              overflow: "hidden", 
              backgroundColor: "white"
            }}>
              <thead style={{ background: colors.mediumGray, color: "#fff" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left" }}>Matricule</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Date Expiration</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Fournisseur</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {voitures.map(v => {
                  const assurance = v.assurance;
                  return (
                    <tr key={v.id} style={{ borderBottom: `1px solid ${colors.lightGray}`, color: colors.black }}>
                      <td style={{ padding: "12px" }}>{v.matricule}</td>
                      <td style={{ padding: "12px" }}>{assurance?.date_expiration || "-"}</td>
                      <td style={{ padding: "12px" }}>{fournisseurs.find(f => f.id === assurance?.fournisseur_id)?.nom || "-"}</td>
                      <td style={{ padding: "12px" }}>{assurance?.note || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "visite" && (
          <div>
            <h3 style={{ color: colors.black, marginBottom: "20px" }}>Gestion des Visites Techniques</h3>
            
            <form onSubmit={handleFormSubmit} style={{ marginBottom: "25px", padding: "20px", border: `2px solid ${colors.deepRed}`, borderRadius: "8px", background: "white" }}>
              <h4 style={{ color: colors.black, marginBottom: "15px" }}>Ajouter/Modifier Visite Technique</h4>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Voiture</label>
                <select name="voiture_id" value={formData.voiture_id || ""} onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    backgroundColor: "white",
                    color: colors.black
                  }}
                >
                  <option value="">-- Sélectionner une voiture --</option>
                  {voitures.filter(v => !v.visite).map(v => <option key={v.id} value={v.id}>{v.matricule} - {v.modele}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Date de visite</label>
                <input type="date" name="date_visite" value={formData.date_visite || ""} onChange={handleFormChange} 
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Prochaine visite</label>
                <input type="date" name="prochaine_visite" value={formData.prochaine_visite || ""} onChange={handleFormChange} 
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Note</label>
                <input type="text" name="note" value={formData.note || ""} onChange={handleFormChange} placeholder="Note" 
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={{ 
                  flex: 1,
                  padding: "12px", 
                  background: `linear-gradient(135deg, ${colors.deepRed}, ${colors.darkBurgundy})`, 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.target.style.transform = "translateY(0)"}
                >Enregistrer</button>
              </div>
            </form>

            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "white"
            }}>
              <thead style={{ background: colors.mediumGray, color: "#fff" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left" }}>Matricule</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Prochaine Visite</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {voitures.map(v => {
                  const visite = v.visite;
                  return (
                    <tr key={v.id} style={{ borderBottom: `1px solid ${colors.lightGray}`, color: colors.black }}>
                      <td style={{ padding: "12px" }}>{v.matricule}</td>
                      <td style={{ padding: "12px" }}>{visite?.prochaine_visite || "-"}</td>
                      <td style={{ padding: "12px" }}>{visite?.note || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "taxe" && (
          <div>
            <h3 style={{ color: colors.black, marginBottom: "20px" }}>Gestion des Taxes de Circulation</h3>
            
            <form onSubmit={handleFormSubmit} style={{ marginBottom: "25px", padding: "20px", border: `2px solid ${colors.deepRed}`, borderRadius: "8px", background: "white" }}>
              <h4 style={{ color: colors.black, marginBottom: "15px" }}>Ajouter/Modifier Taxe de Circulation</h4>
              
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Voiture</label>
                <select name="voiture_id" value={formData.voiture_id || ""} onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    backgroundColor: "white",
                    color: colors.black
                  }}
                >
                  <option value="">-- Sélectionner une voiture --</option>
                  {voitures.filter(v => !v.taxecirculation).map(v => <option key={v.id} value={v.id}>{v.matricule} - {v.modele}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Année</label>
                <input type="number" name="annee" value={formData.annee || ""} onChange={handleFormChange} placeholder="Année" min="2020" max="2030"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Montant</label>
                <input type="number" name="montant" value={formData.montant || ""} onChange={handleFormChange} placeholder="Montant" step="0.01"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.darkNavy, fontSize: "14px" }}>Date d'expiration</label>
                <input type="date" name="date_expiration" value={formData.date_expiration || ""} onChange={handleFormChange} 
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Statut</label>
                <select name="status" value={formData.status || ""} onChange={handleFormChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    backgroundColor: "white",
                    color: colors.black
                  }}
                >
                  <option value="">-- Sélectionner le statut --</option>
                  <option value="payé">payé</option>
                  <option value="non payé">Non payé</option>
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.black, fontSize: "14px" }}>Note</label>
                <input type="text" name="note" value={formData.note || ""} onChange={handleFormChange} placeholder="Note" 
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={{ 
                  flex: 1,
                  padding: "12px", 
                  background: `linear-gradient(135deg, ${colors.deepRed}, ${colors.darkBurgundy})`, 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "6px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.target.style.transform = "translateY(0)"}
                >Enregistrer</button>
              </div>
            </form>

            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "white"
            }}>
              <thead style={{ background: colors.mediumGray, color: "#fff" }}>
                <tr>
                  <th style={{ padding: "12px", textAlign: "left" }}>Matricule</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Date Expiration</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Montant</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Note</th>
                </tr>
              </thead>
              <tbody>
                {voitures.map(v => {
                  const taxe = v.taxecirculation;
                  return (
                    <tr key={v.id} style={{ borderBottom: `1px solid ${colors.lightGray}`, color: colors.black }}>
                      <td style={{ padding: "12px" }}>{v.matricule}</td>
                      <td style={{ padding: "12px" }}>{taxe?.date_expiration || "-"}</td>
                      <td style={{ padding: "12px" }}>{taxe?.montant || "-"}</td>
                      <td style={{ padding: "12px" }}>{taxe?.note || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default Asvita;
