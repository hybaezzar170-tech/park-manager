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
  const [clients, setClients] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientForm, setClientForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: ""
  });
  const [form, setForm] = useState({
    voiture_id: "",
    client_id: "",
    departement_id: "",
    prix_vente: "",
    date_vente: ""
  });
  useEffect(() => {
    // Charger les voitures disponibles
    fetch("http://localhost:8000/api/voitures")
      .then(res => res.json())
      .then(data => {
        const voituresArray = Array.isArray(data) ? data : (data.data || []);
        const disponibles = voituresArray.filter(v => v.etat === "disponible");
        setVoitures(disponibles);
      });
    
    // Charger les clients
    fetch("http://localhost:8000/api/clients")
      .then(res => res.json())
      .then(data => {
        const clientsArray = Array.isArray(data) ? data : (data.data || []);
        setClients(clientsArray);
      });
    
    // Charger les départements
    fetch("http://localhost:8000/api/departements")
      .then(res => res.json())
      .then(data => {
        const departementsArray = Array.isArray(data) ? data : (data.data || []);
        setDepartements(departementsArray);
      });
  }, []);
  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleClientChange = e => {
    setClientForm({...clientForm, [e.target.name]: e.target.value});
  };

  const handleAddClient = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/clients", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(clientForm)
      });
      
      if (res.ok) {
        const newClient = await res.json();
        setClients([...clients, newClient.data]);
        setForm(prevForm => ({ ...prevForm, client_id: newClient.data.id }));
        setShowClientModal(false);
        setClientForm({
          nom: "",
          prenom: "",
          email: "",
          telephone: "",
          adresse: ""
        });
        alert("Client ajouté avec succès");
      } else {
        alert("Erreur lors de l'ajout du client");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erreur de connexion");
    }
  };

  // Filtrer les voitures par département
  const filteredVoitures = form.departement_id 
    ? voitures.filter(v => v.departement_id == form.departement_id)
    : voitures;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/api/ventes", {
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
              <select name="departement_id" onChange={handleChange} style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: colors.offWhite, color: colors.darkNavy, cursor: "pointer" }}>
                <option value="">-- Tous les départements --</option>
                {Array.isArray(departements) && departements.map(d => (
                  <option key={d.id} value={d.id}>{d.nom}</option>
                ))}
              </select>
              
              <select name="voiture_id" onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: colors.offWhite, color: colors.darkNavy, cursor: "pointer" }}>
                <option value="">Choisir voiture</option>
                {Array.isArray(filteredVoitures) && filteredVoitures.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.matricule} - {v.modele} {v.departement ? `(${v.departement.nom})` : ''}
                  </option>
                ))}
              </select>
              
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <select name="client_id" onChange={handleChange} required style={{ flex: 1, padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit", backgroundColor: colors.offWhite, color: colors.darkNavy, cursor: "pointer" }}>
                  <option value="">-- Choisir un client --</option>
                  {Array.isArray(clients) && clients.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.nom} {c.prenom}
                    </option>
                  ))}
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
                    setShowClientModal(true);
                  }}
                >
                  + Nouveau Client
                </button>
              </div>
              
              <input type="number" name="prix_vente" placeholder=" Prix vente" onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }} />
              <input type="date" name="date_vente" onChange={handleChange} required style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }} />
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button type="submit" style={{ flex: 1, padding: "12px", background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`, color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "14px", transition: "all 0.3s" }}> Valider</button>
      </div>
      </form>
      
      {/* Modal d'ajout de client */}
      {showClientModal && (
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
            maxWidth: "500px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
          }}>
            <h3 style={{ color: colors.black, fontSize: "20px", fontWeight: 700, margin: "0 0 20px 0" }}>
              Ajouter un Client
            </h3>
            
            <div style={{ display: "grid", gap: "15px" }}>
              <input
                name="nom"
                placeholder="Nom du client"
                value={clientForm.nom}
                onChange={handleClientChange}
                required
                style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              
              <input
                name="prenom"
                placeholder="Prénom du client"
                value={clientForm.prenom}
                onChange={handleClientChange}
                style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={clientForm.email}
                onChange={handleClientChange}
                style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              
              <input
                name="telephone"
                placeholder="Téléphone"
                value={clientForm.telephone}
                onChange={handleClientChange}
                style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
              
              <input
                name="adresse"
                placeholder="Adresse"
                value={clientForm.adresse}
                onChange={handleClientChange}
                style={{ padding: "12px 15px", border: `2px solid ${colors.lightBlue}`, borderRadius: "8px", fontSize: "14px", fontFamily: "inherit" }}
              />
            </div>
            
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                onClick={() => setShowClientModal(false)}
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
                type="button"
                onClick={handleAddClient}
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
                Ajouter le client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
