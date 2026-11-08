import React, { useState, useEffect } from "react";

// Fonction pour générer un PDF de la liste
const generatePDF = (conducteurs, title) => {
  // Créer le contenu HTML pour le PDF
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
      <h1>Liste des Conducteurs</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Ville</th>
          </tr>
        </thead>
        <tbody>
          ${conducteurs.map(conducteur => `
            <tr>
              <td>${conducteur.id}</td>
              <td>${conducteur.nom || ''}</td>
              <td>${conducteur.prenom || ''}</td>
              <td>${conducteur.email || ''}</td>
              <td>${conducteur.telephone || ''}</td>
              <td>${conducteur.adresse || ''}</td>
              <td>${conducteur.ville || ''}</td>
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

  // Créer une nouvelle fenêtre pour le PDF
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Attendre que le contenu soit chargé puis imprimer
  printWindow.onload = function() {
    printWindow.print();
    printWindow.close();
  };
};

// CSS pour l'impression - n'imprimer que les tableaux
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    
    body table, body thead, body tbody, body tr, body th, body td {
      visibility: visible;
      position: relative;
    }
    
    body table {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    
    /* Masquer tous les éléments sauf les tableaux */
    body > div:not(:has(table)),
    body button,
    body input,
    body h2,
    body h3,
    body .pagination,
    body .modal {
      display: none !important;
    }
    
    /* Style pour l'impression */
    table {
      font-size: 12px;
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      border: 1px solid #000;
      padding: 8px;
      text-align: left;
    }
    
    th {
      background-color: #f0f0f0 !important;
      font-weight: bold;
    }
  }
`;

function GestionConducteur() {
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
  const [conducteurs, setConducteurs] = useState([]);
  const [filteredConducteurs, setFilteredConducteurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    date_naissance: "",
    date_embauche: "",
    numero_permis: "",
    adresse: "",
    ville: "",
    code_postal: "",
    telephone: "",
    email: "",
    password: "",
    etat: "actif"
  });
  const [errors, setErrors] = useState({});

  // Effet pour filtrer les conducteurs
  useEffect(() => {
    const filtered = conducteurs.filter(conducteur =>
      conducteur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conducteur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conducteur.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conducteur.telephone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conducteur.etat.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConducteurs(filtered);
  }, [searchTerm, conducteurs]);

  useEffect(() => {
    fetch("http://localhost:8000/api/conducteurs?all=true", {
      headers: { Accept: "application/json" },
    })
      .then(res => res.json())
      .then(data => {
        // S'assurer que data est un tableau
        if (Array.isArray(data)) {
          setConducteurs(data);
          setFilteredConducteurs(data);
        } else if (data && Array.isArray(data.data)) {
          setConducteurs(data.data);
          setFilteredConducteurs(data.data);
        } else {
          console.error("Données reçues invalides:", data);
          setConducteurs([]);
          setFilteredConducteurs([]);
        }
      })
      .catch(err => {
        console.error("Error fetching conducteurs:", err);
        setConducteurs([]);
        setFilteredConducteurs([]);
      });
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };
  const handleEdit = conducteur => {
    setForm({
      nom: conducteur.nom || "",
      prenom: conducteur.prenom || "",
      date_naissance: conducteur.date_naissance || "",
      date_embauche: conducteur.date_embauche || "",
      numero_permis: conducteur.numero_permis || "",
      adresse: conducteur.adresse || "",
      ville: conducteur.ville || "",
      code_postal: conducteur.code_postal || "",
      telephone: conducteur.telephone || "",
      email: conducteur.email || "",
      password: conducteur.password || "",
      etat: conducteur.etat || "actif"
    });
    setIsEditing(true);
    setEditingId(conducteur.id);
    setShowModal(true);
    setErrors({});
  };

  const handleToggleEtat = conducteur => {
    const etat = conducteur.etat === "actif" ? "inactif" : "actif";
    fetch(`http://localhost:8000/api/conducteurs/${conducteur.id}`, {
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
        setConducteurs(
          conducteurs.map(c => (c.id === conducteur.id ? data.data : c))
        );
        setFilteredConducteurs(
          filteredConducteurs.map(c => (c.id === conducteur.id ? data.data : c))
        );
        alert("Etat du conducteur modifié avec succès ");
      })
      .catch(err => {
        console.error("API Error:", err);
        if (err.errors) {
          setErrors(err.errors); 
        } else {
          alert("Erreur serveur ");
        }
      });
  };

  const handleSubmit = e => {
    e.preventDefault();

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:8000/api/conducteurs/${editingId}`
      : "http://localhost:8000/api/conducteurs";

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
          setConducteurs(
            conducteurs.map(c => (c.id === editingId ? data.data : c))
          );
          setFilteredConducteurs(
            filteredConducteurs.map(c => (c.id === editingId ? data.data : c))
          );
          alert("Conducteur modifié avec succès ");
        } else {
          setConducteurs([...conducteurs, data.data]);
          setFilteredConducteurs([...filteredConducteurs, data.data]);
          if (data.password) {
            alert(`Conducteur ajouté avec succès !\n\nEmail: ${data.data.email}\nMot de passe: ${data.password}\n\nVeuillez communiquer ces identifiants au conducteur.`);
          } else {
            alert("Conducteur ajouté avec succès ");
          }
        }

        setShowModal(false);
        resetForm();
      })
      .catch(err => {
        console.error("API Error:", err);
        if (err.errors) {
          setErrors(err.errors); 
        } else {
          alert("Erreur serveur ");
        }
      });
  };

  const handleDelete = id => {
    if (!window.confirm("Tu es sûr de vouloir supprimer ce conducteur ?")) return;

    fetch(`http://localhost:8000/api/conducteurs/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        setConducteurs(conducteurs.filter(c => c.id !== id));
        setFilteredConducteurs(filteredConducteurs.filter(c => c.id !== id));
      })
      .catch(err => console.error(err));
  };

  const resetForm = () => {
    setForm({
      nom: "",
      prenom: "",
      date_naissance: "",
      date_embauche: "",
      numero_permis: "",
      adresse: "",
      ville: "",
      code_postal: "",
      telephone: "",
      email: "",
      password: "",
      etat: "actif"
    });
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
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
          Gestion des Conducteurs
        </h1>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email ou état..."
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
            onClick={() => generatePDF(filteredConducteurs, "Liste des Conducteurs")}
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
            + Ajouter Conducteur
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
            {["ID","Nom","Prénom","Email","Téléphone","État","Actions"].map(col => (
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
          {!Array.isArray(filteredConducteurs) ? (
            <tr>
              <td colSpan="7" style={{ 
                textAlign: "center", 
                color: "#94a3b8", 
                padding: "40px 20px",
                fontSize: "14px",
                backgroundColor: "#fafbfc"
              }}>
                Erreur de chargement des conducteurs
              </td>
            </tr>
          ) : filteredConducteurs.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ 
                textAlign: "center", 
                color: "#94a3b8", 
                padding: "40px 20px",
                fontSize: "14px",
                backgroundColor: "#fafbfc"
              }}>
                {searchTerm ? "Aucun conducteur trouvé pour cette recherche" : "Aucun conducteur disponible"}
              </td>
            </tr>
          ) : (
            filteredConducteurs.map((c, index) => (
              <tr key={c.id} style={{ 
                borderBottom: `1px solid ${index === filteredConducteurs.length - 1 ? "transparent" : "white"}`,
                backgroundColor: index % 2 === 0 ? "#ffffff" : "white",
                transition: "all 0.2s ease"
              }}>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{c.id}</td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{c.nom}</td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{c.prenom}</td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontSize: "14px"
                }}>{c.email}</td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontSize: "14px"
                }}>{c.telephone}</td>
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
                      c.etat === 'actif' ? "#f0fdf4" : "#fef2f2",
                    color: 
                      c.etat === 'actif' ? "#166534" : "#dc2626"
                  }}>
                    {c.etat === 'actif' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td style={{ padding: "16px 12px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => handleEdit(c)} 
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
                      onClick={() => handleToggleEtat(c)} 
                      style={{ 
                        padding: "8px 12px", 
                        background: c.etat === 'actif' ? colors.grayTaupe : colors.deepRed, 
                        color: "white", 
                        border: "none", 
                        borderRadius: "6px", 
                        cursor: "pointer", 
                        fontSize: "12px", 
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                        boxShadow: c.etat === 'actif' ? "0 2px 4px rgba(146, 156, 170, 0.2)" : "0 2px 4px rgba(128, 12, 31, 0.2)"
                      }}
                      onMouseOver={(e) => {
                        if (c.etat === 'actif') {
                          e.target.style.background = "#7d8a9a";
                        } else {
                          e.target.style.background = colors.darkBurgundy;
                        }
                      }}
                      onMouseOut={(e) => {
                        if (c.etat === 'actif') {
                          e.target.style.background = colors.grayTaupe;
                        } else {
                          e.target.style.background = colors.deepRed;
                        }
                      }}
                    >
                      {c.etat === 'actif' ? 'Désactiver' : 'Activer'}
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
            <h3 style={{ color: colors.darkGray, marginBottom: "20px", fontSize: "20px", fontWeight: 700 }}>{isEditing ? "Modifier Conducteur" : "Ajouter Conducteur"}</h3>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
              <input
                name="nom"
                placeholder="Nom du conducteur"
                value={form.nom}
                onChange={handleChange}
                required
                style={{ padding: "10px 15px", border: `2px solid ${colors.lightGray}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              <input
                name="prenom"
                placeholder="Prénom du conducteur"
                value={form.prenom}
                onChange={handleChange}
                required
                style={{ padding: "10px 15px", border: `2px solid ${colors.lightGray}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                style={{ padding: "10px 15px", border: `2px solid ${colors.lightGray}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              <input
                type="tel"
                name="telephone"
                placeholder="Téléphone"
                value={form.telephone}
                onChange={handleChange}
                required
                style={{ padding: "10px 15px", border: `2px solid ${colors.lightGray}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe (optionnel)"
                value={form.password}
                onChange={handleChange}
                style={{ padding: "10px 15px", border: `2px solid ${colors.lightGray}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              <select
                name="etat"
                value={form.etat}
                onChange={handleChange}
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
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "10px", background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`, color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>{isEditing ? "Modifier" : "Ajouter"}</button>
                <button type="button" onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setForm({ nom: "", prenom: "", email: "", telephone: "", password: "", etat: "actif" });
                }} style={{ flex: 1, padding: "10px", background: colors.grayTaupe, color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionConducteur;