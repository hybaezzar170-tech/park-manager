import React, { useState, useEffect } from "react";
function GestionUtilisateurs() {
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
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    telephone: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Filtrer les utilisateurs selon le terme de recherche
  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.role && user.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.telephone && user.telephone.includes(searchTerm))
  );
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch("http://localhost:8000/api/users", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Token expiré ou invalide, rediriger vers login
            localStorage.removeItem('authToken');
            // window.location.reload(); // Supprimé - pas de redirection automatique
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Impossible de se connecter au serveur. Vérifiez que le serveur est en cours d'exécution.");
      }
    };
    
    fetchUsers();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch("http://localhost:8000/api/users", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'ajout de l'utilisateur");
      }
      setUsers([...users, data]);
      setForm({ name: "", email: "", password: "", role: "user", telephone: "" });
      setShowModal(false);
      alert("Utilisateur ajouté avec succès!");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Erreur lors de la communication avec le serveur");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async id => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8000/api/users/${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la suppression");
      }
      
      setUsers(users.filter(u => u.id !== id));
      alert("Utilisateur supprimé avec succès!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: colors.White }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ color: colors.black, fontSize: "28px", fontWeight: 700, margin: 0 }}> Gestion des Utilisateurs</h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Rechercher par nom, email ou rôle..."
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
          <button onClick={() => { setShowModal(true); setForm({ name: "", email: "", password: "", role: "user", telephone: "" }); }} style={{ padding: "12px 24px", background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s", boxShadow: `0 4px 12px rgba(128, 12, 31, 0.3)` }}>+ Ajouter Utilisateur</button>
        </div>
      </div>
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", border: `3px solid ${colors.steelBlue}`, padding: "30px", maxWidth: "500px", width: "90%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ color: colors.darkNavy, fontSize: "22px", fontWeight: 700, margin: 0 }}> Ajouter Utilisateur</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: colors.grayTaupe }}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
              <input type="text" name="name" placeholder=" Nom complet" value={form.name} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input type="tel" name="telephone" placeholder="Téléphone (optionnel)" value={form.telephone} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input type="password" name="password" placeholder="Mot de passe" value={form.password} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <select name="role" value={form.role} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: "#fff", color: colors.darkNavy, cursor: "pointer" }}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" disabled={loading} style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s", opacity: loading ? 0.6 : 1 }}>{loading ? "Ajout..." : "Ajouter"}</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: "12px", backgroundColor: colors.grayTaupe, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s" }}>Annuler</button>
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
            {["ID","Nom","Email","Téléphone","Rôle","Actions"].map(col => (
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
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ 
                textAlign: "center", 
                color: "#94a3b8", 
                padding: "40px 20px",
                fontSize: "14px",
                backgroundColor: "#fafbfc"
              }}>
                {searchTerm ? "Aucun utilisateur trouvé pour cette recherche" : "Aucun utilisateur disponible"}
              </td>
            </tr>
          ) : (
            filteredUsers.map((u, index) => (
              <tr key={u.id} style={{ 
                borderBottom: `1px solid ${index === filteredUsers.length - 1 ? "transparent" : "white"}`,
                backgroundColor: index % 2 === 0 ? "#ffffff" : "white",
                transition: "all 0.2s ease"
              }}>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{u.id}</td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontWeight: "500",
                  fontSize: "14px"
                }}>{u.name}</td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontSize: "14px"
                }}>{u.email}</td>
                <td style={{ 
                  padding: "16px 12px", 
                  color: "black",
                  fontSize: "14px"
                }}>{u.telephone || '-'}</td>
                <td style={{ padding: "16px 12px" }}>
                  <span style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    backgroundColor: u.role === "admin" ? "#fee2e2" : "#e5e7eb",
                    color: u.role === "admin" ? "#991b1b" : "#374151",
                    border: `1px solid ${u.role === "admin" ? "#fecaca" : "#d1d5db"}`
                  }}>
                    {(u.role || 'user') ? (u.role || 'user').toUpperCase() : 'USER'}
                  </span>
                </td>
                <td style={{ padding: "16px 12px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button 
                      onClick={() => handleDelete(u.id)} 
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
  );
}

export default GestionUtilisateurs;
