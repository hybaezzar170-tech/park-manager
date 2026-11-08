import React, { useState, useEffect } from "react";

// Fonction pour générer un PDF de la liste
const generatePDF = (pieces, title) => {
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
      <h1>Liste des Pièces</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Modèle</th>
            <th>Quantité</th>
            <th>Prix d'achat</th>
            <th>Fournisseur</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          ${pieces.map(piece => `
            <tr>
              <td>${piece.id}</td>
              <td>${piece.nom || ''}</td>
              <td>${piece.modele || ''}</td>
              <td>${piece.quantite || ''}</td>
              <td>${piece.prix_achat || ''}</td>
              <td>${piece.fournisseur_nom || ''}</td>
              <td>${piece.type_piece || ''}</td>
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
const Pieces = () => {
  const [pieces, setPieces] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPiece, setEditingPiece] = useState(null);
  const [loading, setLoading] = useState(true);
  const colors = {
     black:"#000000",darkGray:"#1a1a1a",mediumGray:"#333333",lightGray:"#666666",offWhite:"#f5f5f5",darkBurgundy:"#3C0007",deepRed:"#800C1F",grayTaupe:"#929CAA",lightBlue:"#e3f2fd"};
  const [formData, setFormData] = useState({
    nom:'',modele:'',quantite:'',prix_achat:'',fournisseur_id:'',type_piece:'',description:'',notes:''});
  const fetchPieces = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/pieces");
      const data = await response.json();
      console.log("Pieces data:", data);
      console.log("Pieces data type:", typeof data);
      console.log("Pieces is array:", Array.isArray(data));
      const piecesArray = Array.isArray(data) ? data : (data.data || []);
      console.log("Pieces array:", piecesArray);
      console.log("Pieces array length:", piecesArray.length);
            const filteredPieces = piecesArray.filter(piece => {
        console.log("Processing piece:", piece);
        console.log("Piece fournisseur:", piece.fournisseur);
        if (!piece.fournisseur) {
          console.log("Piece excluded: no fournisseur");
          return false;
        }
        const isAutoSupplier = piece.fournisseur.type === 'Vente pièce auto';
        console.log("Piece fournisseur type:", piece.fournisseur.type);
        console.log("Is auto supplier:", isAutoSupplier);
        return isAutoSupplier;
      });
      console.log("Filtered pieces (Vente pièce auto only):", filteredPieces);
      console.log("Filtered pieces length:", filteredPieces.length);
      setPieces(filteredPieces);
    } catch (error) {
      console.error("Error fetching pieces:", error);
      setPieces([]); 
    } finally {
      setLoading(false);
    }
  };
  const fetchFournisseurs = async () => {
    try {
      let response = await fetch("http://localhost:8000/api/fournisseurs/pieces-suppliers");
      let data = await response.json();
      console.log("Fournisseurs pièces raw:", data);
            if (!response.ok || (Array.isArray(data) ? data.length === 0 : (!data.data || data.data.length === 0))) {
        console.log("Essai avec l'endpoint général des fournisseurs...");
        response = await fetch("http://localhost:8000/api/fournisseurs");
        data = await response.json();
        console.log("Fournisseurs généraux raw:", data);
                const allFournisseurs = Array.isArray(data) ? data : (data.data || []);
        const fournisseursArray = allFournisseurs.filter(f => f.type === 'Vente pièce auto');
        console.log("Fournisseurs filtrés:", fournisseursArray);
        setFournisseurs(fournisseursArray);
      } else {
        const fournisseursArray = Array.isArray(data) ? data : (data.data || []);
        console.log("Fournisseurs pièces array:", fournisseursArray);
        setFournisseurs(fournisseursArray);
      }
    } catch (error) {
      console.error("Error fetching fournisseurs:", error);
      setFournisseurs([]); 
    }
  };
  useEffect(() => {
    fetchPieces();
    fetchFournisseurs();
  }, []);
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
    try {
      const url = editingPiece ? `http://localhost:8000/api/pieces/${editingPiece.id}` : "http://localhost:8000/api/pieces";
      const method = editingPiece ? 'PUT' : 'POST';
      console.log(`Making ${method} request to:`, url);
      console.log("Request body:", JSON.stringify(formData, null, 2));
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const responseData = await response.json();
      console.log("Success response:", responseData);
      if (response.ok) {
        fetchPieces();
        setShowForm(false);
        setEditingPiece(null);
        setFormData({
          nom: '',
          modele: '',
          quantite: '',
          prix_achat: '',
          fournisseur_id: '',
          type_piece: '',
          description: '',
          notes: ''
        });
        alert(editingPiece ? "Pièce modifiée avec succès!" : "Pièce ajoutée avec succès!");
      } else {
        alert("Erreur lors de l'opération");
      }
    } catch (error) {
      console.error("Full error details:", error);
      alert("Erreur de connexion: " + error.message);
    }
  };
  const handleEdit = (piece) => {
    setEditingPiece(piece);
    setFormData({
      nom: piece.nom,
      modele: piece.modele || '',
      quantite: piece.quantite || '',
      prix_achat: piece.prix_achat || '',
      fournisseur_id: piece.fournisseur_id || '',
      type_piece: piece.type_piece || '',
      description: piece.description || '',
      notes: piece.notes || ''
    });
    setShowForm(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette pièce?")) {
      try {
        const response = await fetch(`http://localhost:8000/api/pieces/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchPieces();
          alert("Pièce supprimée avec succès!");
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
    <div style={{ padding: "20px", backgroundColor: colors.white }}>
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
          Gestion des Pièces
        </h2>
        <button
          onClick={() => {
            setEditingPiece(null);
            setFormData({
              nom: '',
              modele: '',
              quantite: '',
              prix_achat: '',
              fournisseur_id: '',
              type_piece: '',
              description: '',
              notes: ''
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
          Ajouter Pièce
        </button>
        <button 
          onClick={() => generatePDF(pieces, "Liste des Pièces")}
          style={{
            padding: "12px 24px",
            backgroundColor: colors.mediumGray,
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.3s",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            marginLeft: "10px"
          }}
        >
          PDF
        </button>
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
                {editingPiece ? "Modifier la Pièce" : "Ajouter une Pièce"}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPiece(null);
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
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    style={{
                      placeholder: "Nom de la pièce",
                      padding: "10px 12px",
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit"
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Modèle</label>
                  <input
                    type="text"
                    name="modele"
                    value={formData.modele}
                    onChange={handleInputChange}
                    required
                    style={{
                      placeholder:"Modele de la pièce",
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Type de pièce *</label>
                  <input
                    type="text"
                    name="type_piece"
                    value={formData.type_piece}
                    onChange={handleInputChange}
                    required
                    style={{
                      placeholder: "Type de la pièce",
                      padding: "10px 12px",
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit"
                    }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Quantité </label>
                  <input
                    type="number"
                    name="quantite"
                    value={formData.quantite}
                    onChange={handleInputChange}
                    required
                    min="0"
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Prix d'achat</label>
                  <input
                    type="number"
                    name="prix_achat"
                    value={formData.prix_achat}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Fournisseur</label>
                  <select
                    name="fournisseur_id"
                    value={formData.fournisseur_id}
                    onChange={handleInputChange}
                    style={{
                      padding: "10px 12px",
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      cursor: "pointer"
                    }}
                  >
                    <option value="">Sélectionner un fournisseur...</option>
                    {Array.isArray(fournisseurs) && fournisseurs.map(fournisseur => (
                      <option key={fournisseur.id} value={fournisseur.id}>
                        {fournisseur.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.darkGray, fontSize: "14px", fontWeight: "500" }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Description détaillée de la pièce..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical"
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.darkGray, fontSize: "14px", fontWeight: "500" }}>
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  rows="2"
                  style={{
                    placeholder: "Notes supplémentaires...",
                    width: "100%",
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
                    backgroundColor: colors.deepRed,
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  {editingPiece ? "Modifier" : "Ajouter"}
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
          Liste des Pièces
        </h3>

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
            {["Nom","Modèle","Type","Quantité","Prix","Fournisseur","Actions"].map(col => (
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
          {pieces.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ 
                textAlign: "center", 
                color: "#94a3b8", 
                padding: "40px 20px",
                fontSize: "14px",
                backgroundColor: "#fafbfc"
              }}>
                Aucune pièce disponible
              </td>
            </tr>
          ) : (
            pieces.map((piece, index) => (
              <tr key={piece.id} style={{ 
                borderBottom: `1px solid ${index === pieces.length - 1 ? "transparent" : "white"}`,
                backgroundColor: index % 2 === 0 ? "#ffffff" : "white",
                transition: "all 0.2s ease"
              }}>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>
                  {piece.nom}
                </td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontSize: "14px"
                }}>
                  {piece.modele || '-'}
                </td>
                <td style={{ padding: "16px 12px" }}>
                  <span style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "20px",
                    fontWeight: "600",
                  }}>
                    {piece.type_piece || '-'}
                  </span>
                </td>
                <td style={{ padding: "16px 12px" }}>
                  <span style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    backgroundColor: (piece.quantite || 0) > 10 ? "#dcfce7" : 
                                     (piece.quantite || 0) > 5 ? "#fef3c7" : 
                                     (piece.quantite || 0) > 0 ? "#fee2e2" : "#f1f5f9",
                    color: (piece.quantite || 0) > 10 ? "#166534" : 
                           (piece.quantite || 0) > 5 ? "#92400e" : 
                           (piece.quantite || 0) > 0 ? "#991b1b" : "#64748b",
                    border: `1px solid ${
                      (piece.quantite || 0) > 10 ? "#bbf7d0" : 
                      (piece.quantite || 0) > 5 ? "#fde68a" : 
                      (piece.quantite || 0) > 0 ? "#fecaca" : "#e2e8f0"
                    }`
                  }}>
                    {piece.quantite || 0}
                  </span>
                </td>
                <td style={{ 
                  padding: "16px 12px", 
                  color:"black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>
                  {piece.prix_achat ? `${piece.prix_achat}` : '-'}
                </td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontSize: "14px"
                }}>
                  {piece.fournisseur ? piece.fournisseur.nom : '-'}
                </td>
                <td style={{ padding: "16px 12px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => handleEdit(piece)} 
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
                        boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)"
                      }}
                      onMouseOver={(e) => e.target.style.background = colors.deepRed}
                      onMouseOut={(e) => e.target.style.background = colors.deepRed}
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(piece.id)} 
                      style={{ 
                        background: colors.black,
                        padding: "8px 12px", 
                        color: "white", 
                        border: "none", 
                        borderRadius: "6px", 
                        cursor: "pointer", 
                        fontSize: "12px", 
                        fontWeight: "500",
                        transition: "all 0.2s ease",
                        boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)"
                      }}
                      onMouseOver={(e) => e.target.style.background = colors.black}
                      onMouseOut={(e) => e.target.style.background = colors.black}
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
    </div>
  );
};

export default Pieces;
