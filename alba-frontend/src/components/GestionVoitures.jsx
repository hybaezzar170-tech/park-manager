import React, { useState, useEffect } from "react";

// Fonction pour générer un PDF de la liste
const generatePDF = (voitures, title) => {
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
      <h1>Liste des Voitures</h1>
      <table>
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Modèle</th>
            <th>Marque</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          ${voitures.map(voiture => `
            <tr>
              <td>${voiture.matricule || ''}</td>
              <td>${voiture.modele || ''}</td>
              <td>${voiture.marque || ''}</td>
              <td>${voiture.etat?.replace('_', ' ').toUpperCase() || ''}</td>
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

function GestionVoitures() {
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

  const [voitures, setVoitures] = useState([]);
  const [filteredVoitures, setFilteredVoitures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVoiture, setSelectedVoiture] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [departements, setDepartements] = useState([]);
  const [form, setForm] = useState({
    matricule: "",
    modele: "",
    marque: "",
    couleur: "",
    carburant: "",
    etat: "disponible",
    departement_id: "",
    type: ""
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/voitures?all=true")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVoitures(data);
          setFilteredVoitures(data);
        } else if (data && Array.isArray(data.data)) {
          setVoitures(data.data);
          setFilteredVoitures(data.data);
        } else {
          setVoitures([]);
          setFilteredVoitures([]);
        }
      })
      .catch(err => {
        console.error("Error fetching voitures:", err);
        setVoitures([]);
        setFilteredVoitures([]);
      });

    // Charger les départements
    fetch("http://localhost:8000/api/departements")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDepartements(data);
        } else if (data && Array.isArray(data.data)) {
          setDepartements(data.data);
        } else {
          setDepartements([]);
        }
      })
      .catch(err => {
        console.error("Error fetching departements:", err);
        setDepartements([]);
      });
  }, []);

  const handleDepartementChange = (e) => {
    const departementId = e.target.value;
    setForm(prevForm => {
      const updatedForm = { ...prevForm, departement_id: departementId };
      
      // Définir automatiquement le type selon le département
      const selectedDept = departements.find(dept => dept.id == departementId);
      if (selectedDept) {
        updatedForm.type = selectedDept.nom.toLowerCase().includes('transport') ? 'transport' : 
                       selectedDept.nom.toLowerCase().includes('livraison') ? 'livraison' :
                       selectedDept.nom.toLowerCase().includes('administratif') ? 'administratif' :
                       'standard';
      }
      
      return updatedForm;
    });
  };

  useEffect(() => {
    const filtered = voitures.filter(voiture =>
      voiture.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voiture.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voiture.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (voiture.type && voiture.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (voiture.carburant && voiture.carburant.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (voiture.departement?.nom && voiture.departement.nom.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredVoitures(filtered);
  }, [searchTerm, voitures]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = voiture => {
    setForm({
      matricule: voiture.matricule || "",
      modele: voiture.modele || "",
      marque: voiture.marque || "",
      couleur: voiture.couleur || "",
      etat: voiture.etat || ""
    });
    setIsEditing(true);
    setEditingId(voiture.id);
    setShowModal(true);
  };

  const handleToggleEtat = voiture => {
    const etat = voiture.etat === "disponible" ? "en_maintenance" : "disponible";
    fetch(`http://localhost:8000/api/voitures/${voiture.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", 
      },
      body: JSON.stringify({ etat }),
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
      })
      .then(data => {
        setVoitures(
          voitures.map(v => (v.id === voiture.id ? data.data : v))
        );
        setFilteredVoitures(
          filteredVoitures.map(v => (v.id === voiture.id ? data.data : v))
        );
        alert("État de la voiture modifié avec succès ");
      })
      .catch(err => {
        console.error("API Error:", err);
        alert("Erreur serveur ");
      });
  };

  const handleViewDetails = async (voiture) => {
    try {
      // Récupérer les détails complets de la voiture depuis l'API Laravel
      const response = await fetch(`http://localhost:8000/api/voitures/${voiture.id}/details`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }
      
      const details = await response.json();
      
      // Utiliser uniquement les données réelles de la base
      setSelectedVoiture(details);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails:", error);
      
      // Afficher un message d'erreur plus détaillé
      alert(`Erreur lors de la récupération des détails: ${error.message}`);
      
      // En cas d'erreur, utiliser les données de base de la voiture
      setSelectedVoiture(voiture);
      setShowDetailsModal(true);
    }
  };

  const handleDesactiver = async (voitureId) => {
    if (window.confirm("Êtes-vous sûr de vouloir désactiver cette voiture ?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/voitures/${voitureId}/desactiver`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          alert("Voiture désactivée avec succès");
          // Recharger la liste des voitures
          fetch("http://localhost:8000/api/voitures?all=true")
            .then(res => res.json())
            .then(data => {
              if (Array.isArray(data)) {
                setVoitures(data);
                setFilteredVoitures(data);
              } else if (data && Array.isArray(data.data)) {
                setVoitures(data.data);
                setFilteredVoitures(data.data);
              }
            });
        } else {
          alert("Erreur lors de la désactivation de la voiture");
        }
      } catch (error) {
        console.error("Erreur lors de la désactivation:", error);
        alert("Erreur lors de la désactivation de la voiture");
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:8000/api/voitures/${editingId}`
      : "http://localhost:8000/api/voitures";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json", 
      },
      body: JSON.stringify(form),
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
      })
      .then(data => {
        if (isEditing) {
          setVoitures(
            voitures.map(v => (v.id === editingId ? data.data : v))
          );
          setFilteredVoitures(
            filteredVoitures.map(v => (v.id === editingId ? data.data : v))
          );
          alert("Voiture modifiée avec succès ");
        } else {
          setVoitures([...voitures, data.data]);
          setFilteredVoitures([...filteredVoitures, data.data]);
          alert("Voiture ajoutée avec succès ");
        }

        setShowModal(false);
        setForm({ 
                    matricule: "", 
                    modele: "", 
                    marque: "", 
                    couleur: "", 
                    carburant: "",
                    etat: "disponible",
                    departement_id: "",
                    type: ""
                  });
        setIsEditing(false);
        setEditingId(null);
      })
      .catch(err => {
        console.error("API Error:", err);
        alert("Erreur serveur ");
      });
  };

  return (
    <div style={{ padding: "20px", backgroundColor: colors.offWhite }}>
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{
          fontSize: "32px",
          fontWeight: "700",
          margin: "0 0 10px 0",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "2px",
          background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text"
        }}>
          Catalogue Voitures
        </h1>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Rechercher par matricule, modèle ou marque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "12px 16px",
              border: `2px solid ${colors.lightGray}`,
              borderRadius: "8px",
              fontSize: "14px",
              width: "300px",
              fontFamily: "inherit",
              transition: "all 0.3s ease",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = colors.deepRed}
            onBlur={(e) => e.target.style.borderColor = colors.lightGray}
          />
          <button 
            onClick={() => generatePDF(filteredVoitures, "Liste des Voitures")}
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
      <table style={{ 
        width: "100%", 
        marginTop: "20px", 
        borderCollapse: "collapse", 
        backgroundColor: "white",
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
            {["Matricule","Département","Conducteur","État","Actions"].map(col => (
              <th key={col} style={{ 
                padding: "16px 12px", 
                textAlign: "left", 
                fontWeight: "600",
                fontSize: "13px",
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!Array.isArray(filteredVoitures) ? (
            <tr>
              <td colSpan="8" style={{ 
                textAlign: "center", 
                color: "#94a3b8", 
                padding: "40px 20px",
                fontSize: "14px",
                backgroundColor: "#fafbfc"
              }}>
                Erreur de chargement des voitures
              </td>
            </tr>
          ) : filteredVoitures.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ 
                textAlign: "center", 
                color: "#94a3b8", 
                padding: "40px 20px",
                fontSize: "14px",
                backgroundColor: "#fafbfc"
              }}>
                {searchTerm ? "Aucune voiture trouvée pour cette recherche" : "Aucune voiture disponible"}
              </td>
            </tr>
          ) : (
            filteredVoitures.map((v, index) => (
              <tr key={v.id} style={{ 
                borderBottom: `1px solid ${index === filteredVoitures.length - 1 ? "transparent" : "white"}`,
                backgroundColor: index % 2 === 0 ? "#ffffff" : "white",
                transition: "all 0.2s ease"
              }}>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{v.matricule}</td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{v.departement?.nom || '-'}</td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{v.conducteur?.nom || '-'}</td>
                <td style={{ padding: "16px 12px" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: 
                      v.etat === 'disponible' ? "#dcfce7" :
                      v.etat === 'en_location' ? "#fee2e2" :
                      v.etat === 'vendue' ? "#e5e7eb" :
                      v.etat === 'en_maintenance' ? "#fef3c7" :
                      "#f3f4f6",
                    color: 
                      v.etat === 'disponible' ? "#166534" :
                      v.etat === 'en_location' ? "#991b1b" :
                      v.etat === 'vendue' ? "#374151" :
                      v.etat === 'en_maintenance' ? "#92400e" :
                      "#6b7280"
                  }}>
                    {v.etat?.replace('_', ' ').toUpperCase() || 'INCONNU'}
                  </span>
                </td>
                <td style={{ padding: "16px 12px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => handleViewDetails(v)}
                      style={{
                        padding: "10px 16px",
                        background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`,
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 12px rgba(128, 12, 31, 0.3)"
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 16px rgba(128, 12, 31, 0.4)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 4px 12px rgba(128, 12, 31, 0.3)";
                      }}
                    >
                      Voir Détails
                    </button>
                    <button 
                      onClick={() => handleDesactiver(v.id)}
                      style={{
                        padding: "10px 16px",
                        background: colors.grayTaupe,
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.3)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
                      }}
                    >
                      Désactiver
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundColor: "rgba(32, 45, 54, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            width: "450px",
            boxShadow: `0 10px 40px rgba(32, 45, 54, 0.3)`,
            border: `2px solid ${colors.lightGray}`
          }}>
            <h3 style={{ color: colors.darkGray, marginBottom: "20px", fontSize: "20px", fontWeight: 700 }}>{isEditing ? "Modifier Voiture" : "Ajouter Voiture"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
              <input
                name="matricule"
                placeholder="Matricule"
                value={form.matricule}
                onChange={handleChange}
                required
                style={{ padding: "10px 15px", border: `2px solid ${colors.lightGray}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              <input
                name="modele"
                placeholder="Modèle"
                value={form.modele}
                onChange={handleChange}
                required
                style={{ padding: "10px 15px", border: `2px solid ${colors.lightGray}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              <input
                name="marque"
                placeholder="Marque"
                value={form.marque}
                onChange={handleChange}
                required
                style={{ padding: "10px 15px", border: `2px solid ${colors.lightGray}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              <input
                name="couleur"
                placeholder="Couleur"
                value={form.couleur}
                onChange={handleChange}
                required
                style={{ padding: "10px 15px", border: `2px solid ${colors.lightGray}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              
              <select
                name="carburant"
                value={form.carburant}
                onChange={handleChange}
                required
                style={{
                  padding: "10px 15px",
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  backgroundColor: "#fff",
                  color: colors.black,
                  cursor: "pointer"
                }}
              >
                <option value="">Sélectionner le carburant...</option>
                <option value="essence">Essence</option>
                <option value="diesel">Diesel</option>
                <option value="hybride">Hybride</option>
                <option value="electrique">Électrique</option>
                <option value="gpl">GPL</option>
                <option value="gaz">Gaz</option>
              </select>

              <select
                name="departement_id"
                value={form.departement_id}
                onChange={handleDepartementChange}
                required
                style={{
                  padding: "10px 15px",
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  backgroundColor: "#fff",
                  color: colors.black,
                  cursor: "pointer"
                }}
              >
                <option value="">Sélectionner un département...</option>
                {departements.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nom}
                  </option>
                ))}
              </select>

              <input
                name="type"
                placeholder="Type"
                value={form.type}
                readOnly
                style={{ 
                  padding: "10px 15px", 
                  border: `2px solid ${colors.lightGray}`, 
                  borderRadius: "8px", 
                  fontSize: "14px", 
                  fontFamily: "inherit",
                  backgroundColor: "#f5f5f5",
                  color: colors.black
                }}
              />

              <div style={{ 
                padding: "10px 15px", 
                border: `2px solid ${colors.lightGray}`, 
                borderRadius: "8px", 
                fontSize: "14px", 
                fontFamily: "inherit",
                backgroundColor: "#e8f5e8",
                color: "#2e7d32",
                fontWeight: "600"
              }}>
                État: Disponible (par défaut)
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "10px", background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`, color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>{isEditing ? "Modifier" : "Ajouter"}</button>
                <button type="button" onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setForm({ 
                    matricule: "", 
                    modele: "", 
                    marque: "", 
                    couleur: "", 
                    carburant: "",
                    etat: "disponible",
                    departement_id: "",
                    type: ""
                  });
                }} style={{ flex: 1, padding: "10px", background: colors.grayTaupe, color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Détails Voiture */}
      {showDetailsModal && selectedVoiture && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(32, 45, 54, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          backdropFilter: "blur(5px)"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "0",
            borderRadius: "16px",
            width: "95%",
            maxWidth: "1200px",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 20px 60px rgba(32, 45, 54, 0.4)",
            border: `1px solid ${colors.lightGray}`
          }}>
            {/* Header du modal */}
            <div style={{
              background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`,
              padding: "24px 32px",
              borderRadius: "16px 16px 0 0",
              position: "relative"
            }}>
              <button
                onClick={() => setShowDetailsModal(false)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  border: "none",
                  background: "rgba(255, 255, 255, 0.2)",
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "white",
                  fontWeight: "bold",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.3)";
                  e.target.style.transform = "rotate(90deg)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                  e.target.style.transform = "rotate(0deg)";
                }}
              >
                ×
              </button>
              
              <div style={{ color: "white" }}>
                <h2 style={{
                  margin: "0 0 8px 0",
                  fontSize: "28px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  {selectedVoiture.matricule}
                </h2>
                <p style={{
                  margin: 0,
                  fontSize: "16px",
                  opacity: 0.9
                }}>
                  {selectedVoiture.marque} {selectedVoiture.modele} • {selectedVoiture.couleur}
                </p>
              </div>
            </div>

            {/* Contenu du modal */}
            <div style={{ padding: "32px" }}>
              {/* État actuel */}
              <div style={{
                background: "#f8fafc",
                padding: "20px",
                borderRadius: "12px",
                marginBottom: "24px",
                border: "1px solid #e2e8f0"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: "0 0 8px 0", color: colors.darkGray, fontSize: "18px" }}>État Actuel</h3>
                    <span style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "600",
                      backgroundColor: 
                        selectedVoiture.etat === 'disponible' ? "#dcfce7" :
                        selectedVoiture.etat === 'en_location' ? "#fee2e2" :
                        selectedVoiture.etat === 'vendue' ? "#e5e7eb" :
                        selectedVoiture.etat === 'en_maintenance' ? "#fef3c7" :
                        "#f3f4f6",
                      color: 
                        selectedVoiture.etat === 'disponible' ? "#166534" :
                        selectedVoiture.etat === 'en_location' ? "#991b1b" :
                        selectedVoiture.etat === 'vendue' ? "#374151" :
                        selectedVoiture.etat === 'en_maintenance' ? "#92400e" :
                        "#6b7280"
                    }}>
                      {selectedVoiture.etat?.replace('_', ' ').toUpperCase() || 'INCONNU'}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "14px", color: colors.lightGray }}>Affectation</div>
                    <div style={{ fontWeight: "600" }}>
                      {selectedVoiture.conducteur ? `${selectedVoiture.conducteur.nom} ${selectedVoiture.conducteur.prenom}` : "Non affecté"}
                    </div>
                    <div style={{ fontSize: "14px", color: colors.lightGray }}>
                      {selectedVoiture.departement?.nom || "Non assigné"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations techniques */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginBottom: "32px"
              }}>
                <div style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}>
                  <h4 style={{ margin: "0 0 16px 0", color: colors.darkGray, fontSize: "16px" }}>Informations Techniques</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: colors.lightGray }}>Marque:</span>
                      <strong>{selectedVoiture.marque}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: colors.lightGray }}>Modèle:</span>
                      <strong>{selectedVoiture.modele}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: colors.lightGray }}>Couleur:</span>
                      <strong>{selectedVoiture.couleur}</strong>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}>
                  <h4 style={{ margin: "0 0 16px 0", color: colors.darkGray, fontSize: "16px" }}>Informations Administratives</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: colors.lightGray }}>Matricule:</span>
                      <strong>{selectedVoiture.matricule}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: colors.lightGray }}>Mise en circulation:</span>
                      <strong>{selectedVoiture.mise_en_circulation || "N/A"}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: colors.lightGray }}>Carburant:</span>
                      <strong>{selectedVoiture.carburant || "N/A"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historique des transactions */}
              <div style={{
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}>
                <h3 style={{ margin: "0 0 20px 0", color: colors.darkGray, fontSize: "18px" }}>Historique des Transactions</h3>
                <div style={{ display: "grid", gap: "16px" }}>
                  {/* Transactions de location */}
                  <div style={{
                    background: "#f0f9ff",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #bae6fd"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#0369a1", fontSize: "14px" }}>Locations</h4>
                    <div style={{ color: colors.lightGray, fontSize: "14px" }}>
                      {selectedVoiture.locations && selectedVoiture.locations.length > 0 ? (
                        <div style={{ display: "grid", gap: "8px" }}>
                          {selectedVoiture.locations.slice(0, 3).map((location, index) => (
                            <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>{location.client || "Client"} - {location.date_location}</span>
                              <span style={{ fontWeight: "600", color: "#0369a1" }}>{location.prix_location} DT</span>
                            </div>
                          ))}
                          {selectedVoiture.locations.length > 3 && (
                            <div style={{ textAlign: "center", color: colors.lightGray, fontSize: "12px" }}>
                              +{selectedVoiture.locations.length - 3} autres transactions...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ textAlign: "center", color: colors.lightGray }}>
                          Aucune transaction de location enregistrée
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ventes */}
                  <div style={{
                    background: "#fef3e2",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #fde68a"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#d97706", fontSize: "14px" }}>Ventes</h4>
                    <div style={{ color: colors.lightGray, fontSize: "14px" }}>
                      {selectedVoiture.ventes && selectedVoiture.ventes.length > 0 ? (
                        <div style={{ display: "grid", gap: "8px" }}>
                          {selectedVoiture.ventes.slice(0, 3).map((vente, index) => (
                            <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span>{vente.acheteur || "Acheteur"} - {vente.date_vente}</span>
                              <span style={{ fontWeight: "600", color: "#d97706" }}>{vente.prix_vente} DT</span>
                            </div>
                          ))}
                          {selectedVoiture.ventes.length > 3 && (
                            <div style={{ textAlign: "center", color: colors.lightGray, fontSize: "12px" }}>
                              +{selectedVoiture.ventes.length - 3} autres ventes...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ textAlign: "center", color: colors.lightGray }}>
                          Aucune vente enregistrée
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Historique des maintenances et réparations */}
              <div style={{
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                marginBottom: "24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}>
                <h3 style={{ margin: "0 0 20px 0", color: colors.darkGray, fontSize: "18px" }}>Historique d'Entretien</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {/* Maintenances */}
                  <div style={{
                    background: "#f0fdf4",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #bbf7d0"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#166534", fontSize: "14px" }}>Maintenances Préventives</h4>
                    <div style={{ color: colors.lightGray, fontSize: "14px" }}>
                      {selectedVoiture.maintenances && selectedVoiture.maintenances.length > 0 ? (
                        <div style={{ display: "grid", gap: "8px" }}>
                          {selectedVoiture.maintenances.slice(0, 3).map((maintenance, index) => (
                            <div key={index} style={{ borderBottom: "1px solid #dcfce7", paddingBottom: "8px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                                <span>{maintenance.type || "Maintenance"}</span>
                                <span style={{ color: "#166534" }}>{maintenance.cout || "0"} DT</span>
                              </div>
                              <div style={{ fontSize: "12px", color: colors.lightGray, marginTop: "4px" }}>
                                {maintenance.date_maintenance} • {maintenance.description || "Aucune description"}
                              </div>
                            </div>
                          ))}
                          {selectedVoiture.maintenances.length > 3 && (
                            <div style={{ textAlign: "center", color: colors.lightGray, fontSize: "12px" }}>
                              +{selectedVoiture.maintenances.length - 3} autres maintenances...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ textAlign: "center", color: colors.lightGray }}>
                          Aucune maintenance enregistrée
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Réparations */}
                  <div style={{
                    background: "#fef2f2",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "1px solid #fecaca"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", color: "#dc2626", fontSize: "14px" }}>Réparations</h4>
                    <div style={{ color: colors.lightGray, fontSize: "14px" }}>
                      {selectedVoiture.reparations && selectedVoiture.reparations.length > 0 ? (
                        <div style={{ display: "grid", gap: "8px" }}>
                          {selectedVoiture.reparations.slice(0, 3).map((reparation, index) => (
                            <div key={index} style={{ borderBottom: "1px solid #fee2e2", paddingBottom: "8px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                                <span>{reparation.type || "Réparation"}</span>
                                <span style={{ color: "#dc2626" }}>{reparation.cout || "0"} DT</span>
                              </div>
                              <div style={{ fontSize: "12px", color: colors.lightGray, marginTop: "4px" }}>
                                {reparation.date_reparation} • {reparation.description || "Aucune description"}
                              </div>
                            </div>
                          ))}
                          {selectedVoiture.reparations.length > 3 && (
                            <div style={{ textAlign: "center", color: colors.lightGray, fontSize: "12px" }}>
                              +{selectedVoiture.reparations.length - 3} autres réparations...
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ textAlign: "center", color: colors.lightGray }}>
                          Aucune réparation enregistrée
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents et validités */}
              <div style={{
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}>
                <h3 style={{ margin: "0 0 20px 0", color: colors.darkGray, fontSize: "18px" }}>Documents et Validités</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                  {/* Assurance */}
                  <div style={{
                    background: selectedVoiture.assurance ? "#f0f9ff" : "#fef2f2",
                    padding: "16px",
                    borderRadius: "8px",
                    border: selectedVoiture.assurance ? "1px solid #bae6fd" : "1px solid #fecaca"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: selectedVoiture.assurance ? "#0369a1" : "#dc2626" }}>
                      Assurance
                    </h4>
                    {selectedVoiture.assurance ? (
                      <div style={{ fontSize: "13px" }}>
                        <div><strong>Fournisseur:</strong> {selectedVoiture.assurance.fournisseur?.nom || "N/A"}</div>
                        <div><strong>Type:</strong> {selectedVoiture.assurance.type_assurance || "N/A"}</div>
                        <div><strong>Expiration:</strong> {selectedVoiture.assurance.date_expiration || "N/A"}</div>
                      </div>
                    ) : (
                      <div style={{ color: colors.lightGray, textAlign: "center" }}>
                        Non configurée
                      </div>
                    )}
                  </div>

                  {/* Visite technique */}
                  <div style={{
                    background: selectedVoiture.visite ? "#f0fdf4" : "#fef2f2",
                    padding: "16px",
                    borderRadius: "8px",
                    border: selectedVoiture.visite ? "1px solid #bbf7d0" : "1px solid #fecaca"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: selectedVoiture.visite ? "#166534" : "#dc2626" }}>
                      Visite Technique
                    </h4>
                    {selectedVoiture.visite ? (
                      <div style={{ fontSize: "13px" }}>
                        <div><strong>Prochaine visite:</strong> {selectedVoiture.visite.prochaine_visite || "N/A"}</div>
                        <div><strong>Note:</strong> {selectedVoiture.visite.note || "N/A"}</div>
                      </div>
                    ) : (
                      <div style={{ color: colors.lightGray, textAlign: "center" }}>
                        Non planifiée
                      </div>
                    )}
                  </div>

                  {/* Taxe de circulation */}
                  <div style={{
                    background: selectedVoiture.taxecirculation ? "#f0fdf4" : "#fef2f2",
                    padding: "16px",
                    borderRadius: "8px",
                    border: selectedVoiture.taxecirculation ? "1px solid #bbf7d0" : "1px solid #fecaca"
                  }}>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: selectedVoiture.taxecirculation ? "#166534" : "#dc2626" }}>
                      Taxe de Circulation
                    </h4>
                    {selectedVoiture.taxecirculation ? (
                      <div style={{ fontSize: "13px" }}>
                        <div><strong>Expiration:</strong> {selectedVoiture.taxecirculation.date_expiration || "N/A"}</div>
                        <div><strong>Montant:</strong> {selectedVoiture.taxecirculation.montant || "0"} DT</div>
                        <div><strong>Statut:</strong> {selectedVoiture.taxecirculation.status || "N/A"}</div>
                      </div>
                    ) : (
                      <div style={{ color: colors.lightGray, textAlign: "center" }}>
                        Non payée
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bouton de fermeture */}
              <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                marginTop: "32px",
                paddingTop: "24px",
                borderTop: "1px solid #e2e8f0"
              }}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  style={{
                    padding: "14px 32px",
                    background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`,
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(128, 12, 31, 0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 16px rgba(128, 12, 31, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 12px rgba(128, 12, 31, 0.3)";
                  }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionVoitures;
