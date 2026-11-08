import React, { useState, useEffect } from "react";

function GestionDepartement() {
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

  const [departements, setDepartements] = useState([]);
  const [filteredDepartements, setFilteredDepartements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [form, setForm] = useState({ nom: "", type: "", etat: "actif" });

  useEffect(() => {
    fetch("http://localhost:8000/api/departements?all=true")
      .then(res => res.json())
      .then(data => {
        // S'assurer que data est un tableau
        if (Array.isArray(data)) {
          setDepartements(data);
          setFilteredDepartements(data);
        } else if (data && Array.isArray(data.data)) {
          setDepartements(data.data);
          setFilteredDepartements(data.data);
        } else {
          console.error("Données reçues invalides:", data);
          setDepartements([]);
          setFilteredDepartements([]);
        }
      })
      .catch(err => {
        console.error("Error fetching departements:", err);
        setDepartements([]);
        setFilteredDepartements([]);
      });
  }, []);

  // Effet pour filtrer les départements
  useEffect(() => {
    const filtered = departements.filter(departement =>
      departement.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (departement.type && departement.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      departement.etat.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDepartements(filtered);
  }, [searchTerm, departements]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const generatePDF = (departements, title) => {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1 {
          color: #800C1F;
          text-align: center;
          margin-bottom: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
          color: #333;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <h1>Liste des Départements</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Type</th>
            <th>État</th>
          </tr>
        </thead>
        <tbody>
          ${departements.map(departement => `
            <tr>
              <td>${departement.id}</td>
              <td>${departement.nom || ''}</td>
              <td>${departement.type === 'voiture_5_places' ? 'Voiture 5 places' :
                       departement.type === 'minibus' ? 'Minibus' :
                       departement.type === 'utilitaire' ? 'Utilitaire' :
                       departement.type === 'camion' ? 'Camion' :
                       departement.type || 'Non défini'}</td>
              <td>${departement.etat === 'actif' ? 'Actif' : 'Inactif'}</td>
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
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleEdit = departement => {
    setForm({ nom: departement.nom, type: departement.type || "", etat: departement.etat || "actif" });
    setIsEditing(true);
    setEditingId(departement.id);
    setShowModal(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing 
      ? `http://localhost:8000/api/departements/${editingId}`
      : "http://localhost:8000/api/departements";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        if (isEditing) {
          alert("Département modifié !");
          setDepartements(departements.map(d => d.id === editingId ? (data.data || data) : d));
        } else {
          alert("Département ajouté !");
          setDepartements([...departements, data.data || data]);
        }
        setForm({ nom: "", type: "", etat: "actif" });
        setShowModal(false);
        setIsEditing(false);
        setEditingId(null);
      })
      .catch(err => console.error("Error:", err));
  };

  const handleToggleEtat = id => {
    fetch(`http://localhost:8000/api/departements/${id}/toggle-etat`, { 
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setDepartements(departements.map(d => d.id === id ? (data.data || data) : d));
      })
      .catch(err => console.error("Error:", err));
  };
  return (
    <div style={{ padding: "30px", backgroundColor: colors.offWhite, borderRadius: "12px" }}>
      <h1 style={{ 
        color: colors.black, 
        fontSize: "32px", 
        fontWeight: 800, 
        margin: "0 0 10px 0",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "2px",
        background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
      }}>
        Gestion des Départements
      </h1>

      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px", justifyContent: "center" }}>
        <input
          type="text"
          placeholder="Rechercher par nom, type ou état..."
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
          onClick={() => generatePDF(filteredDepartements, "Liste des Départements")}
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
        <button 
          onClick={() => setShowModal(true)} 
          style={{
            padding: "12px 24px",
            backgroundColor: colors.deepRed,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(128, 12, 31, 0.4)",
            transition: "all 0.3s"
          }}
        >
          + Ajouter Département
        </button>
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
            {["ID","Nom","Type","État","Actions"].map(col => (
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
          {!Array.isArray(filteredDepartements) || filteredDepartements.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ 
                textAlign: "center", 
                color: "#94a3b8", 
                padding: "40px 20px",
                fontSize: "14px",
                backgroundColor: "#fafbfc"
              }}>
                {!Array.isArray(filteredDepartements) ? "Erreur de chargement des départements" : 
                 searchTerm ? "Aucun département trouvé pour cette recherche" : "Aucun département disponible"}
              </td>
            </tr>
          ) : (
            filteredDepartements.map((d, index) => (
              <tr key={d.id} style={{ 
                borderBottom: `1px solid ${index === filteredDepartements.length - 1 ? "transparent" : "white"}`,
                backgroundColor: index % 2 === 0 ? "#ffffff" : "white",
                transition: "all 0.2s ease"
              }}>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{d.id}</td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{d.nom}</td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontSize: "14px"
                }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: 
                      d.type === 'voiture_5_places' ? "#e0f2fe" :
                      d.type === 'minibus' ? "#fef3e2" :
                      d.type === 'utilitaire' ? "#f0fdf4" :
                      d.type === 'camion' ? "#fefce8" :
                      "#f3f4f6",
                    color: 
                      d.type === 'voiture_5_places' ? "#0369a1" :
                      d.type === 'minibus' ? "#d97706" :
                      d.type === 'utilitaire' ? "#166534" :
                      d.type === 'camion' ? "#ca8a04" :
                      "#6b7280"
                  }}>
                    {d.type === 'voiture_5_places' ? 'Voiture 5 places' :
                     d.type === 'minibus' ? 'Minibus' :
                     d.type === 'utilitaire' ? 'Utilitaire' :
                     d.type === 'camion' ? 'Camion' :
                     d.type || 'Non défini'}
                  </span>
                </td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontSize: "14px"
                }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: 
                      d.etat === 'actif' ? "#f0fdf4" : "#fef2f2",
                    color: 
                      d.etat === 'actif' ? "#166534" : "#dc2626"
                  }}>
                    {d.etat === 'actif' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td style={{ padding: "16px 12px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => handleEdit(d)} 
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
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
                      }}
                      onMouseOver={(e) => e.target.style.background = "#333333"}
                      onMouseOut={(e) => e.target.style.background = colors.black}
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleToggleEtat(d.id)} 
                      style={{ 
                        padding: "8px 12px", 
                        background: d.etat === 'actif' ? colors.grayTaupe : colors.deepRed, 
                        color: "white", 
                        border: "none", 
                        borderRadius: "6px", 
                        cursor: "pointer", 
                        fontSize: "12px", 
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                        boxShadow: d.etat === 'actif' ? "0 2px 4px rgba(146, 156, 170, 0.2)" : "0 2px 4px rgba(128, 12, 31, 0.2)"
                      }}
                      onMouseOver={(e) => {
                        if (d.etat === 'actif') {
                          e.target.style.background = "#7d8a9a";
                        } else {
                          e.target.style.background = colors.darkBurgundy;
                        }
                      }}
                      onMouseOut={(e) => {
                        if (d.etat === 'actif') {
                          e.target.style.background = colors.grayTaupe;
                        } else {
                          e.target.style.background = colors.deepRed;
                        }
                      }}
                    >
                      {d.etat === 'actif' ? 'Désactiver' : 'Activer'}
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
            border: `2px solid ${colors.steelBlue}`
          }}>
            <h3 style={{ color: colors.darkNavy, marginBottom: "20px", fontSize: "20px", fontWeight: 700 }}>{isEditing ? "Modifier Département" : "Ajouter Département"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
              <input
                name="nom"
                placeholder="Nom du département"
                value={form.nom}
                onChange={handleChange}
                required
                style={{ padding: "10px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                style={{
                  padding: "10px 15px",
                  border: `2px solid ${colors.lightBlue}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  backgroundColor: "#fff",
                  color: colors.black,
                  cursor: "pointer"
                }}
              >
                <option value="">Sélectionner un type...</option>
                <option value="voiture_5_places">Voiture 5 places</option>
                <option value="minibus">Minibus</option>
                <option value="utilitaire">Utilitaire</option>
                <option value="camion">Camion</option>
              </select>
              <select
                name="etat"
                value={form.etat}
                onChange={handleChange}
                style={{
                  padding: "10px 15px",
                  border: `2px solid ${colors.lightBlue}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  backgroundColor: "#fff",
                  color: colors.black,
                  cursor: "pointer"
                }}
              >
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "10px", background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`, color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>{isEditing ? "Modifier" : "Ajouter"}</button>
                <button type="button" onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setForm({ nom: "", type: "", etat: "actif" });
                }} style={{ flex: 1, padding: "10px", background: colors.grayTaupe, color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionDepartement;
