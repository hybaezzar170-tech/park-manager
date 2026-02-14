import React, { useState, useEffect } from "react";

const Maintenance = () => {
  const colors = {
    black: "#000000",
    darkGray: "#1a1a1a",
    mediumGray: "#333333",
    lightGray: "#666666",
    offWhite: "#f5f5f5",
    darkBurgundy: "#3C0007",
    deepRed: "#800C1F",
    grayTaupe: "#929CAA",
    orange: "#FF6B35"
  };

  const [maintenances, setMaintenances] = useState([]);
  const [voituresDisponibles, setVoituresDisponibles] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    voiture_id: '',
    type_maintenance: '',
    cout: '',
    date_debut: '',
    date_fin_prevue: '',
    ouvrier_id: '',
    notes: ''
  });

  // Types de maintenance prédéfinis (5 types)
  const typesMaintenance = [
    "Révision générale",
    "Changement d'huile",
    "Freinage",
    "Climatisation",
    "Autre"
  ];

  useEffect(() => {
    fetchMaintenances();
    fetchVoituresDisponibles();
    fetchTechniciens();
  }, []);

  const fetchMaintenances = async () => {
    try {
      console.log("Fetching maintenances from /api/maintenances/active...");
      const response = await fetch("http://127.0.0.1:8000/api/maintenances/active");
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        console.error("Response not OK:", response.statusText);
        console.log("Trying alternative endpoint /api/maintenances...");
        // Try alternative endpoint
        const altResponse = await fetch("http://127.0.0.1:8000/api/maintenances");
        if (altResponse.ok) {
          const altData = await altResponse.json();
          console.log("Alternative maintenances data received:", altData);
          // Filter only active maintenances
          const activeMaintenances = (altData.data || altData).filter(m => 
            m.statut === 'en_cours' || m.statut === 'active'
          );
          setMaintenances(activeMaintenances);
          return;
        }
        throw new Error("Failed to fetch maintenances");
      }
      
      const data = await response.json();
      console.log("Maintenances data received:", data);
      setMaintenances(data.data || data);
    } catch (error) {
      console.error("Error fetching maintenances:", error);
      // Set empty array to prevent loading state
      setMaintenances([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoituresDisponibles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/voitures");
      const data = await response.json();
      setVoituresDisponibles((data.data || data).filter(v => v.etat === 'disponible'));
    } catch (error) {
      console.error("Error fetching voitures:", error);
    }
  };

  const fetchTechniciens = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/ouvriers/type/technicien");
      const data = await response.json();
      setTechniciens(data.data || data);
    } catch (error) {
      console.error("Error fetching techniciens:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/maintenances", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to create maintenance");

      // Reset form and refresh data
      setFormData({
        voiture_id: '',
        type_maintenance: '',
        cout: '',
        date_debut: '',
        date_fin_prevue: '',
        ouvrier_id: '',
        notes: ''
      });
      setShowForm(false);
      fetchMaintenances();
      fetchVoituresDisponibles();
    } catch (error) {
      console.error("Error creating maintenance:", error);
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/maintenances/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: 'terminee' })
      });

      if (response.ok) {
        fetchMaintenances();
        fetchVoituresDisponibles();
      }
    } catch (error) {
      console.error("Error completing maintenance:", error);
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: colors.white }}>
      <div style={{ 
        marginBottom: "15px"
      }}>
        <h2 style={{ 
          color: colors.darkGray, 
          fontSize: "28px", 
          fontWeight: "700",
          margin: 0
        }}>
          Gestion de la Maintenance
        </h2>
      </div>
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "25px",
        marginBottom: "15px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
      }}>
        <h3 style={{ 
          color: colors.darkGray, 
          marginBottom: "20px", 
          fontSize: "20px", 
          fontWeight: "600" 
        }}>
          Voitures Disponibles
        </h3>

          <div style={{ display: "grid", gap: "15px" }}>
            {voituresDisponibles.map(voiture => (
              <div key={voiture.id} style={{
                border: `1px solid ${colors.lightGray}`,
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#fafafa",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    color: colors.darkGray, 
                    margin: "0 0 10px 0",
                    fontSize: "16px",
                    fontWeight: "600"
                  }}>
                    {voiture.matricule} - {voiture.modele}
                  </h4>
                  <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: colors.mediumGray }}>
                    <span>Marque: {voiture.marque}</span>
                    <span>Carburant: {voiture.carburant}</span>
                    {voiture.conducteur && <span>Conducteur: {voiture.conducteur.nom} {voiture.conducteur.prenom}</span>}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setFormData({
                      voiture_id: voiture.id,
                      type_maintenance: '',
                      cout: '',
                      date_debut: '',
                      date_fin_prevue: '',
                      ouvrier_id: '',
                      notes: ''
                    });
                    setShowForm(true);
                  }}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: colors.orange,
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.3s",
                    whiteSpace: "nowrap"
                  }}
                >
                Maintenance
                </button>
              </div>
            ))}
          </div>
      </div>
      {showForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
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
                Nouvelle Maintenance
              </h3>
              <button
                onClick={() => setShowForm(false)}
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
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.darkGray, fontSize: "14px", fontWeight: "500" }}>
                  Type de maintenance 
                </label>
                <select
                  name="type_maintenance"
                  value={formData.type_maintenance}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    backgroundColor: "#fff",
                    cursor: "pointer"
                  }}
                >
                  <option value="">Sélectionner un type...</option>
                  {typesMaintenance.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.darkGray, fontSize: "14px", fontWeight: "500" }}>
                  Voiture 
                </label>
                <select
                  name="voiture_id"
                  value={formData.voiture_id}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    cursor: "pointer"
                  }}
                >
                  <option value="">Sélectionner une voiture...</option>
                  {voituresDisponibles.map(voiture => (
                    <option key={voiture.id} value={voiture.id}>
                      {voiture.matricule} - {voiture.modele}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.darkGray, fontSize: "14px", fontWeight: "500" }}>
                  Technicien 
                </label>
                <select
                  name="ouvrier_id"
                  value={formData.ouvrier_id}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    cursor: "pointer"
                  }}
                >
                  <option value="">Sélectionner un technicien...</option>
                  {techniciens.map(technicien => (
                    <option key={technicien.id} value={technicien.id}>
                      {technicien.nom} {technicien.prenom}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.darkGray, fontSize: "14px", fontWeight: "500" }}>
                  Date de début 
                </label>
                <input
                  type="date"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.darkGray, fontSize: "14px", fontWeight: "500" }}>
                  Date de fin prévue
                </label>
                <input
                  type="date"
                  name="date_fin_prevue"
                  value={formData.date_fin_prevue}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.darkGray, fontSize: "14px", fontWeight: "500" }}>
                  Coût 
                </label>
                <input
                  type="number"
                  name="cout"
                  value={formData.cout}
                  onChange={handleInputChange}
                  step="0.01"
                  placeholder="0.00"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit"
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", color: colors.darkGray, fontSize: "14px", fontWeight: "500" }}>
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Notes supplémentaires..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border: `2px solid ${colors.lightGray}`,
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontFamily: "inherit",
                    resize: "vertical"
                  }}
                /></div>

              <div style={{ display: "flex", gap: "10px" }}>
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
                  Ajouter
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
          Maintenances en cours
        </h3>

        {maintenances.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "40px",
            color: colors.lightGray,
            fontSize: "16px"
          }}>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "15px" }}>
            {maintenances.map(maintenance => (
              <div key={maintenance.id} style={{
                border: `1px solid ${colors.lightGray}`,
                borderRadius: "8px",
                padding: "20px",
                backgroundColor: "#fafafa"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      color: colors.darkGray, 
                      margin: "0 0 10px 0",
                      fontSize: "16px",
                      fontWeight: "600"
                    }}>
                      {maintenance.voiture?.matricule} - {maintenance.voiture?.modele}
                    </h4>
                    
                    {maintenance.type_maintenance && (
                      <p style={{ 
                        color: colors.mediumGray, 
                        margin: "5px 0",
                        fontSize: "14px"
                      }}>
                        {maintenance.type_maintenance}
                      </p>
                    )}
                    
                    <div style={{ display: "flex", gap: "20px", fontSize: "13px", color: colors.mediumGray }}>
                      <span>Matricule: {maintenance.voiture?.matricule}</span>
                      <span>date de debut: {maintenance.date_debut}</span>
                      <span>date de fin prevue: {maintenance.date_fin_prevue}</span>
                    </div>
                  
                  </div>
                  
                  <button
                    onClick={() => handleComplete(maintenance.id)}
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "500",
                      transition: "all 0.3s"
                    }}
                  >
                    Terminer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
