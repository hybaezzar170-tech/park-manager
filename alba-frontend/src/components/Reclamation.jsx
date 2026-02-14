import React, { useState, useEffect, useCallback } from 'react';
import { FiAlertTriangle, FiClock, FiCheckCircle, FiXCircle, FiMessageSquare, FiUser, FiCalendar, FiFilter, FiRefreshCw, FiEdit2 } from 'react-icons/fi';

const Reclamation = ({ user }) => {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [editingReclamation, setEditingReclamation] = useState(null);
  const [responseText, setResponseText] = useState('');

  const colors = {
    primary: '#800C1F',
    secondary: '#3C0007',
    accent: '#929CAA',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
    text: '#333333',
    textSecondary: '#666666',
    background: '#ffffff',
    border: '#e0e0e0',
    hover: '#f5f5f5'
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    };
  };

  const fetchReclamations = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/reclamations', {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        setReclamations(data);
      } else if (response.status === 401) {
        setError('Vous devez être connecté pour voir les réclamations');
      } else if (response.status === 422) {
        const errorData = await response.json();
        const errorMessage = Object.values(errorData.errors || {}).flat().join('\n');
        setError('Erreur de validation:\n' + errorMessage);
      } else {
        setError('Erreur lors du chargement des réclamations');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReclamations();
  }, [fetchReclamations]);

  const handleStatusUpdate = async (reclamationId, newStatus, response = null) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reclamations/${reclamationId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          statut: newStatus,
          reponse: response || ''
        })
      });

      if (res.ok) {
        // Mettre à jour la réclamation localement
        setReclamations(prev => 
          prev.map(rec => 
            rec.id === reclamationId 
              ? { ...rec, statut: newStatus, reponse: response || rec.reponse }
              : rec
          )
        );
        setSelectedReclamation(null);
        setEditingReclamation(null);
        setResponseText('');
      } else if (res.status === 422) {
        const errorData = await res.json();
        const errorMessage = Object.values(errorData.errors || {}).flat().join('\n');
        setError('Erreur de validation:\n' + errorMessage);
      } else if (res.status === 401) {
        setError('Vous devez être connecté pour modifier les réclamations');
      } else {
        setError('Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error('Error:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_attente': return colors.warning;
      case 'en_cours': return colors.info;
      case 'resolu': return colors.success;
      case 'rejete': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en_attente': return <FiClock />;
      case 'en_cours': return <FiRefreshCw />;
      case 'resolu': return <FiCheckCircle />;
      case 'rejete': return <FiXCircle />;
      default: return <FiAlertTriangle />;
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'basse': return colors.success;
      case 'moyenne': return colors.warning;
      case 'haute': return colors.error;
      case 'critique': return '#8B0000';
      default: return colors.textSecondary;
    }
  };

  const filteredReclamations = reclamations.filter(reclamation => {
    if (filter === 'all') return true;
    return reclamation.statut === filter;
  });

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '16px',
        color: colors.textSecondary
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: `4px solid ${colors.border}`,
            borderTop: `4px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          Chargement des réclamations...
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: colors.text }}>
          Réclamations
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => window.location.href = '/reclamation'}
            style={{
              padding: '8px 16px',
              background: colors.success,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiMessageSquare />
            Nouvelle Réclamation
          </button>
          <button
            onClick={fetchReclamations}
            style={{
              padding: '8px 16px',
              background: colors.primary,
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiRefreshCw />
            Actualiser
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          marginBottom: '20px',
          padding: '12px 16px',
          background: 'rgba(220, 53, 69, 0.1)',
          border: `1px solid ${colors.error}`,
          borderRadius: '8px',
          color: colors.error,
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Filters */}
      <div style={{ 
        marginBottom: '24px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <span style={{ 
          fontWeight: '600', 
          color: colors.text,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FiFilter />
          Filtrer par statut:
        </span>
        {[
          { value: 'all', label: 'Toutes' },
          { value: 'en_attente', label: 'En attente' },
          { value: 'en_cours', label: 'En cours' },
          { value: 'resolu', label: 'Résolues' },
          { value: 'rejete', label: 'Rejetées' }
        ].map(item => (
          <button
            key={item.value}
            onClick={() => setFilter(item.value)}
            style={{
              padding: '6px 12px',
              border: `1px solid ${filter === item.value ? colors.primary : colors.border}`,
              background: filter === item.value ? colors.primary : colors.background,
              color: filter === item.value ? '#ffffff' : colors.text,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Reclamations List */}
      <div style={{ 
        display: 'grid', 
        gap: '16px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
      }}>
        {filteredReclamations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: colors.textSecondary,
            fontSize: '16px',
            gridColumn: '1 / -1'
          }}>
            <FiAlertTriangle style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
            <div>Aucune réclamation trouvée</div>
          </div>
        ) : (
          filteredReclamations.map(reclamation => (
            <div
              key={reclamation.id}
              style={{
                background: colors.background,
                border: `1px solid ${colors.border}`,
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onClick={() => setSelectedReclamation(reclamation)}
            >
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: colors.text
                  }}>
                    {reclamation.sujet}
                  </h3>
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    flexWrap: 'wrap',
                    fontSize: '14px',
                    color: colors.textSecondary
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiUser />
                      {reclamation.email}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiCalendar />
                      {new Date(reclamation.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: `${getStatusColor(reclamation.statut)}20`,
                    color: getStatusColor(reclamation.statut)
                  }}>
                    {getStatusIcon(reclamation.statut)}
                    {reclamation.statut.replace('_', ' ')}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: `${getUrgencyColor(reclamation.urgence)}20`,
                    color: getUrgencyColor(reclamation.urgence)
                  }}>
                    <FiAlertTriangle />
                    {reclamation.urgence}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div style={{ 
                marginBottom: '16px',
                fontSize: '14px',
                lineHeight: '1.5',
                color: colors.text
              }}>
                {reclamation.description.length > 150 
                  ? `${reclamation.description.substring(0, 150)}...` 
                  : reclamation.description}
              </div>

              {/* Footer */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                fontSize: '12px',
                color: colors.textSecondary
              }}>
                <span>Type: {reclamation.type_reclamation}</span>
                {reclamation.voiture && (
                  <span>Véhicule: {reclamation.voiture.marque} {reclamation.voiture.modele}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reclamation Detail Modal */}
      {selectedReclamation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: colors.background,
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                Détails de la réclamation
              </h3>
              <button
                onClick={() => {
                  setSelectedReclamation(null);
                  setEditingReclamation(null);
                  setResponseText('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: colors.textSecondary
                }}
              >
                ×
              </button>
            </div>

            {/* Reclamation Details */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <strong>Sujet:</strong> {selectedReclamation.sujet}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Description:</strong>
                <div style={{ 
                  marginTop: '8px', 
                  padding: '12px',
                  background: colors.hover,
                  borderRadius: '6px',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {selectedReclamation.description}
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Type:</strong> {selectedReclamation.type_reclamation}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Urgence:</strong> 
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: `${getUrgencyColor(selectedReclamation.urgence)}20`,
                  color: getUrgencyColor(selectedReclamation.urgence)
                }}>
                  {selectedReclamation.urgence}
                </span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Email:</strong> {selectedReclamation.email}
              </div>
              {selectedReclamation.voiture && (
                <div style={{ marginBottom: '16px' }}>
                  <strong>Véhicule:</strong> {selectedReclamation.voiture.marque} {selectedReclamation.voiture.modele} ({selectedReclamation.voiture.annee})
                </div>
              )}
              <div style={{ marginBottom: '16px' }}>
                <strong>Statut:</strong> 
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: `${getStatusColor(selectedReclamation.statut)}20`,
                  color: getStatusColor(selectedReclamation.statut)
                }}>
                  {selectedReclamation.statut.replace('_', ' ')}
                </span>
              </div>
              {selectedReclamation.reponse && (
                <div style={{ marginBottom: '16px' }}>
                  <strong>Réponse:</strong>
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '12px',
                    background: colors.success + '20',
                    border: `1px solid ${colors.success}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {selectedReclamation.reponse}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              {selectedReclamation.statut === 'en_attente' && (
                <>
                  <button
                    onClick={() => {
                      setEditingReclamation(selectedReclamation);
                      setResponseText(selectedReclamation.reponse || '');
                    }}
                    style={{
                      padding: '8px 16px',
                      background: colors.info,
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FiEdit2 />
                    Répondre
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedReclamation.id, 'rejete')}
                    style={{
                      padding: '8px 16px',
                      background: colors.error,
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}
                  >
                    Rejeter
                  </button>
                </>
              )}
              {(selectedReclamation.statut === 'en_cours' || selectedReclamation.statut === 'en_attente') && (
                <button
                  onClick={() => handleStatusUpdate(selectedReclamation.id, 'resolu')}
                  style={{
                    padding: '8px 16px',
                    background: colors.success,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Résoudre
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Response Modal */}
      {editingReclamation && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1001
        }}>
          <div style={{
            background: colors.background,
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
              Répondre à la réclamation
            </h3>
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Écrivez votre réponse..."
              style={{
                width: '100%',
                height: '120px',
                padding: '12px',
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'vertical',
                marginBottom: '16px'
              }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setEditingReclamation(null);
                  setResponseText('');
                }}
                style={{
                  padding: '8px 16px',
                  background: colors.textSecondary,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  handleStatusUpdate(editingReclamation.id, 'en_cours', responseText);
                }}
                style={{
                  padding: '8px 16px',
                  background: colors.primary,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Envoyer la réponse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reclamation;
