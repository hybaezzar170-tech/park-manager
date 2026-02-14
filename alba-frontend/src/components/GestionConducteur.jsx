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
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les conducteurs selon le terme de recherche
  const filteredConducteurs = conducteurs.filter(conducteur => 
    conducteur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conducteur.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les conducteurs à afficher pour la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConducteurs = filteredConducteurs.slice(indexOfFirstItem, indexOfLastItem);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredConducteurs.length / itemsPerPage);

  // Fonctions pour la pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/conducteurs", {
      headers: { Accept: "application/json" },
    })
      .then(res => res.json())
      .then(data => setConducteurs(data))
      .catch(err => console.error("Error fetching conducteurs:", err));
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
    });
    setIsEditing(true);
    setEditingId(conducteur.id);
    setShowModal(true);
    setErrors({});
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
    });
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = e => {
    e.preventDefault();

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://127.0.0.1:8000/api/conducteurs/${editingId}`
      : "http://127.0.0.1:8000/api/conducteurs";

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
          alert("Conducteur modifié avec succès ");
        } else {
          setConducteurs([...conducteurs, data.data]);
          alert("Conducteur ajouté avec succès ");
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

    fetch(`http://127.0.0.1:8000/api/conducteurs/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
    })
      .then(res => {
        if (!res.ok) throw new Error("Delete failed");
        setConducteurs(conducteurs.filter(c => c.id !== id));
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: "20px", backgroundColor: colors.offWhite }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "20px" 
      }}>
        <h2 style={{ 
          color: colors.black, 
          fontSize: "28px", 
          fontWeight: 700, 
          margin: 0 
        }}>
          Gestion des Conducteurs
        </h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Rechercher par nom ou prénom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "12px 16px",
              border: `2px solid ${colors.lightGray}`,
              borderRadius: "8px",
              fontSize: "14px",
              width: "250px",
              fontFamily: "inherit",
              transition: "all 0.3s ease",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = colors.deepRed}
            onBlur={(e) => e.target.style.borderColor = colors.lightGray}
          />
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
              transition: "all 0.3s",
              marginLeft: "10px"
            }}
          >
            � PDF
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
            {["ID","Nom","Prénom","Email","Téléphone","Actions"].map(col => (
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
          {filteredConducteurs.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ 
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
            currentConducteurs.map((c, index) => (
              <tr key={c.id} style={{ 
                borderBottom: `1px solid ${index === currentConducteurs.length - 1 ? "transparent" : "white"}`,
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
                      onClick={() => handleDelete(c.id)} 
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
            ))
          )}
        </tbody>
      </table>

      {/* Composant de Pagination */}
      {filteredConducteurs.length > 0 && (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            style={{
              padding: "8px 12px",
              backgroundColor: currentPage === 1 ? colors.grayTaupe : colors.deepRed,
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "500",
              transition: "all 0.3s ease",
              opacity: currentPage === 1 ? 0.5 : 1,
              minWidth: "40px"
            }}
          >
            ◀
          </button>

          <div style={{ display: "flex", gap: "5px" }}>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => paginate(pageNumber)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: currentPage === pageNumber ? colors.deepRed : "white",
                  color: currentPage === pageNumber ? "white" : colors.black,
                  border: currentPage === pageNumber ? "none" : `1px solid ${colors.lightGray}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s ease",
                  minWidth: "40px"
                }}
                onMouseOver={(e) => {
                  if (currentPage !== pageNumber) {
                    e.target.style.backgroundColor = colors.lightGray;
                  }
                }}
                onMouseOut={(e) => {
                  if (currentPage !== pageNumber) {
                    e.target.style.backgroundColor = "white";
                  }
                }}
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: "8px 12px",
              backgroundColor: currentPage === totalPages ? colors.grayTaupe : colors.deepRed,
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "500",
              transition: "all 0.3s ease",
              opacity: currentPage === totalPages ? 0.5 : 1,
              minWidth: "40px"
            }}
          >
            ▶
          </button>
        </div>
      )}

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
                {isEditing ? "Modifier le Conducteur" : "Ajouter un Conducteur"}
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Nom *</label>
                  <input
                    type="text"
                    placeholder="Nom"
                    name="nom"
                    value={form.nom}
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Prénom *</label>
                  <input
                    type="text"
                    placeholder="Prénom"
                    name="prenom"
                    value={form.prenom}
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
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={form.email}
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
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Téléphone *</label>
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    name="telephone"
                    value={form.telephone}
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
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Date de naissance</label>
                  <input
                    type="date"
                    name="date_naissance"
                    value={form.date_naissance}
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
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Date d'embauche</label>
                  <input
                    type="date"
                    name="date_embauche"
                    value={form.date_embauche}
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Numéro de permis</label>
                  <input
                    type="text"
                    placeholder="Numéro de permis"
                    name="numero_permis"
                    value={form.numero_permis}
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
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Ville</label>
                  <input
                    type="text"
                    placeholder="Ville"
                    name="ville"
                    value={form.ville}
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Code postal</label>
                  <input
                    type="text"
                    placeholder="Code postal"
                    name="code_postal"
                    value={form.code_postal}
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
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Adresse</label>
                  <textarea
                    placeholder="Adresse"
                    name="adresse"
                    value={form.adresse}
                    onChange={handleChange}
                    rows="2"
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
    </div>
  );
}

export default GestionConducteur;