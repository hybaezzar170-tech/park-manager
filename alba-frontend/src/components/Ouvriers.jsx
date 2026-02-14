import React, { useState, useEffect } from "react";

const Ouvriers = () => {
  const [ouvriers, setOuvriers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOuvrier, setEditingOuvrier] = useState(null);
  const [loading, setLoading] = useState(true);

  const colors = {
    black: "#000000",
    darkGray: "#1a1a1a",
    mediumGray: "#333333",
    lightGray: "#666666",
    offWhite: "#f5f5f5",
    darkBurgundy: "#3C0007",
    deepRed: "#800C1F",
    grayTaupe: "#929CAA",
    lightBlue: "#e3f2fd"
  };

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    type: 'technicien',
    telephone: '',
    email: '',
    salaire: '',
    date_embauche: '',
    statut: 'actif',
    adresse: ''
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les ouvriers selon le terme de recherche
  const filteredOuvriers = ouvriers.filter(ouvrier => 
    ouvrier.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ouvrier.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ouvrier.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const typesOuvrier = ['technicien', 'mecanicien'];

  const fetchOuvriers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/ouvriers");
      const data = await response.json();
      console.log("Ouvriers data:", data); // Debug log
      setOuvriers(data.data || data); // Gérer les deux formats de réponse
    } catch (error) {
      console.error("Error fetching ouvriers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOuvriers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingOuvrier 
        ? `http://127.0.0.1:8000/api/ouvriers/${editingOuvrier.id}`
        : "http://127.0.0.1:8000/api/ouvriers";
      
      const method = editingOuvrier ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchOuvriers();
        setShowForm(false);
        setEditingOuvrier(null);
        setFormData({
          nom: '',
          prenom: '',
          type: 'technicien',
          telephone: '',
          email: '',
          salaire: '',
          date_embauche: '',
          statut: 'actif',
          adresse: ''
        });
        alert(editingOuvrier ? "Ouvrier modifié avec succès!" : "Ouvrier ajouté avec succès!");
      } else {
        alert("Erreur lors de l'opération");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur de connexion");
    }
  };

  const handleEdit = (ouvrier) => {
    setEditingOuvrier(ouvrier);
    setFormData({
      nom: ouvrier.nom,
      prenom: ouvrier.prenom,
      type: ouvrier.type || 'technicien',
      telephone: ouvrier.telephone || '',
      email: ouvrier.email || '',
      salaire: ouvrier.salaire || '',
      date_embauche: ouvrier.date_embauche || '',
      statut: ouvrier.statut,
      adresse: ouvrier.adresse || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet ouvrier?")) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/ouvriers/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchOuvriers();
          alert("Ouvrier supprimé avec succès!");
        } else {
          alert("Erreur lors de la suppression");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Erreur de connexion");
      }
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: colors.offWhite }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "25px"
      }}>
        <h2 style={{ 
          color: colors.darkGray, 
          fontSize: "28px", 
          fontWeight: "700" 
        }}>
          Gestion des Ouvriers
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
              setEditingOuvrier(null);
              setFormData({
                nom: '',
                prenom: '',
                type: 'technicien',
                telephone: '',
                email: '',
                salaire: '',
                date_embauche: '',
                statut: 'actif',
                adresse: ''
              });
              setShowForm(true);
          }}
          style={{
            padding: "12px 24px",
            backgroundColor: colors.deepRed,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.3s",
            boxShadow: `0 4px 12px rgba(128, 12, 31, 0.3)`
          }}
        >
          + Ajouter Ouvrier
        </button>
        </div>
      </div>

      {showForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                {editingOuvrier ? "Modifier l'Ouvrier" : "Ajouter un Ouvrier"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingOuvrier(null);
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Nom </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: "10px 12px",
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit"
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Prénom </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: "10px 12px",
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Type </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    style={{
                      padding: "10px 12px",
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      cursor: "pointer"
                    }}
                  >
                    {typesOuvrier.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    style={{
                      padding: "10px 12px",
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Salaire</label>
                  <input
                    type="number"
                    name="salaire"
                    value={formData.salaire}
                    onChange={handleInputChange}
                    step="0.01"
                    style={{
                      padding: "10px 12px",
                      border: `2px solid ${colors.lightGray}`,
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
                    value={formData.date_embauche}
                    onChange={handleInputChange}
                    style={{
                      padding: "10px 12px",
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Statut</label>
                <select
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  style={{
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightGray}                                                                                                                                                                                                                                                                                                                                                                               Gray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    cursor: "pointer"
                  }}
                >
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Adresse</label>
                <textarea
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical"
                  }}
                />
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
                  {editingOuvrier ? "Modifier" : "Ajouter"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
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
          Liste des Ouvriers ({filteredOuvriers.length})
        </h3>

        {filteredOuvriers.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: colors.lightGray,
            fontSize: "16px"
          }}>
            {searchTerm ? "Aucun ouvrier trouvé pour cette recherche" : "Aucun ouvrier trouvé"}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
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
                  {["Nom","Prénom","Type","Téléphone","Email","Statut","Actions"].map(col => (
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
                {ouvriers.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ 
                      textAlign: "center", 
                      color: "#94a3b8", 
                      padding: "40px 20px",
                      fontSize: "14px",
                      backgroundColor: "#fafbfc"
                    }}>
                      Aucun ouvrier disponible
                    </td>
                  </tr>
                ) : (
                  filteredOuvriers.map((ouvrier, index) => (
                    <tr key={ouvrier.id} style={{ 
                      borderBottom: `1px solid ${index === filteredOuvriers.length - 1 ? "transparent" : "white"}`,
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "white",
                      transition: "all 0.2s ease"
                    }}>
                      <td style={{ 
                        padding: "16px 12px", 
                        color: "black",
                        fontWeight: "500",
                        fontSize: "14px"
                      }}>{ouvrier.nom}</td>
                      <td style={{ 
                        padding: "16px 12px", 
                        color: "black",
                        fontWeight: "500",
                        fontSize: "14px"
                      }}>{ouvrier.prenom}</td>
                      <td style={{ padding: "16px 12px" }}>
                        <span style={{
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          backgroundColor: ouvrier.type === 'technicien' ? "#dbeafe" : "#fed7aa",
                          color: ouvrier.type === 'technicien' ? "#1e40af" : "#c2410c",
                          border: `1px solid ${ouvrier.type === 'technicien' ? "#93c5fd" : "#fdba74"}`
                        }}>
                          {(ouvrier.type || 'technicien').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ 
                        padding: "16px 12px", 
                        color: "black",
                        fontSize: "14px"
                      }}>{ouvrier.telephone || '-'}</td>
                      <td style={{ 
                        padding: "16px 12px", 
                        color: "black",
                        fontSize: "14px"
                      }}>{ouvrier.email || '-'}</td>
                      <td style={{ padding: "16px 12px" }}>
                        <span style={{
                          padding: "6px 10px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "#fff",
                          backgroundColor: ouvrier.statut === 'actif' ? '#22c55e' : '#ef4444'
                        }}>
                          {ouvrier.statut?.toUpperCase() || 'INCONNU'}
                        </span>
                      </td>
                      <td style={{ padding: "16px 12px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => handleEdit(ouvrier)}
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
                            onClick={() => handleDelete(ouvrier.id)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Ouvriers;
