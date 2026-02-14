import React, { useEffect, useState } from "react";
export default function FormVente() {
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
  const [form, setForm] = useState({
    voiture_id: "",
    acheteur: "",
    prix_vente: "",
    date_vente: ""
  });
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/voitures")
      .then(res => res.json())
      .then(data => {
        const disponibles = data.filter(v => v.etat === "disponible");
        setVoitures(disponibles);
      });
  }, []);
  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/api/ventes", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if(res.ok){
      alert("Vente enregistrée");
    } else {
      alert(data.error);
    }
  };
  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "900px", 
      backgroundColor: colors.offWhite, 
      borderRadius: "12px", 
      border: `2px solid ${colors.deepRed}`, 
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)" 
    }}>
      <h3 style={{ color: colors.black, fontSize: "22px", fontWeight: 700, margin: "0 0 20px 0" }}>Formulaire Vente</h3>
      <form onSubmit={(e) => { handleSubmit(e); }} style={{ display: "grid", gap: "15px" }}>
              <select name="voiture_id" onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: colors.offWhite, color: colors.darkNavy, cursor: "pointer" }}>
                <option value="">Choisir voiture</option>
              {voitures.map(v => (
                <option key={v.id} value={v.id}>
                  {v.matricule} - {v.modele}
                </option>
              ))}
              </select>
              <input type="text" name="acheteur" placeholder=" Nom acheteur" onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }} />
              <input type="number" name="prix_vente" placeholder=" Prix vente" onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }} />
              <input type="date" name="date_vente" onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }} />
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button type="submit" style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s" }}> Valider</button>
      </div>
      </form>
    </div>
  );
}
