import React, { useState, useEffect } from "react";

function UserReclamation({ user, onLogout, onClose }) {
  const [voitures, setVoitures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    sujet: "",
    description: "",
    typeReclamation: "",
    urgence: "moyenne", // Valeur par défaut
    voitureId: "",
    email: ""
  });

  // Récupérer les en-têtes d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
  };

  useEffect(() => {
    const fetchVoitures = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/voitures", {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setVoitures(data);
      } catch (error) {
        console.error("Error fetching voitures:", error);
        setVoitures([]);
      }
    };
    
    fetchVoitures();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation frontend
    if (!formData.sujet || formData.sujet.trim().length < 3) {
      alert('Le sujet doit contenir au moins 3 caractères');
      return;
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
      alert('La description doit contenir au moins 10 caractères');
      return;
    }
    
    if (!formData.typeReclamation) {
      alert('Veuillez sélectionner un type de réclamation');
      return;
    }
    
    if (!formData.urgence) {
      alert('Veuillez sélectionner un niveau d\'urgence');
      return;
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      alert('Veuillez fournir une adresse email valide');
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        sujet: formData.sujet.trim(),
        description: formData.description.trim(),
        type_reclamation: formData.typeReclamation,
        urgence: formData.urgence,
        voiture_id: formData.voitureId || null,
        email: formData.email.trim() || user.email
      };

      console.log('Payload validé:', payload);
      const response = await fetch('http://localhost:8000/api/reclamations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Réclamation envoyée avec succès!');
        setFormData({
          sujet: "", description: "", typeReclamation: "", urgence: "", voitureId: "", email: ""
        });
      } else if (response.status === 422) {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData.errors || {}).flat().join('\n');
        alert('Erreur de validation:\n' + errorMessage);
      } else {
        alert('Erreur lors de l\'envoi de la réclamation');
      }
    } catch (error) {
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const urgencyColors = {
    basse: "#28a745",
    moyenne: "#ffc107",
    haute: "#fd7e14",
    critique: "#dc3545"
  };

  return (
    <div style={{ padding: "40px", background: "#f5f5f5", minHeight: "100vh" }}>
      
      {/* Header with close button */}
      <div style={{ position: "relative", marginBottom: "40px" }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            padding: "10px 20px",
            background: "#800c1f",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px",
            transition: "all 0.3s ease",
            zIndex: 1000
          }}
        >
          Fermer
        </button>
        
        <div style={{ textAlign: "center" }}>
          <h2 style={{
            fontSize: "36px",
            fontWeight: "800",
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#000000"
          }}>
            Formulaire de Réclamation
          </h2>

          <div style={{
            width: "100px",
            height: "4px",
            margin: "10px auto",
            borderRadius: "2px",
            background: "linear-gradient(135deg, rgba(128,12,31,0.9), rgba(60,0,7,0.9))"
          }} />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
        {/* Type de Réclamation */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Type de Réclamation *
          </label>
          <select
            name="typeReclamation"
            value={formData.typeReclamation}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px"
            }}
            required
          >
            <option value="">Sélectionner un type</option>
            <option value="panne">Panne véhicule</option>
            <option value="accident">Accident</option>
            <option value="service">Service client</option>
            <option value="facturation">Facturation</option>
            <option value="contrat">Problème contrat</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        {/* Niveau d'urgence */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Niveau d'urgence *
          </label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["basse", "moyenne", "haute", "critique"].map((niveau) => (
              <label key={niveau} style={{ 
                display: "flex", 
                alignItems: "center", 
                cursor: "pointer",
                padding: "8px 12px",
                border: `2px solid ${urgencyColors[niveau]}`,
                borderRadius: "6px",
                background: formData.urgence === niveau ? urgencyColors[niveau] : "white",
                color: formData.urgence === niveau ? "white" : urgencyColors[niveau]
              }}>
                <input
                  type="radio"
                  name="urgence"
                  value={niveau}
                  checked={formData.urgence === niveau}
                  onChange={handleInputChange}
                  style={{ marginRight: "5px" }}
                />
                {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Sujet */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Sujet *
          </label>
          <input
            type="text"
            name="sujet"
            placeholder="Sujet de la réclamation"
            value={formData.sujet}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px"
            }}
            required
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Description détaillée *
          </label>
          <textarea
            name="description"
            placeholder="Décrivez votre problème en détail..."
            value={formData.description}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
              height: "120px",
              resize: "vertical"
            }}
            required
          />
        </div>

        {/* Voiture ID */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            ID du véhicule (si applicable)
          </label>
          <select
            name="voitureId"
            value={formData.voitureId}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px"
            }}
          >
            <option value="">Sélectionner une voiture...</option>
            {voitures.map(voiture => (
              <option key={voiture.id} value={voiture.id}>
                {voiture.marque} {voiture.modele} ({voiture.annee}) - ID: {voiture.id}
              </option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
            Email de contact
          </label>
          <input
            type="email"
            name="email"
            placeholder={user.email || "votre@email.com"}
            value={formData.email}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px"
            }}
          />
          <small style={{ color: "#666" }}>
            Laissez vide pour utiliser votre email par défaut: {user.email}
          </small>
        </div>

        {/* Submit */}
        <div style={{ textAlign: "center" }}>
          <button type="submit" disabled={loading} style={{
            background: loading ? "#ccc" : "#800c1f",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            margin: "10px 5px",
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? "Envoi en cours..." : "Envoyer la Réclamation"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserReclamation;
