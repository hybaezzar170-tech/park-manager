import React, { useEffect, useState } from "react";
export default function FormVoiture() {
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
  const id = null; 
  const [form, setForm] = useState({
    matricule: "", modele: "", num_serie: "",
    departement_id: "", conducteur_id: "", marque: "", couleur: "",
    mise_en_circulation: "", carburant: "", etat: "disponible",
    prix_achat: "", date_achat: "", fournisseur_id: ""
  });
  const [departements, setDepartements] = useState([]);
  const [conducteurs, setConducteurs] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [showFournisseurModal, setShowFournisseurModal] = useState(false);
  const [fournisseurForm, setFournisseurForm] = useState({
    nom: "",
    prenom: "",
    type: "Vente de véhicule",
    email: "",
    tel: "",
    fax: "",
    site_web: "",
    adresse: "",
    ville: "",
    code_postal: "",
    contact: ""
  });
  useEffect(() => {
    fetch("http://localhost:8000/api/departements").then(res=>res.json()).then(setDepartements);
    fetch("http://localhost:8000/api/conducteurs").then(res=>res.json()).then(setConducteurs);
    fetch("http://localhost:8000/api/fournisseurs").then(res=>res.json()).then(setFournisseurs);
    if(id) {
      fetch(`http://localhost:8000/api/voitures/${id}`)
        .then(res => res.json())
        .then(data => setForm(data));
    }
  }, [id]);
  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  
  const handleDepartementChange = (e) => {
    const departementId = e.target.value;
    setForm(prevForm => ({ ...prevForm, departement_id: departementId }));
  };

  const handleFournisseurChange = e => {
    setFournisseurForm({...fournisseurForm, [e.target.name]: e.target.value});
  };

  const handleAddFournisseur = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/fournisseurs", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(fournisseurForm)
      });
      
      if (res.ok) {
        const newFournisseur = await res.json();
        setFournisseurs([...fournisseurs, newFournisseur.data]);
        setForm(prevForm => ({ ...prevForm, fournisseur_id: newFournisseur.data.id }));
        setShowFournisseurModal(false);
        setFournisseurForm({
          nom: "",
          type: "Vente de véhicule",
          contact: "",
          email: "",
          telephone: "",
          adresse: ""
        });
        alert("Fournisseur ajouté avec succès");
      } else {
        alert("Erreur lors de l'ajout du fournisseur");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur de connexion");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
        const data = { ...form };
    data.conducteur_id = data.conducteur_id ? parseInt(data.conducteur_id) : null;
    data.fournisseur_id = data.fournisseur_id ? parseInt(data.fournisseur_id) : null;
    data.departement_id = data.departement_id ? parseInt(data.departement_id) : null;
    data.prix_achat = data.prix_achat ? parseFloat(data.prix_achat) : null;
    const url = id ? `http://localhost:8000/api/voitures/${id}` : "http://localhost:8000/api/voitures";
    const method = id ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      const response = await res.json();
      if(res.ok){
        alert(id ? "Voiture modifiée" : "Voiture ajoutée");
        setForm({
          matricule: "", modele: "", num_serie: "",
          departement_id: "", conducteur_id: "", marque: "", couleur: "",
          mise_en_circulation: "", carburant: "", etat: "disponible",
          prix_achat: "", date_achat: "", fournisseur_id: ""
        });
      } else {
        const errorMsg = response.message || response.errors || "Erreur serveur";
        console.error("Response:", response);
        console.error("Full Response:", res.status, res.statusText);
        alert("Erreur: " + JSON.stringify(errorMsg));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur de connexion: " + error.message);
    }
  };
  return (
    <div style={{ padding: "20px", backgroundColor: colors.offWhite, borderRadius: "12px", border: `2px solid ${colors.deepRed}`, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <h3 style={{ color: colors.black, fontSize: "22px", fontWeight: 700, margin: "0 0 20px 0" }}>Achat Voiture</h3>
      <form onSubmit={(e) => { handleSubmit(e); }} style={{ display: "grid", gap: "15px" }}>
              <input name="matricule" placeholder="Matricule" value={form.matricule} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input name="modele" placeholder=" Modèle" value={form.modele} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input name="num_serie" placeholder=" Num Série" value={form.num_serie} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <select name="departement_id" value={form.departement_id} onChange={handleDepartementChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: "#fff", color: colors.darkNavy, cursor: "pointer" }}>
                <option value=""> -- Département --</option>
                {departements.map(d=> <option key={d.id} value={d.id}>{d.nom}</option>)}
              </select>
              <select name="conducteur_id" value={form.conducteur_id} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: "#fff", color: colors.darkNavy, cursor: "pointer" }}>
                <option value=""> -- Conducteur (optionnel) --</option>
                {conducteurs.map(c=> <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>)}
              </select>
              <input name="marque" placeholder="Marque" value={form.marque} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input name="couleur" placeholder=" Couleur" value={form.couleur} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input type="date" name="mise_en_circulation" value={form.mise_en_circulation} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <select name="carburant" value={form.carburant} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: "#fff", color: colors.darkNavy, cursor: "pointer" }}>
                <option value="">-- Carburant --</option>
                <option value="essence">Essence</option>
                <option value="diesel">Diesel</option>
                <option value="hybride">Hybride</option>
                <option value="electrique">Électrique</option>
                <option value="gpl">GPL</option>
                <option value="gaz">Gaz</option>
              </select>
              <input type="number" name="prix_achat" placeholder=" Prix Achat" value={form.prix_achat} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input type="date" name="date_achat" placeholder=" Date Achat" value={form.date_achat} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select name="fournisseur_id" value={form.fournisseur_id} onChange={handleChange} style={{ flex: 1, padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: "#fff", color: colors.darkNavy, cursor: "pointer" }}>
                  <option value="">-- Fournisseur --</option>
                  {fournisseurs.filter(f => f.type === 'Vente de véhicule').map(f=> <option key={f.id} value={f.id}>{f.nom}</option>)}
                </select>
                <button 
                  type="button" 
                  style={{ 
                    padding: "12px 20px", 
                    background: `linear-gradient(135deg, ${colors.grayTaupe} 0%, ${colors.mediumGray} 100%)`, 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "8px", 
                    cursor: "pointer", 
                    fontWeight: 600, 
                    fontSize: "14px", 
                    transition: "all 0.3s",
                    whiteSpace: "nowrap"
                  }}
                  onClick={() => {
                    setShowFournisseurModal(true);
                  }}
                >
                  + Nouveau Fournisseur
                </button>
              </div>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button type="submit" style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s" }}>Ajouter</button>
      </div>
      </form>
      
      {/* Modal d'ajout de fournisseur - Formulaire complet */}
      {showFournisseurModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: colors.offWhite,
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
                color: colors.black, 
                margin: 0, 
                fontSize: "20px", 
                fontWeight: 700 
              }}>
                Ajouter un Fournisseur
              </h3>
              <button
                onClick={() => setShowFournisseurModal(false)}
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
            
            <form onSubmit={handleAddFournisseur} style={{ display: "grid", gap: "15px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Nom</label>
                  <input
                    name="nom"
                    placeholder="Nom"
                    value={fournisseurForm.nom}
                    onChange={handleFournisseurChange}
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
                    name="prenom"
                    placeholder="Prénom"
                    value={fournisseurForm.prenom || ""}
                    onChange={handleFournisseurChange}
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
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={fournisseurForm.email}
                    onChange={handleFournisseurChange}
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
                    name="tel"
                    type="tel"
                    placeholder="Téléphone"
                    value={fournisseurForm.tel || ""}
                    onChange={handleFournisseurChange}
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
                    value={fournisseurForm.type}
                    onChange={handleFournisseurChange}
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
                    name="fax"
                    type="tel"
                    placeholder="Fax"
                    value={fournisseurForm.fax || ""}
                    onChange={handleFournisseurChange}
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
                  name="site_web"
                  type="url"
                  placeholder="Site Web"
                  value={fournisseurForm.site_web || ""}
                  onChange={handleFournisseurChange}
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
                  name="adresse"
                  placeholder="Adresse"
                  value={fournisseurForm.adresse}
                  onChange={handleFournisseurChange}
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
                  <label style={{ color: colors.darkGray, marginBottom: "5px", fontSize: "14px", fontWeight: "500" }}>Ville</label>
                  <input
                    name="ville"
                    placeholder="Ville"
                    value={fournisseurForm.ville || ""}
                    onChange={handleFournisseurChange}
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
                    name="code_postal"
                    placeholder="Code Postal"
                    value={fournisseurForm.code_postal || ""}
                    onChange={handleFournisseurChange}
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
                    name="contact"
                    placeholder="Contact"
                    value={fournisseurForm.contact}
                    onChange={handleFournisseurChange}
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
            </form>
            
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => setShowFournisseurModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: colors.grayTaupe,
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px"
                }}
              >
                Annuler
              </button>
              
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "12px",
                  background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`,
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px"
                }}
              >
                Ajouter le fournisseur
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
