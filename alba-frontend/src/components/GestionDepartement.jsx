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
  const [showModal, setShowModal] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null); 
  const [form, setForm] = useState({ nom: "" });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/departements")
      .then(res => res.json())
      .then(data => setDepartements(data))
      .catch(err => console.error("Error fetching departements:", err));
  }, []);

  const handleChange = e => setForm({ nom: e.target.value });

  const handleEdit = departement => {
    setForm({ nom: departement.nom });
    setIsEditing(true);
    setEditingId(departement.id);
    setShowModal(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing 
      ? `http://127.0.0.1:8000/api/departements/${editingId}`
      : "http://127.0.0.1:8000/api/departements";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(data => {
        if (isEditing) {
          alert("Département modifié !");
          setDepartements(departements.map(d => d.id === editingId ? data.data : d));
        } else {
          alert("Département ajouté !");
          setDepartements([...departements, data.data]);
        }
        setForm({ nom: "" });
        setShowModal(false);
        setIsEditing(false);
        setEditingId(null);
      })
      .catch(err => console.error("Error:", err));
  };

  const handleDelete = id => {
    fetch(`http://127.0.0.1:8000/api/departements/${id}`, { method: "DELETE" })
      .then(() => setDepartements(departements.filter(d => d.id !== id)))
      .catch(err => console.error(err));
  };
  return (
    <div style={{ padding: "30px", backgroundColor: colors.offWhite, borderRadius: "12px" }}>
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
          Gestion des Départements
        </h2>
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
            {["ID","Nom","Actions"].map(col => (
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
          {departements.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ 
                textAlign: "center", 
                color: "#94a3b8", 
                padding: "40px 20px",
                fontSize: "14px",
                backgroundColor: "#fafbfc"
              }}>
                Aucun département disponible
              </td>
            </tr>
          ) : (
            departements.map((d, index) => (
              <tr key={d.id} style={{ 
                borderBottom: `1px solid ${index === departements.length - 1 ? "transparent" : "white"}`,
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
                      onClick={() => handleDelete(d.id)} 
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
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <button type="submit" style={{ flex: 1, padding: "10px", background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`, color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}>{isEditing ? "Modifier" : "Ajouter"}</button>
                <button type="button" onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setForm({ nom: "" });
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
