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
  const [voituresFiltrees, setVoituresFiltrees] = useState([]);
  const [clients, setClients] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [selectedDepartement, setSelectedDepartement] = useState("");
  const [form, setForm] = useState({
    voiture_ids: [],
    client: "",
    date_location: "",
    date_fin: "",
    prix_location: "",
    etat: "en_cours"
  });
  const [clientForm, setClientForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    adresse: ""
  });

  // Charger les données initiales
  useEffect(() => {
    // Charger les voitures disponibles
    fetch("http://localhost:8000/api/voitures")
      .then(res => res.json())
      .then(data => {
        const dispo = Array.isArray(data) ? data.filter(v => v.etat === "disponible") : [];
        setVoitures(dispo);
        setVoituresFiltrees(dispo);
      })
      .catch(err => console.error(err));

    // Charger les clients
    fetch("http://localhost:8000/api/clients")
      .then(res => res.json())
      .then(data => {
        setClients(Array.isArray(data) ? data : (data.data || []));
      })
      .catch(err => console.error(err));

    // Charger les départements
    fetch("http://localhost:8000/api/departements")
      .then(res => res.json())
      .then(data => {
        setDepartements(Array.isArray(data) ? data : (data.data || []));
      })
      .catch(err => console.error(err));

    // Charger les locations existantes
    fetch("http://localhost:8000/api/locations")
      .then(res => res.json())
      .then(data => {
        setLocations(data.data || data || []);
        checkAndUpdateExpiredLocations(data.data || data || []);
      })
      .catch(err => console.error(err));
  }, []);

  // Filtrer les voitures par département
  useEffect(() => {
    if (selectedDepartement) {
      const filtrees = voitures.filter(v => 
        v.departement_id && v.departement_id.toString() === selectedDepartement
      );
      setVoituresFiltrees(filtrees);
    } else {
      setVoituresFiltrees(voitures);
    }
  }, [selectedDepartement, voitures]);

  // Vérification périodique des locations expirées
  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:8000/api/locations")
        .then(res => res.json())
        .then(data => {
          checkAndUpdateExpiredLocations(data.data || data || []);
        })
        .catch(err => console.error(err));
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, []);

  const checkAndUpdateExpiredLocations = async (locationsData) => {
    const today = new Date();
    
    for (const location of locationsData) {
      if (location.date_fin && location.etat === "en_cours") {
        const endDate = new Date(location.date_fin);
        
        if (endDate <= today) {
          try {
            await fetch(`http://localhost:8000/api/locations/${location.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ etat: "terminée" }),
            });

            await fetch(`http://localhost:8000/api/voitures/${location.voiture_id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ etat: "disponible" }),
            });

            console.log(`Location ${location.id} terminée et voiture ${location.voiture_id} mise en disponible`);
          } catch (error) {
            console.error("Erreur lors de la mise à jour automatique:", error);
          }
        }
      }
    }
  };

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleClientChange = e => {
    setClientForm({...clientForm, [e.target.name]: e.target.value});
  };

  const handleVoitureSelection = (voitureId) => {
    setForm(prevForm => {
      const voiture_ids = prevForm.voiture_ids.includes(voitureId)
        ? prevForm.voiture_ids.filter(id => id !== voitureId)
        : [...prevForm.voiture_ids, voitureId];
      return { ...prevForm, voiture_ids };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validation des voitures sélectionnées
    if (form.voiture_ids.length === 0) {
      alert("Veuillez sélectionner au moins une voiture");
      return;
    }
    
    if (form.date_location && form.date_fin) {
      const dateLocation = new Date(form.date_location);
      const dateFin = new Date(form.date_fin);
      
      if (dateFin < dateLocation) {
        alert("La date de fin doit être supérieure ou égale à la date de location");
        return;
      }
    }
    
    // Créer une location pour chaque voiture sélectionnée
    const locations = form.voiture_ids.map(voiture_id => ({
      voiture_id: parseInt(voiture_id),
      client: form.client,
      date_location: form.date_location,
      date_fin: form.date_fin,
      prix_location: form.prix_location ? parseFloat(form.prix_location) : null,
      etat: "en_cours"
    }));

    try {
      // Envoyer toutes les locations en une seule requête
      const res = await fetch("http://localhost:8000/api/locations/bulk", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ locations: locations })
      });
      
      const contentType = res.headers.get("content-type");
      let response;
      
      if (contentType && contentType.includes("application/json")) {
        response = await res.json();
      } else {
        const text = await res.text();
        console.error("Server returned non-JSON response:", text);
        throw new Error(`Server error: ${res.status} - ${text.substring(0, 200)}`);
      }
      
      if(res.ok) {
        alert(`${locations.length} location(s) enregistrée(s) avec succès !`);
        setForm({
          voiture_ids: [],
          client: "",
          date_location: "",
          date_fin: "",
          prix_location: "",
          etat: "en_cours"
        });
        
        // Recharger les voitures disponibles
        fetch("http://localhost:8000/api/voitures")
          .then(res => res.json())
          .then(data => {
            const dispo = Array.isArray(data) ? data.filter(v => v.etat === "disponible") : [];
            setVoitures(dispo);
            setVoituresFiltrees(dispo);
          });
      } else {
        console.error("Response:", response);
        const errorMsg = response.error || response.message || "Erreur lors de l'enregistrement";
        alert("Erreur: " + JSON.stringify(errorMsg));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Erreur réseau: " + err.message);
    }
  };

  const handleAddClient = async e => {
    e.preventDefault();
    
    try {
      const res = await fetch("http://localhost:8000/api/clients", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(clientForm)
      });
      
      // Vérifier le content-type de la réponse
      const contentType = res.headers.get("content-type");
      let response;
      
      if (contentType && contentType.includes("application/json")) {
        response = await res.json();
      } else {
        const text = await res.text();
        console.error("Server returned non-JSON response:", text);
        throw new Error(`Server error: ${res.status} - ${text.substring(0, 200)}`);
      }
      
      if(res.ok) {
        alert("Client ajouté avec succès !");
        setClientForm({
          nom: "",
          prenom: "",
          telephone: "",
          email: "",
          adresse: ""
        });
        setShowClientModal(false);
        
        // Recharger la liste des clients
        fetch("http://localhost:8000/api/clients")
          .then(res => res.json())
          .then(data => {
            setClients(Array.isArray(data) ? data : (data.data || []));
          });
      } else {
        console.error("Response:", response);
        const errorMsg = response.error || response.message || "Erreur lors de l'ajout du client";
        alert("Erreur: " + JSON.stringify(errorMsg));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Erreur réseau: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: colors.offWhite, minHeight: "100vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "30px" }}>
        {/* Formulaire de location */}
        <div>
          <div style={{ 
            backgroundColor: "white", 
            padding: "30px", 
            borderRadius: "12px", 
            border: `2px solid ${colors.deepRed}`,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ color: colors.black, fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>
              Nouvelle Location
            </h3>
            
            {/* Filtre par département */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: colors.darkGray, fontWeight: "600" }}>
                Filtrer par département:
              </label>
              <select 
                value={selectedDepartement} 
                onChange={(e) => setSelectedDepartement(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 15px",
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  backgroundColor: "#fff",
                  color: colors.black,
                  cursor: "pointer"
                }}
              >
                <option value="">Tous les départements</option>
                {departements.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.nom}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: colors.darkGray, fontWeight: "600" }}>
                  Client:
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <select 
                    name="client" 
                    value={form.client} 
                    onChange={handleChange} 
                    required
                    style={{
                      flex: 1,
                      padding: "12px 15px",
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      backgroundColor: "#fff",
                      color: colors.black,
                      cursor: "pointer"
                    }}
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map(client => (
                      <option key={client.id} value={`${client.nom} ${client.prenom}`}>
                        {client.nom} {client.prenom}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowClientModal(true)}
                    style={{
                      padding: "12px 20px",
                      background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.darkBurgundy} 100%)`,
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "14px",
                      transition: "all 0.3s",
                      whiteSpace: "nowrap"
                    }}
                  >
                    + Nouveau Client
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: colors.darkGray, fontWeight: "600" }}>
                  Voitures ({form.voiture_ids.length} sélectionnée(s)):
                </label>
                <div style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  border: `2px solid ${colors.lightGray}`,
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor: "#fafafa"
                }}>
                  {voituresFiltrees.length === 0 ? (
                    <div style={{ textAlign: "center", color: colors.lightGray, padding: "20px" }}>
                      Aucune voiture disponible pour ce département
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: "10px" }}>
                      {voituresFiltrees.map(v => (
                        <div 
                          key={v.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px",
                            backgroundColor: form.voiture_ids.includes(v.id.toString()) ? "#e8f5e8" : "white",
                            borderRadius: "6px",
                            border: `1px solid ${form.voiture_ids.includes(v.id.toString()) ? "#4caf50" : colors.lightGray}`,
                            cursor: "pointer",
                            transition: "all 0.2s"
                          }}
                          onClick={() => handleVoitureSelection(v.id.toString())}
                        >
                          <input
                            type="checkbox"
                            checked={form.voiture_ids.includes(v.id.toString())}
                            onChange={() => handleVoitureSelection(v.id.toString())}
                            style={{
                              marginRight: "10px",
                              cursor: "pointer"
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "600", color: colors.darkGray }}>
                              {v.matricule}
                            </div>
                            <div style={{ fontSize: "12px", color: colors.lightGray }}>
                              {v.modele} - {v.marque}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: colors.darkGray, fontWeight: "600" }}>
                    Date de début:
                  </label>
                  <input 
                    type="date" 
                    name="date_location" 
                    value={form.date_location} 
                    onChange={handleChange} 
                    required
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", color: colors.darkGray, fontWeight: "600" }}>
                    Date de fin:
                  </label>
                  <input 
                    type="date" 
                    name="date_fin" 
                    value={form.date_fin} 
                    onChange={handleChange} 
                    required
                    style={{
                      width: "100%",
                      padding: "12px 15px",
                      border: `2px solid ${colors.lightGray}`,
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontFamily: "inherit"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: colors.darkGray, fontWeight: "600" }}>
                  Prix de location (DT):
                </label>
                <input 
                  type="number" 
                  name="prix_location" 
                  placeholder="Prix de location" 
                  value={form.prix_location} 
                  onChange={handleChange} 
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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
                    fontSize: "16px",
                    transition: "all 0.3s"
                  }}
                >
                  Valider Location
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter un client */}
      {showClientModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(32, 45, 54, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            width: "500px",
            boxShadow: `0 10px 40px rgba(32, 45, 54, 0.3)`,
            border: `2px solid ${colors.lightGray}`
          }}>
            <h3 style={{ color: colors.darkGray, marginBottom: "20px", fontSize: "20px", fontWeight: 700 }}>
              Ajouter un Nouveau Client
            </h3>
            
            <form onSubmit={handleAddClient} style={{ display: "grid", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: colors.darkGray, fontWeight: "600" }}>
                  Nom:
                </label>
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom du client"
                  value={clientForm.nom}
                  onChange={handleClientChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: colors.darkGray, fontWeight: "600" }}>
                  Prénom:
                </label>
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom du client"
                  value={clientForm.prenom}
                  onChange={handleClientChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: colors.darkGray, fontWeight: "600" }}>
                  Téléphone:
                </label>
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Numéro de téléphone"
                  value={clientForm.telephone}
                  onChange={handleClientChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: colors.darkGray, fontWeight: "600" }}>
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Adresse email"
                  value={clientForm.email}
                  onChange={handleClientChange}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: colors.darkGray, fontWeight: "600" }}>
                  Adresse:
                </label>
                <input
                  type="text"
                  name="adresse"
                  placeholder="Adresse complète"
                  value={clientForm.adresse}
                  onChange={handleClientChange}
                  style={{
                    width: "100%",
                    padding: "12px 15px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
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
                    fontSize: "16px",
                    transition: "all 0.3s"
                  }}
                >
                  Ajouter Client
                </button>
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
                    fontSize: "16px",
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
    </div>
  );
}
