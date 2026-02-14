import React, { useState, useEffect } from "react";
export default function FormLocation() {
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
    client: "",
    date_location: "",
    date_fin: "",
    prix_location: "",
    etat: "en_cours"
  });
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/voitures")
      .then(res => res.json())
      .then(data => {
        const dispo = data.filter(v => v.etat === "disponible");
        setVoitures(dispo);
      })
      .catch(err => console.error(err));
  }, []);
  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  const handleSubmit = async e => {
    e.preventDefault();
    const data = {
      ...form,
      voiture_id: form.voiture_id ? parseInt(form.voiture_id) : null,
      prix_location: form.prix_location ? parseFloat(form.prix_location) : null
    };
    try {
      const res = await fetch("http://127.0.0.1:8000/api/locations", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
      });
      const response = await res.json();
      if(res.ok){
        alert("Location enregistrée !");
        setForm({
          voiture_id: "",
          client: "",
          date_location: "",
          date_fin: "",
          prix_location: "",
          etat: "en_cours"
        });
      } else {
        console.error("Response:", response);
        const errorMsg = response.error || response.message || "Erreur lors de l'enregistrement";
        alert("Erreur: " + JSON.stringify(errorMsg));
      }

    } catch(err) {
      console.error("Error:", err);
      alert("Erreur réseau: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: colors.offWhite, borderRadius: "12px", border: `2px solid ${colors.deepRed}`, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <h3 style={{ color: colors.black, fontSize: "22px", fontWeight: 700, margin: "0 0 20px 0" }}>Formulaire Location</h3>
      <form onSubmit={(e) => { handleSubmit(e); }} style={{ display: "grid", gap: "15px" }}>
              <select name="voiture_id" value={form.voiture_id} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: "#fff", color: colors.darkNavy, cursor: "pointer" }}>
                <option value=""> Choisir voiture</option>
                {voitures.map(v => (
                  <option key={v.id} value={v.id}>{v.matricule} - {v.modele}</option>
                ))}
              </select>

              <input type="text" name="client" placeholder=" Nom du client" value={form.client} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }} />
              <input type="date" name="date_location" value={form.date_location} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }} />
              <input type="date" name="date_fin" value={form.date_fin} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }} />
              <input type="number" name="prix_location" placeholder=" Prix location" value={form.prix_location} onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }} />

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button type="submit" style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s" }}> Valider</button>
      </div>
      </form>
    </div>
  );
}
