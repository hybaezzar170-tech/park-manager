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
    matricule: "", modele: "", num_serie: "", type_departement: "",
    departement_id: "", conducteur_id: "", marque: "", couleur: "",
    mise_en_circulation: "", carburant: "", etat: "disponible",
    prix_achat: "", date_achat: "", fournisseur_id: ""
  });
  const [departements, setDepartements] = useState([]);
  const [conducteurs, setConducteurs] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/departements").then(res=>res.json()).then(setDepartements);
    fetch("http://127.0.0.1:8000/api/conducteurs").then(res=>res.json()).then(setConducteurs);
    fetch("http://127.0.0.1:8000/api/fournisseurs").then(res=>res.json()).then(setFournisseurs);
    if(id) {
      fetch(`http://127.0.0.1:8000/api/voitures/${id}`)
        .then(res => res.json())
        .then(data => setForm(data));
    }
  }, [id]);
  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = async (e) => {
    e.preventDefault();
        const data = { ...form };
    data.conducteur_id = data.conducteur_id ? parseInt(data.conducteur_id) : null;
    data.fournisseur_id = data.fournisseur_id ? parseInt(data.fournisseur_id) : null;
    data.departement_id = data.departement_id ? parseInt(data.departement_id) : null;
    data.prix_achat = data.prix_achat ? parseFloat(data.prix_achat) : null;
    const url = id ? `http://127.0.0.1:8000/api/voitures/${id}` : "http://127.0.0.1:8000/api/voitures";
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
          matricule: "", modele: "", num_serie: "", type_departement: "",
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
              <input name="type_departement" placeholder=" Type Département" value={form.type_departement} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <select name="departement_id" value={form.departement_id} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: "#fff", color: colors.darkNavy, cursor: "pointer" }}>
                <option value=""> -- Département --</option>
                {departements.map(d=> <option key={d.id} value={d.id}>{d.nom}</option>)}
              </select>
              <select name="conducteur_id" value={form.conducteur_id} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: "#fff", color: colors.darkNavy, cursor: "pointer" }}>
                <option value=""> -- Conducteur --</option>
                {conducteurs.map(c=> <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>)}
              </select>
              <input name="marque" placeholder="Marque" value={form.marque} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input name="couleur" placeholder=" Couleur" value={form.couleur} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input type="date" name="mise_en_circulation" value={form.mise_en_circulation} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input name="carburant" placeholder=" Carburant" value={form.carburant} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input type="number" name="prix_achat" placeholder=" Prix Achat" value={form.prix_achat} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <input type="date" name="date_achat" placeholder=" Date Achat" value={form.date_achat} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}/>
              <select name="fournisseur_id" value={form.fournisseur_id} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: "#fff", color: colors.darkNavy, cursor: "pointer" }}>
                <option value="">-- Fournisseur --</option>
                {fournisseurs.filter(f => f.type === 'Vente de véhicule').map(f=> <option key={f.id} value={f.id}>{f.nom}</option>)}
              </select>
              <select name="etat" value={form.etat} onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: "#fff", color: colors.darkNavy, cursor: "pointer" }}>
                <option value="disponible"> Disponible</option>
                <option value="en_location">En Location</option>
                <option value="vendue">Vendue</option>
                <option value="en_maintenance">En Maintenance</option>
              </select>
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button type="submit" style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s" }}>Ajouter</button>
      </div>
      </form>
    </div>
  );
}
