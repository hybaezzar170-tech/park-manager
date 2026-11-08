import React, { useState, useEffect } from "react";
function Fournisseurs() {
  const colors = {
    black: "#000000",
    darkGray: "#1a1a1a",
    mediumGray: "#333333",
    lightGray: "#666666",
    offWhite: "#f5f5f5",
    darkBurgundy: "#3C0007",
    deepRed: "#800C1F",
    grayTaupe: "#929CAA",
    steelBlue: "#4682B4"
  };
  const [fournisseurs, setFournisseurs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nom: "", prenom: "", type: "", email: "", tel: "", fax: "", site_web: "", adresse: "", ville: "", code_postal: "", contact: ""
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const API_URL = "http://localhost:8000/api/fournisseurs";

  // Filtrer les fournisseurs selon le terme de recherche
  const filteredFournisseurs = fournisseurs.filter(fournisseur => 
    fournisseur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fournisseur.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fournisseur.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les fournisseurs à afficher pour la page actuelle
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFournisseurs = filteredFournisseurs.slice(indexOfFirstItem, indexOfLastItem);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredFournisseurs.length / itemsPerPage);

  // Fonctions pour la pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const fetchFournisseurs = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setFournisseurs(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchFournisseurs();
  }, []);
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      if (editingId) {
        setFournisseurs(fournisseurs.map(f => f.id === editingId ? data : f));
      } else {
        setFournisseurs([...fournisseurs, data]);
      }
      setForm({ nom: "", prenom: "", type: "", email: "", tel: "", fax: "", site_web: "", adresse: "", ville: "", code_postal: "", contact: "" });
      setEditingId(null);
      setShowModal(false);
    } catch (err) {
      console.error(err);
      if (err.errors) setErrors(err.errors);
      else alert("Erreur serveur !");
    }
  };
  const handleEdit = f => {
    setForm({ ...f });
    setEditingId(f.id);
    setShowModal(true);
    setErrors({});
  };
  const handleDelete = async id => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce fournisseur ?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: { Accept: "application/json" } });
      setFournisseurs(fournisseurs.filter(f => f.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression !");
    }
  };
  return (
    <div style={{ padding: "30px", backgroundColor: colors.white, borderRadius: "12px" }}>
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
          Fournisseurs
        </h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "12px 16px",
              border: `2px solid ${colors.lightGray}`,
              borderRadius: "8px",
              fontSize: "14px",
              width: "280px",
              fontFamily: "inherit",
              transition: "all 0.3s ease",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = colors.deepRed}
            onBlur={(e) => e.target.style.borderColor = colors.lightGray}
          />
          <button
            onClick={() => {
              setShowModal(true);
              setEditingId(null);
              setForm({ nom: "", prenom: "", type: "", email: "", tel: "", fax: "", site_web: "", adresse: "", ville: "", code_postal: "", contact: "" });
            }}
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
            + Ajouter Fournisseur
          </button>
        </div>
      </div>
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "30px",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
          }}>
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
                {editingId ? "Modifier le Fournisseur" : "Ajouter un Fournisseur"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Nom</label>
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Prénom</label>
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Téléphone</label>
                  <input
                    type="tel"
                    placeholder="Téléphone"
                    name="tel"
                    value={form.tel}
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
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
                    <option value="">Sélectionner...</option>
                    <option value="Vente de véhicule">Vente de véhicule</option>
                    <option value="Location véhicule">Location véhicule</option>
                    <option value="Assurance">Assurance</option>
                    <option value="Vente pièce auto">Vente pièce auto</option>
                    <option value="Entretiens et réparations">Entretiens et réparations</option>
                    <option value="Vente carburant">Vente carburant</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Fax</label>
                  <input
                    type="tel"
                    placeholder="Fax"
                    name="fax"
                    value={form.fax}
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

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Site Web</label>
                <input
                  type="url"
                  placeholder="Site Web"
                  name="site_web"
                  value={form.site_web}
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
                  required
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

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Ville </label>
                  <input
                    type="text"
                    placeholder="Ville"
                    name="ville"
                    value={form.ville}
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Code Postal</label>
                  <input
                    type="text"
                    placeholder="Code Postal"
                    name="code_postal"
                    value={form.code_postal}
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Contact</label>
                  <input
                    type="text"
                    placeholder="Contact"
                    name="contact"
                    value={form.contact}
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
                    backgroundColor: colors.deepRed,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  {editingId ? "Modifier" : "Ajouter"}
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
            {["Nom","Prénom","Type","Email","Téléphone","Adresse","Ville","Code Postal","Contact","Actions"].map(col => (
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
          {filteredFournisseurs.length === 0 ? (
            <tr>
              <td colSpan="10" style={{
                textAlign: "center",
                color: "#94a3b8",
                padding: "40px 20px",
                fontSize: "14px",
                backgroundColor: "#fafbfc"
              }}>
                {searchTerm ? "Aucun fournisseur trouvé pour cette recherche" : "Aucun fournisseur disponible"}
              </td>
            </tr>
          ) : (
            currentFournisseurs.map((f, index) => (
              <tr key={f.id} style={{
                borderBottom: `1px solid ${index === currentFournisseurs.length - 1 ? "transparent" : "white"}`,
                backgroundColor: index % 2 === 0 ? "#ffffff" : "white",
                transition: "all 0.2s ease"
              }}>
                <td style={{
                  padding: "16px 12px",
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{f.nom}</td>
                <td style={{
                  padding: "16px 12px",
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{f.prenom}</td>
                <td style={{ padding: "16px 12px" }}>
                  <span style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: 
                      f.type === "Vente de véhicule" ? "#dbeafe" :
                      f.type === "Location véhicule" ? "#dcfce7" :
                      f.type === "Assurance" ? "#fef3c7" :
                      f.type === "Vente pièce auto" ? "#ede9fe" :
                      f.type === "Entretiens et réparations" ? "#fee2e2" :
                      f.type === "Vente carburant" ? "#fed7aa" : "#f3f4f6",
                    color: 
                      f.type === "Vente de véhicule" ? "#1e40af" :
                      f.type === "Location véhicule" ? "#166534" :
                      f.type === "Assurance" ? "#92400e" :
                      f.type === "Vente pièce auto" ? "#5b21b6" :
                      f.type === "Entretiens et réparations" ? "#991b1b" :
                      f.type === "Vente carburant" ? "#c2410c" : "#374151",
                    border: `1px solid ${
                      f.type === "Vente de véhicule" ? "#93c5fd" :
                      f.type === "Location véhicule" ? "#86efac" :
                      f.type === "Assurance" ? "#fde68a" :
                      f.type === "Vente pièce auto" ? "#ddd6fe" :
                      f.type === "Entretiens et réparations" ? "#fecaca" :
                      f.type === "Vente carburant" ? "#fdba74" : "#d1d5db"
                    }`
                  }}>
                    {(f.type || 'Non spécifié').toUpperCase()}
                  </span>
                </td>
                <td style={{
                  padding: "16px 12px",
                  color: "black",
                  fontSize: "14px"
                }}>{f.email}</td>
                <td style={{
                  padding: "16px 12px",
                  color: "black",
                  fontSize: "14px"
                }}>{f.tel}</td>
                <td style={{
                  padding: "16px 12px",
                  color: "black",
                  fontSize: "14px"
                }}>{f.adresse}</td>
                <td style={{
                  padding: "16px 12px",
                  color: "black",
                  fontSize: "14px"
                }}>{f.ville}</td>
                <td style={{
                  padding: "16px 12px",
                  color: "black",
                  fontSize: "14px"
                }}>{f.code_postal}</td>
                <td style={{
                  padding: "16px 12px",
                  color: "black",
                  fontSize: "14px"
                }}>{f.contact}</td>
                <td style={{ padding: "16px 12px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEdit(f)}
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
                      onClick={() => handleDelete(f.id)}
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
      {filteredFournisseurs.length > 0 && (
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
    </div>
  );
}

export default Fournisseurs;