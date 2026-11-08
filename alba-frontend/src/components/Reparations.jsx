import React, { useState, useEffect } from "react";

// Fonction pour générer un PDF de la liste
const generatePDF = (reparations, title) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        h1 {
          color: #800C1F;
          text-align: center;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <h1>Liste des Réparations</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Voiture</th>
            <th>Mécanicien</th>
            <th>Statut</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${reparations.map(reparation => `
            <tr>
              <td>${reparation.id}</td>
              <td>${reparation.voiture_matricule || ''}</td>
              <td>${reparation.mecanicien_nom || ''}</td>
              <td>${reparation.statut || ''}</td>
              <td>${reparation.date_reparation || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  printWindow.onload = function() {
    printWindow.print();
    printWindow.close();
  };
};

function Reparations() {
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
    orange: "#FF6B35"
  };
  const [reparations, setReparations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [voitures, setVoitures] = useState([]);
  const [voituresDisponibles, setVoituresDisponibles] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [mecaniciens, setMecaniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    type_reparation: "",
    description: "",
    cout_total: "",
    date_debut: "",
    date_fin: "",
    voiture_id: "",
    mecanicien_id: "",
    statut: "en_attente",
    pieces_utilisees: []
  });
  const typesReparation = [
    "Moteur",
    "Freinage", 
    "Suspension",
    "Électricité",
    "Autre"
  ];

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchReparations(),
          fetchVoitures(),
          fetchPieces(),
          fetchMecaniciens()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, []);

  const fetchReparations = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/reparations");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setReparations(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error("Error fetching reparations:", err);
    }
  };

  const fetchVoitures = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/voitures");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Voitures data:", data);
      console.log("Voitures type:", typeof data);
      console.log("Voitures is array:", Array.isArray(data));
      
      const voituresArray = Array.isArray(data) ? data : (data.data || []);
            const voituresDisponibles = voituresArray.filter(v => 
        v.etat === 'disponible' || v.etat === 'en_maintenance' || v.etat === 'en_reparation'
      );
      
      console.log("Voitures brutes:", voituresArray);
      console.log("Voitures disponibles:", voituresDisponibles);
      console.log("États trouvés:", voituresDisponibles.map(v => v.etat));
      setVoitures(voituresArray);
      setVoituresDisponibles(voituresDisponibles);
    } catch (err) {
      console.error("Error fetching voitures:", err);
    }
  };

  const fetchPieces = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/pieces");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Pieces data:", data);
      console.log("Pieces type:", typeof data);
      console.log("Pieces is array:", Array.isArray(data));
      setPieces(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error("Error fetching pieces:", err);
    }
  };

  const fetchMecaniciens = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/ouvriers");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Ouvriers data:", data);
      console.log("Ouvriers type:", typeof data);
      console.log("Ouvriers is array:", Array.isArray(data));
      const ouvriersArray = Array.isArray(data) ? data : (data.data || []);
      console.log("Ouvriers bruts:", ouvriersArray);
      const mecaniciensFiltres = ouvriersArray.filter(o => {
        const type = (o.type || '').toLowerCase();
        return type.includes('mécanicien') || type.includes('mecanicien') || type.includes('mechanic');
      });
      
      console.log("Mécaniciens filtrés:", mecaniciensFiltres);
      console.log("Types trouvés:", mecaniciensFiltres.map(m => m.type));
      setMecaniciens(mecaniciensFiltres);
    } catch (err) {
      console.error("Error fetching mecaniciens:", err);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing 
      ? `http://localhost:8000/api/reparations/${editingId}`
      : "http://localhost:8000/api/reparations";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(form),
    })
      .then(res => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then(data => {
        console.log("Réparation enregistrée:", data);
                if (isEditing) {
          setReparations(reparations.map(r => r.id === editingId ? data : r));
        } else {
          setReparations([...reparations, data]);
        }
                if (form.pieces_utilisees.length > 0) {
          const updatedPieces = pieces.map(piece => {
            if (form.pieces_utilisees.includes(piece.id)) {
              return {
                ...piece,
                quantite: Math.max(0, (piece.quantite || 0) - 1)
              };
            }
            return piece;
          });
          setPieces(updatedPieces);
          console.log("Quantités de pièces mises à jour localement:", updatedPieces);
                    setTimeout(() => {
            fetchPieces();
            console.log("Rafraîchissement des pièces depuis l'API...");
          }, 500);
        }
        
        setShowModal(false);
        resetForm();
      })
      .catch(err => {
        console.error("API Error:", err);
        alert("Erreur serveur");
      });
  };

  const handleEdit = reparation => {
    setForm({
      description: reparation.description || "",
      cout_total: reparation.cout_total || "",
      date_reparation: reparation.date_reparation || "",
      voiture_id: reparation.voiture_id || "",
      mecanicien_id: reparation.mecanicien_id || "",
      statut: reparation.statut || "en_attente",
      pieces_utilisees: reparation.pieces_utilisees || []
    });
    setIsEditing(true);
    setEditingId(reparation.id);
    setShowModal(true);
  };

  const handleDelete = id => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette réparation ?")) return;

    fetch(`http://localhost:8000/api/reparations/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        setReparations(reparations.filter(r => r.id !== id));
                setTimeout(() => {
          fetchPieces();
          console.log("Rafraîchissement des pièces après suppression...");
        }, 500);
      })
      .catch(err => console.error(err));
  };

  const resetForm = () => {
    setForm({
      type_reparation: "",
      description: "",
      cout_total: "",
      date_debut: "",
      date_fin: "",
      voiture_id: "",
      mecanicien_id: "",
      statut: "en_attente",
      pieces_utilisees: []
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handlePieceToggle = (pieceId) => {
    console.log("Toggle piece:", pieceId, "Current pieces:", form.pieces_utilisees);
    const currentPieces = [...form.pieces_utilisees];
    const index = currentPieces.indexOf(pieceId);
    
    if (index > -1) {
      currentPieces.splice(index, 1);
    } else {
      currentPieces.push(pieceId);
    }
    
    console.log("New pieces array:", currentPieces);
    setForm({ ...form, pieces_utilisees: currentPieces });
  };

  return (
    <div style={{ padding: "20px", backgroundColor: colors.White }}>
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p style={{ color: colors.darkGray, fontSize: "16px" }}>Chargement des données...</p>
        </div>
      ) : (
        <>
          <div style={{ 
            marginBottom: "15px"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "15px"
            }}>
              <h2 style={{ 
                color: colors.darkGray, 
                fontSize: "28px", 
                fontWeight: "700",
                margin: 0
              }}>
                Gestion des Réparations
              </h2>
              <button 
                onClick={() => generatePDF(reparations, "Liste des Réparations")}
                style={{
                  padding: "12px 24px",
                  backgroundColor: colors.mediumGray,
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s"
                }}
              >
                PDF
              </button>
            </div>
          </div>

          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          }}>
            <h3 style={{ 
              color: colors.darkGray, 
              marginBottom: "20px", 
              fontSize: "20px", 
              fontWeight: "600" 
            }}>
              Voitures Disponibles 
            </h3>
              <div style={{ display: "grid", gap: "15px" }}>
                {voituresDisponibles.map(voiture => (
                  <div key={voiture.id} style={{
                    border: `1px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    padding: "20px",
                    backgroundColor: "#fafafa",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        color: colors.darkGray, 
                        margin: "0 0 10px 0",
                        fontSize: "16px",
                        fontWeight: "600"
                      }}>
                        {voiture.matricule} - {voiture.modele}
                      </h4>
                      <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: colors.mediumGray }}>
                        <span>Marque: {voiture.marque}</span>
                        <span>Carburant: {voiture.carburant}</span>
                        {voiture.conducteur && <span>Conducteur: {voiture.conducteur.nom} {voiture.conducteur.prenom}</span>}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setForm({
                          voiture_id: voiture.id,
                          type_reparation: "",
                          description: "",
                          cout_total: "",
                          date_debut: "",
                          date_fin: "",
                          mecanicien_id: "",
                          statut: "en_attente",
                          pieces_utilisees: []
                        });
                        setShowModal(true);
                      }}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: colors.deepRed,
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500",
                        transition: "all 0.3s",
                        whiteSpace: "nowrap"
                      }}
                    >
                   Réparation
                    </button>
                  </div>
                ))}
              </div>
          </div>
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}>
              <h3 style={{ 
                color: colors.darkGray, 
                marginBottom: "20px", 
                fontSize: "20px", 
                fontWeight: "600" 
              }}>
                Réparations en Cours 
              </h3>

              <table style={{ 
                width: "100%", 
                borderCollapse: "collapse", 
                backgroundColor: "#ffffff",
                borderRadius: "12px", 
                overflow: "hidden", 
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "1px solid #f0f0f0"
              }}>
                <thead style={{ 
                  backgroundColor: "#f8fafc", 
                  borderBottom: "2px solid #e2e8f0"
                }}>
                  <tr>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      fontSize: "13px",
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>ID</th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      fontSize: "13px",
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Type</th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      fontSize: "13px",
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Description</th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      fontSize: "13px",
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Coût</th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      fontSize: "13px",
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Statut</th>
                    <th style={{ 
                      padding: "16px 12px", 
                      textAlign: "left", 
                      fontWeight: "600",
                      fontSize: "13px",
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reparations.map((r, index) => (
                    <tr key={r.id} style={{ 
                      borderBottom: `1px solid ${index === reparations.length - 1 ? "transparent" : "#f1f5f9"}`,
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafbfc",
                      transition: "all 0.2s ease"
                    }}>
                      <td style={{ 
                        padding: "16px 12px", 
                        color: "#000000ff",
                        fontWeight: "500",
                        fontSize: "14px"
                      }}>{r.id}</td>
                      <td style={{ padding: "16px 12px" }}>
                        <span style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          color:colors.black,
                        }}>
                          {r.type_reparation || '-'}
                        </span>
                      </td>
                      <td style={{ 
                        padding: "16px 12px", 
                        color: "black",
                        fontWeight: "500",
                        fontSize: "14px"
                      }}>{r.description}</td>
                      <td style={{ 
                        padding: "16px 12px", 
                        color: "black",
                        fontWeight: "500",
                        fontSize: "14px"
                      }}>{r.cout_total ? `${r.cout_total}` : '-'}</td>
                      <td style={{ padding: "16px 12px" }}>
                        <span style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#fff",
                          backgroundColor: r.statut === 'terminee' ? '#22c55e' : 
                                         r.statut === 'en_cours' ? '#f59e0b' : '#6b7280'
                        }}>
                          {r.statut === 'terminee' ? 'Terminée' : 
                           r.statut === 'en_cours' ? 'En cours' : 'En attente'}
                        </span>
                      </td>
                      <td style={{ padding: "16px 12px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button 
                            onClick={() => handleEdit(r)} 
                            style={{ 
                              padding: "8px 12px", 
                              background: colors.deepRed, 
                              color: "white", 
                              border: "none", 
                              borderRadius: "6px", 
                              cursor: "pointer", 
                              fontSize: "12px", 
                              fontWeight: "500",
                              transition: "all 0.2s ease",
                              boxShadow: "0 2px 4px rgba(70, 130, 180, 0.2)"
                            }}
                            onMouseOver={(e) => e.target.style.background = colors.deepRed}
                            onMouseOut={(e) => e.target.style.background = colors.deepRed}
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => handleDelete(r.id)} 
                            style={{ 
                              padding: "8px 12px", 
                              background: colors.black, 
                              color: "white", 
                              border: "none", 
                              borderRadius: "6px", 
                              cursor: "pointer", 
                              fontSize: "12px", 
                              fontWeight: "500",
                              transition: "all 0.2s ease",
                              boxShadow: "0 2px 4px rgba(128, 12, 31, 0.2)"
                            }}
                            onMouseOver={(e) => e.target.style.background = colors.darkBurgundy}
                            onMouseOut={(e) => e.target.style.background = colors.deepRed}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          {showModal && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000
              }}
            >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "30px",
              width: "90%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
            }}
          >
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <h3 style={{ 
                color: colors.darkGray, 
                margin: 0, 
                fontSize: "20px", 
                fontWeight: "600" 
              }}>
                {isEditing ? "Modifier la Réparation" : "Ajouter une Réparation"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: colors.lightGray
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Type de réparation</label>
                <select
                  name="type_reparation"
                  value={form.type_reparation}
                  onChange={handleChange}
                  style={{
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightBlue}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    backgroundColor: "#fff",
                    cursor: "pointer"
                  }}
                >
                  <option value="">Sélectionner un type...</option>
                  {typesReparation.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Description *</label>
                <textarea
                  placeholder="Description de la réparation"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  style={{
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightBlue}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Date Début *</label>
                  <input
                    type="date"
                    name="date_debut"
                    value={form.date_debut}
                    onChange={handleChange}
                    required
                    style={{ 
                      padding: "10px 12px", 
                      border: `2px solid ${colors.lightBlue}`, 
                      borderRadius: "8px", 
                      fontSize: "14px", 
                      fontFamily: "inherit" 
                    }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Date Fin</label>
                  <input
                    type="date"
                    name="date_fin"
                    value={form.date_fin}
                    onChange={handleChange}
                    min={form.date_debut}
                    style={{ 
                      padding: "10px 12px", 
                      border: `2px solid ${colors.lightBlue}`, 
                      borderRadius: "8px", 
                      fontSize: "14px", 
                      fontFamily: "inherit" 
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Coût Total</label>
                  <input
                    type="number"
                    placeholder="Coût total"
                    name="cout_total"
                    value={form.cout_total}
                    onChange={handleChange}
                    style={{ 
                      padding: "10px 12px", 
                      border: `2px solid ${colors.lightBlue}`, 
                      borderRadius: "8px", 
                      fontSize: "14px", 
                      fontFamily: "inherit" 
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Voiture</label>
                  <select
                    name="voiture_id"
                    value={form.voiture_id}
                    onChange={handleChange}
                    style={{ 
                      padding: "10px 12px", 
                      border: `2px solid ${colors.lightBlue}`, 
                      borderRadius: "8px", 
                      fontSize: "14px", 
                      fontFamily: "inherit", 
                      cursor: "pointer", 
                      backgroundColor: "#fff", 
                      color: colors.darkGray 
                    }}
                  >
                    <option value="">Sélectionner une voiture...</option>
                    {voitures && voitures.length > 0 ? voitures.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.marque} {v.modele} ({v.immatriculation || 'N/A'})
                      </option>
                    )) : <option value="">Aucune voiture disponible</option>}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Mécanicien</label>
                  <select
                    name="mecanicien_id"
                    value={form.mecanicien_id}
                    onChange={handleChange}
                    style={{ 
                      padding: "10px 12px", 
                      border: `2px solid ${colors.lightBlue}`, 
                      borderRadius: "8px", 
                      fontSize: "14px", 
                      fontFamily: "inherit", 
                      cursor: "pointer", 
                      backgroundColor: "#fff", 
                      color: colors.darkGray 
                    }}
                  >
                    <option value="">Sélectionner un mécanicien...</option>
                    {mecaniciens && mecaniciens.length > 0 ? mecaniciens.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.nom} {m.prenom}
                      </option>
                    )) : <option value="">Aucun mécanicien disponible</option>}
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Statut</label>
                <select
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                  style={{ 
                    padding: "10px 12px", 
                    border: `2px solid ${colors.lightBlue}`, 
                    borderRadius: "8px", 
                    fontSize: "14px", 
                    fontFamily: "inherit", 
                    cursor: "pointer", 
                    backgroundColor: "#fff", 
                    color: colors.darkGray 
                  }}
                >
                  <option value="en_attente">En attente</option>
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ color: colors.darkGray, fontSize: "14px", fontWeight: "500" }}>Pièces utilisées</label>
                <div style={{ 
                  border: `2px solid ${colors.lightBlue}`, 
                  borderRadius: "8px", 
                  padding: "10px", 
                  maxHeight: "150px", 
                  overflowY: "auto",
                  backgroundColor: "#fff"
                }}>
                  {pieces && pieces.length > 0 ? (
                    pieces.map(piece => (
                      <div key={piece.id} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                        <input
                          type="checkbox"
                          id={`piece-${piece.id}`}
                          checked={form.pieces_utilisees.includes(piece.id)}
                          onChange={() => handlePieceToggle(piece.id)}
                          style={{ marginRight: "10px" }}
                        />
                        <label htmlFor={`piece-${piece.id}`} style={{ 
                          color: colors.darkGray, 
                          fontSize: "14px", 
                          cursor: "pointer",
                          flex: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <span>{piece.nom} - {piece.modele}</span>
                          <span style={{
                            fontSize: "12px",
                            fontWeight: "600",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            backgroundColor: (piece.quantite || 0) > 10 ? "#e8f5e8" : 
                                             (piece.quantite || 0) > 5 ? "#fff3cd" : 
                                             (piece.quantite || 0) > 0 ? "#f8d7da" : "#6c757d",
                            color: (piece.quantite || 0) > 10 ? "#155724" : 
                                   (piece.quantite || 0) > 5 ? "#856404" : 
                                   (piece.quantite || 0) > 0 ? "#721c24" : "#fff",
                            border: `1px solid ${
                              (piece.quantite || 0) > 10 ? "#c3e6cb" : 
                              (piece.quantite || 0) > 5 ? "#ffeaa7" : 
                              (piece.quantite || 0) > 0 ? "#f5c6cb" : "#495057"
                            }`
                          }}>
                            Stock: {piece.quantite || 0}
                          </span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: colors.grayTaupe, fontSize: "14px", textAlign: "center" }}>
                      Aucune pièce disponible
                    </div>
                  )}
                </div>
                {form.pieces_utilisees.length > 0 && (
                  <div style={{ marginTop: "5px", fontSize: "12px", color: colors.darkGray }}>
                    {form.pieces_utilisees.length} pièce(s) sélectionnée(s)
                  </div>
                )}
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                marginTop: "20px"
              }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "12px",
                    backgroundColor: colors.black,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  {isEditing ? "Modifier" : "Ajouter"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: colors.grayTaupe,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Reparations;
