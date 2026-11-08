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
    orange: "#FF6B35",
    white: "#ffffff",
  };

  const [maintenances, setMaintenances] = useState([]);
  const [voituresDisponibles, setVoituresDisponibles] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    voiture_id: "",
    type_maintenance: "",
    cout: "",
    date_debut: "",
    date_fin_prevue: "",
    technicien: "",
    notes: "",
  });

  const typesMaintenance = [
    "Révision générale",
    "Changement d'huile",
    "Freinage",
    "Climatisation",
    "Autre",
  ];

  useEffect(() => {
    fetchMaintenances();
    fetchVoituresDisponibles();
    fetchTechniciens();
  }, []);

  const fetchMaintenances = async () => {
    try {
      // Récupérer les maintenances en cours
      const response = await fetch("http://localhost:8000/api/maintenances");
      if (!response.ok) throw new Error("Failed to fetch maintenances");

      const data = await response.json();
      const activeMaintenances = (data.data || data).filter(m => m.statut === "en_cours");
      
      // Récupérer aussi les voitures en état "en_maintenance" sans maintenance enregistrée
      const voituresResponse = await fetch("http://localhost:8000/api/voitures");
      if (voituresResponse.ok) {
        const voituresData = await voituresResponse.json();
        const voituresEnMaintenance = (voituresData.data || voituresData).filter(v => v.etat === "en_maintenance");
        
        // Créer des objets maintenance virtuels pour les voitures en maintenance
        const virtualMaintenances = voituresEnMaintenance.map(voiture => ({
          id: `voiture-${voiture.id}`,
          voiture_id: voiture.id,
          voiture: voiture,
          type_maintenance: "Maintenance en cours",
          date_debut: voiture.updated_at,
          statut: "en_cours",
          notes: "Voiture actuellement en maintenance"
        }));
        
        // Combiner les maintenances réelles et virtuelles sans doublons
        const voitureIdsEnMaintenance = virtualMaintenances.map(vm => vm.voiture_id);
        const realMaintenances = activeMaintenances.filter(m => !voitureIdsEnMaintenance.includes(m.voiture_id));
        const allMaintenances = [...realMaintenances, ...virtualMaintenances];
        setMaintenances(allMaintenances);
      } else {
        setMaintenances(activeMaintenances);
      }
    } catch (error) {
      console.error("Error fetching maintenances:", error);
      setMaintenances([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoituresDisponibles = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/voitures");
      const data = await response.json();
      const dispo = (data.data || data).filter(v => v.etat === "disponible");
      setVoituresDisponibles(dispo);
    } catch (error) {
      console.error("Error fetching voitures:", error);
    }
  };

  const fetchTechniciens = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/ouvriers/type/technicien");
      const data = await response.json();
      setTechniciens(data.data || data);
    } catch (error) {
      console.error("Error fetching techniciens:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data being submitted:", formData);
    try {
      const response = await fetch("http://localhost:8000/api/maintenances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error("Failed to create maintenance");

      setFormData({
        voiture_id: "",
        type_maintenance: "",
        cout: "",
        date_debut: "",
        date_fin_prevue: "",
        technicien: "",
        notes: "",
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
      // Vérifier si c'est une maintenance virtuelle
      const maintenance = maintenances.find(m => m.id === id);
      
      if (maintenance && maintenance.id.toString().startsWith('voiture-')) {
        // Maintenance virtuelle : mettre la voiture en état disponible
        if (!window.confirm(`Êtes-vous sûr de vouloir terminer la maintenance de la voiture ${maintenance.voiture?.matricule} - ${maintenance.voiture?.modele} ?`)) return;
        
        const response = await fetch(`http://localhost:8000/api/voitures/${maintenance.voiture_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ etat: "disponible" }),
        });
        
        if (response.ok) {
          fetchMaintenances();
          fetchVoituresDisponibles();
          alert("Maintenance terminée ! La voiture est maintenant disponible.");
        }
      } else {
        // Maintenance normale : terminer la maintenance ET mettre la voiture en état disponible
        if (!window.confirm(`Êtes-vous sûr de vouloir terminer la maintenance de la voiture ${maintenance.voiture?.matricule} - ${maintenance.voiture?.modele} ?`)) return;
        
        // Terminer la maintenance
        const maintenanceResponse = await fetch(`http://localhost:8000/api/maintenances/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ statut: "terminee" }),
        });
        
        if (maintenanceResponse.ok) {
          // Mettre la voiture en état disponible
          const voitureResponse = await fetch(`http://localhost:8000/api/voitures/${maintenance.voiture_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ etat: "disponible" }),
          });
          
          if (voitureResponse.ok) {
            fetchMaintenances();
            fetchVoituresDisponibles();
            alert("Maintenance terminée ! La voiture est maintenant disponible.");
          }
        }
      }
    } catch (error) {
      console.error("Error completing maintenance:", error);
      alert("Erreur lors de la terminaison de la maintenance");
    }
  };

  const handleEdit = (voiture) => {
    // Rediriger vers le formulaire de modification de voiture
    // Vous pouvez ajouter une navigation vers un composant de modification
    alert(`Fonction de modification pour la voiture ${voiture.matricule} - ${voiture.modele}`);
    // TODO: Implémenter la navigation vers le formulaire de modification
  };

  const handleDelete = async (voiture) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la voiture ${voiture.matricule} - ${voiture.modele} ?`)) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/voitures/${voiture.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        alert("Voiture supprimée avec succès !");
        fetchMaintenances();
        fetchVoituresDisponibles();
      } else {
        alert("Erreur lors de la suppression de la voiture");
      }
    } catch (error) {
      console.error("Error deleting voiture:", error);
      alert("Erreur lors de la suppression de la voiture");
    }
  };

  const handleCompleteAll = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir terminer toutes les maintenances ?")) return;
    
    try {
      const promises = maintenances.map(maintenance => {
        // Si c'est une maintenance virtuelle (id commence par "voiture-")
        if (maintenance.id.toString().startsWith('voiture-')) {
          // Maintenance virtuelle : mettre la voiture en état disponible
          return fetch(`http://localhost:8000/api/voitures/${maintenance.voiture_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ etat: "disponible" }),
          });
        } else {
          // Maintenance normale : terminer la maintenance ET mettre la voiture en état disponible
          return fetch(`http://localhost:8000/api/maintenances/${maintenance.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ statut: "terminee" }),
          });
        }
      });
      
      const results = await Promise.allSettled(promises);
      
      // Mettre les voitures en état disponible après les maintenances terminées
      const voiturePromises = maintenances
        .filter(m => !m.id.toString().startsWith('voiture-'))
        .map(maintenance => {
          if (maintenance.voiture_id) {
            return fetch(`http://localhost:8000/api/voitures/${maintenance.voiture_id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ etat: "disponible" }),
            });
          }
          return Promise.resolve();
        });
      
      await Promise.all(voiturePromises);
      
      // Rafraîchir les données
      fetchMaintenances();
      fetchVoituresDisponibles();
      
      const successCount = results.filter(r => r.status === 200).length;
      alert(`${successCount} maintenances ont été terminées avec succès ! Les voitures sont maintenant disponibles.`);
    } catch (error) {
      console.error("Error completing all maintenances:", error);
      alert("Erreur lors de la terminaison des maintenances");
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: "20px", backgroundColor: colors.offWhite }}>
      <h2 style={{ color: colors.darkGray, fontSize: "28px", fontWeight: 700, marginBottom: "20px" }}>
        Gestion de la Maintenance
      </h2>

      {/* Voitures disponibles */}
      <div style={{ background: colors.white, borderRadius: "12px", padding: "25px", marginBottom: "20px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <h3 style={{ color: colors.darkGray, fontSize: "20px", fontWeight: 600, marginBottom: "20px" }}>Voitures Disponibles</h3>
        <div style={{ display: "grid", gap: "15px" }}>
          {voituresDisponibles.map(v => (
            <div key={v.id} style={{ border: `1px solid ${colors.lightGray}`, borderRadius: "8px", padding: "20px", backgroundColor: "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: 0, color: colors.darkGray }}>{v.matricule} - {v.modele}</h4>
                <div style={{ fontSize: "13px", color: colors.mediumGray, display: "flex", gap: "15px" }}>
                  <span>Marque: {v.marque}</span>
                  <span>Carburant: {v.carburant}</span>
                  {v.conducteur && <span>Conducteur: {v.conducteur.nom} {v.conducteur.prenom}</span>}
                </div>
              </div>
              <button
                onClick={() => { 
                  setFormData({ 
                    ...formData, 
                    voiture_id: v.id.toString(),
                    date_debut: new Date().toISOString().split('T')[0]
                  }); 
                  setShowForm(true); 
                }}
                style={{ padding: "10px 20px", backgroundColor: colors.orange, color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
              >
                Maintenance
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire maintenance */}
      {showForm && (
        <div style={{ position: "fixed", top:0, left:0, right:0, bottom:0, backgroundColor:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:1000 }}>
          <div style={{ background: colors.white, borderRadius:"12px", padding:"30px", width:"90%", maxWidth:"600px", maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
              <h3 style={{ margin:0, fontSize:"20px", color:colors.darkGray }}>Nouvelle Maintenance</h3>
              <button onClick={()=>setShowForm(false)} style={{ fontSize:"24px", border:"none", background:"none", cursor:"pointer", color: colors.lightGray }}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              {/* Type maintenance */}
              <div style={{ marginBottom:"15px" }}>
                <label style={{ display:"block", marginBottom:"5px", color:colors.darkGray }}>Type de maintenance</label>
                <select name="type_maintenance" value={formData.type_maintenance} onChange={handleInputChange} required style={{ width:"100%", padding:"10px", border:`2px solid ${colors.lightGray}`, borderRadius:"8px" }}>
                  <option value="">Sélectionner un type...</option>
                  {typesMaintenance.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Technicien */}
              <div style={{ marginBottom:"15px" }}>
                <label style={{ display:"block", marginBottom:"5px", color:colors.darkGray }}>Technicien</label>
                <select name="technicien" value={formData.technicien} onChange={handleInputChange} required style={{ width:"100%", padding:"10px", border:`2px solid ${colors.lightGray}`, borderRadius:"8px" }}>
                  <option value="">Sélectionner un technicien...</option>
                  {techniciens.map(t => <option key={t.id} value={t.id}>{t.nom} {t.prenom}</option>)}
                </select>
              </div>

              {/* Dates et coût */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"15px", marginBottom:"15px" }}>
                <div>
                  <label style={{ display:"block", marginBottom:"5px", color:colors.darkGray }}>Date début</label>
                  <input type="date" name="date_debut" value={formData.date_debut} onChange={handleInputChange} required style={{ width:"100%", padding:"10px", border:`2px solid ${colors.lightGray}`, borderRadius:"8px" }} />
                </div>
                <div>
                  <label style={{ display:"block", marginBottom:"5px", color:colors.darkGray }}>Date fin prévue</label>
                  <input type="date" name="date_fin_prevue" value={formData.date_fin_prevue} onChange={handleInputChange} style={{ width:"100%", padding:"10px", border:`2px solid ${colors.lightGray}`, borderRadius:"8px" }} />
                </div>
                <div>
                  <label style={{ display:"block", marginBottom:"5px", color:colors.darkGray }}>Coût</label>
                  <input type="number" name="cout" value={formData.cout} onChange={handleInputChange} step="0.01" placeholder="0.00" style={{ width:"100%", padding:"10px", border:`2px solid ${colors.lightGray}`, borderRadius:"8px" }} />
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom:"15px" }}>
                <label style={{ display:"block", marginBottom:"5px", color:colors.darkGray }}>Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3" placeholder="Notes..." style={{ width:"100%", padding:"10px", border:`2px solid ${colors.lightGray}`, borderRadius:"8px", resize:"vertical" }}></textarea>
              </div>

              <div style={{ display:"flex", gap:"10px" }}>
                <button type="submit" style={{ flex:1, padding:"12px", backgroundColor:colors.deepRed, color:"#fff", borderRadius:"8px", border:"none", fontWeight:600 }}>Ajouter</button>
                <button type="button" onClick={()=>setShowForm(false)} style={{ flex:1, padding:"12px", backgroundColor:colors.grayTaupe, color:"#fff", borderRadius:"8px", border:"none", fontWeight:600 }}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

    
        {maintenances.length === 0 ? (
          <div style={{ textAlign:"center", padding:"40px", color:colors.lightGray }}>Aucune maintenance en cours</div>
        ) : (
          <div style={{ display:"grid", gap:"15px" }}>
            {maintenances.map(m => (
              <div key={m.id} style={{ border:`1px solid ${colors.lightGray}`, borderRadius:"8px", padding:"20px", backgroundColor:"#fafafa", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <h4 style={{ margin:0, color:colors.darkGray }}>{m.voiture?.matricule} - {m.voiture?.modele}</h4>
                  <p style={{ margin:"5px 0", color:colors.mediumGray }}>{m.type_maintenance}</p>
                  <div style={{ display:"flex", gap:"20px", fontSize:"13px", color:colors.mediumGray }}>
                    <span>Matricule: {m.voiture?.matricule}</span>
                    <span>Date début: {m.date_debut}</span>
                    <span>Date fin prévue: {m.date_fin_prevue}</span>
                  </div>
                </div>
                <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
                  {/* Bouton Terminer */}
                  <button 
                    onClick={()=>handleComplete(m.id)} 
                    style={{ 
                      padding:"10px 20px", 
                      backgroundColor:"#4CAF50", 
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
  );
}
export default Maintenance;
