import React, { useEffect, useState } from "react";

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
            <th>ID</th>
            <th>Matricule</th>
            <th>Marque</th>
            <th>Modèle</th>
            <th>Carburant</th>
            <th>État</th>
            <th>Conducteur</th>
          </tr>
        </thead>
        <tbody>
          ${voitures.map(voiture => `
            <tr>
              <td>${voiture.id}</td>
              <td>${voiture.matricule || ''}</td>
              <td>${voiture.marque || ''}</td>
              <td>${voiture.modele || ''}</td>
              <td>${voiture.carburant || ''}</td>
              <td>${voiture.etat || ''}</td>
              <td>${voiture.conducteur ? `${voiture.conducteur.nom} ${voiture.conducteur.prenom}` : ''}</td>
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

export default function GestionVoitures() {
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
  const [showModal, setShowModal] = useState(false);
  const [editingVoiture, setEditingVoiture] = useState(null);
  const [formData, setFormData] = useState({
    matricule: "",
    modele: "",
    num_serie: "",
    marque: "",
    couleur: "",
    mise_en_circulation: "",
    carburant: "",
    prix_achat: "",
    date_achat: "",
    etat: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrer les voitures selon le terme de recherche
  const filteredVoitures = voitures.filter(voiture => 
    voiture.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voiture.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voiture.marque.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les voitures à afficher pour la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVoitures = filteredVoitures.slice(indexOfFirstItem, indexOfLastItem);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredVoitures.length / itemsPerPage);

  // Fonctions pour la pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/voitures")
      .then(res => res.json())
      .then(setVoitures)
      .catch(err => console.error(err));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette voiture ?")) return;

    fetch(`http://127.0.0.1:8000/api/voitures/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => setVoitures(voitures.filter(v => v.id !== id)))
      .catch(err => console.error(err));
  };

  const handleEdit = (voiture) => {
    setEditingVoiture(voiture);
    setFormData({
      matricule: voiture.matricule || "",
      modele: voiture.modele || "",
      num_serie: voiture.num_serie || "",
      marque: voiture.marque || "",
      couleur: voiture.couleur || "",
      mise_en_circulation: voiture.mise_en_circulation || "",
      carburant: voiture.carburant || "",
      prix_achat: voiture.prix_achat || "",
      date_achat: voiture.date_achat || "",
      etat: voiture.etat || ""
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Données envoyées:", formData);
    console.log("ID de la voiture:", editingVoiture.id);
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/voitures/${editingVoiture.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedVoiture = await response.json();
        setVoitures(voitures.map(v => v.id === editingVoiture.id ? updatedVoiture : v));
        setShowModal(false);
        setEditingVoiture(null);
      } else {
        const errorData = await response.json();
        console.error("Erreur lors de la mise à jour:", errorData);
        alert(`Erreur: ${JSON.stringify(errorData.errors || errorData.message || 'Erreur inconnue')}`);
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("Erreur de connexion au serveur");
    }
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
          Gestion des Voitures
        </h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
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
            + Ajouter Voiture
          </button>
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
              transition: "all 0.3s",
              marginLeft: "10px"
            }}
          >
            PDF
          </button>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ 
          width: "100%",
          minWidth: "1200px",
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
              {["Matricule","Modèle","Num Série","Département","Conducteur","Marque","Couleur","Mise en circulation","Carburant","Prix Achat","Date Achat","Fournisseur","Etat","Actions"].map(col => (
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
            {filteredVoitures.length === 0 ? (
              <tr>
                <td colSpan="14" style={{ 
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
              currentVoitures.map((v, index) => (
                <tr key={v.id} style={{ 
                  borderBottom: `1px solid ${index === currentVoitures.length - 1 ? "transparent" : "white"}`,
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
                  }}>{v.modele}</td>
                  <td style={{ 
                    padding: "16px 12px", 
                    color: "black",
                    fontSize: "14px"
                  }}>{v.num_serie}</td>
                  <td style={{ 
                    padding: "16px 12px", 
                    color: "black",
                    fontSize: "14px"
                  }}>{v.departement?.nom}</td>
                  <td style={{ 
                    padding: "16px 12px", 
                    color: "black",
                    fontSize: "14px"
                  }}>{v.conducteur ? `${v.conducteur.nom} ${v.conducteur.prenom}` : "Non affecté"}</td>
                  <td style={{ 
                    padding: "16px 12px", 
                    color: "black",
                    fontSize: "14px"
                  }}>{v.marque}</td>
                  <td style={{ 
                    padding: "16px 12px", 
                    color: "black",
                    fontSize: "14px"
                  }}>{v.couleur}</td>
                  <td style={{ 
                    padding: "16px 12px", 
                    color: "black",
                    fontSize: "14px"
                  }}>{v.mise_en_circulation}</td>
                  <td style={{ 
                    padding: "16px 12px", 
                    color: "black",
                    fontSize: "14px"
                  }}>{v.carburant}</td>
                  <td style={{ 
                    padding: "16px 12px", 
                    color: "black",
                    fontSize: "14px"
                  }}>{v.prix_achat || 'N/A'}</td>
                  <td style={{ 
                    padding: "16px 12px", 
                    color: "black",
                    fontSize: "14px"
                  }}>{v.date_achat || 'N/A'}</td>
                  <td style={{ 
                    padding: "16px 12px", 
                    color: "black",
                    fontSize: "14px"
                  }}>{v.fournisseur?.nom}</td>
                  <td style={{ padding: "16px 12px" }}>
                    <span style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
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
                        "#6b7280",
                      border: `1px solid ${
                        v.etat === 'disponible' ? "#86efac" :
                        v.etat === 'en_location' ? "#fecaca" :
                        v.etat === 'vendue' ? "#d1d5db" :
                        v.etat === 'en_maintenance' ? "#fde68a" :
                        "#d1d5db"
                      }`
                    }}>
                      {v.etat?.replace('_', ' ').toUpperCase() || 'INCONNU'}
                    </span>
                  </td>
                  <td style={{ padding: "16px 12px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button 
                        onClick={() => handleEdit(v)}
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
                        onClick={() => v.etat === 'disponible' ? handleDelete(v.id) : null}
                        disabled={v.etat !== 'disponible'}
                        style={{
                          padding: "8px 12px",
                          background: v.etat === 'disponible' ? colors.deepRed : colors.grayTaupe,
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: v.etat === 'disponible' ? "pointer" : "not-allowed",
                          fontSize: "12px",
                          fontWeight: "500",
                          transition: "all 0.2s ease",
                          opacity: v.etat === 'disponible' ? 1 : 0.6,
                          boxShadow: v.etat === 'disponible' ? "0 2px 4px rgba(128, 12, 31, 0.2)" : "none"
                        }}
                        onMouseOver={(e) => {
                          if (v.etat === 'disponible') {
                            e.target.style.background = colors.darkBurgundy;
                          }
                        }}
                        onMouseOut={(e) => {
                          if (v.etat === 'disponible') {
                            e.target.style.background = colors.deepRed;
                          }
                        }}
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
      </div>

      {/* Composant de Pagination */}
      {filteredVoitures.length > 0 && (
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
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
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
            width: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            position: "relative",
            boxShadow: "0 10px 40px rgba(32, 45, 54, 0.3)",
            border: `2px solid ${colors.steelBlue}`
          }}>
            <h3 style={{
              color: colors.darkNavy,
              marginBottom: "20px",
              fontSize: "20px",
              fontWeight: 700
            }}>
              Modifier la Voiture
            </h3>
            
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                border: "none",
                background: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: colors.grayTaupe
              }}
            >
            </button>

            <form onSubmit={handleUpdate} style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginTop: "10px"
            }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ color: colors.darkNavy, marginBottom: "5px", fontSize: "14px" }}>Matricule</label>
                <input
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                  onChange={handleInputChange}
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
                <label style={{ color: colors.darkNavy, marginBottom: "5px", fontSize: "14px" }}>Modèle</label>
                <input
                  type="text"
                  name="modele"
                  value={formData.modele}
                  onChange={handleInputChange}
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
                <label style={{ color: colors.darkNavy, marginBottom: "5px", fontSize: "14px" }}>Numéro de série</label>
                <input
                  type="text"
                  name="num_serie"
                  value={formData.num_serie}
                  onChange={handleInputChange}
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
                <label style={{ color: colors.darkNavy, marginBottom: "5px", fontSize: "14px" }}>Marque</label>
                <input
                  type="text"
                  name="marque"
                  value={formData.marque}
                  onChange={handleInputChange}
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
                <label style={{ color: colors.darkNavy, marginBottom: "5px", fontSize: "14px" }}>Couleur</label>
                <input
                  type="text"
                  name="couleur"
                  value={formData.couleur}
                  onChange={handleInputChange}
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
                <label style={{ color: colors.darkNavy, marginBottom: "5px", fontSize: "14px" }}>Mise en circulation</label>
                <input
                  type="date"
                  name="mise_en_circulation"
                  value={formData.mise_en_circulation}
                  onChange={handleInputChange}
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
                <label style={{ color: colors.darkNavy, marginBottom: "5px", fontSize: "14px" }}>Carburant</label>
                <select
                  name="carburant"
                  value={formData.carburant}
                  onChange={handleInputChange}
                  required
                  style={{
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightBlue}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    cursor: "pointer",
                    backgroundColor: "#fff",
                    color: colors.darkNavy
                  }}
                >
                  <option value="">Sélectionner...</option>
                  <option value="Essence">Essence</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybride">Hybride</option>
                  <option value="Électrique">Électrique</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ color: colors.darkNavy, marginBottom: "5px", fontSize: "14px" }}>Prix d'achat</label>
                <input
                  type="number"
                  name="prix_achat"
                  value={formData.prix_achat}
                  onChange={handleInputChange}
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
                <label style={{ color: colors.darkNavy, marginBottom: "5px", fontSize: "14px" }}>Date d'achat</label>
                <input
                  type="date"
                  name="date_achat"
                  value={formData.date_achat}
                  onChange={handleInputChange}
                  style={{
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightBlue}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                marginTop: "20px",
                gridColumn: "1 / -1"
              }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  Enregistrer les modifications
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
