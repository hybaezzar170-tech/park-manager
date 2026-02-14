import React, { useState, useEffect } from 'react';
import { FaCar, FaTools, FaUsers, FaBell, FaCog, FaTachometerAlt } from 'react-icons/fa';
import Dashboard from './components/Dashboard';
import GestionVoitures from './components/GestionVoitures';
import GestionConducteur from './components/GestionConducteur';
import GestionAchatLocations from './components/GestionAchatLocations';
import Alertes from './components/Alertes';
import DashboardParametrage from './components/DashboardParametrage';
import './App.css'; // Assure-toi d'avoir le CSS avec z-index: 1000

// ==========================================
// 1. COMPOSANTS MODALS (LES FORMULAIRES)
// ==========================================

// --- Modal Fournisseur ---
const FournisseurModal = ({ isOpen, onClose, onSubmit }) => {
  const [data, setData] = useState({ nom: '', prenom: '', type: '', email: '', tel: '', adresse: '', ville: '', code_postal: '', contact: '', fax: '', site_web: '' });

  if (!isOpen) return null; // Important: Ne rien afficher si false

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nouveau Fournisseur</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label>Nom</label><input required onChange={e=>setData({...data, nom:e.target.value})} value={data.nom}/></div>
            <div className="form-group"><label>Prénom</label><input required onChange={e=>setData({...data, prenom:e.target.value})} value={data.prenom}/></div>
            <div className="form-group">
              <label>Type</label>
              <select required onChange={e=>setData({...data, type:e.target.value})} value={data.type}>
                <option value="">Sélectionner...</option>
                <option value="Vente de véhicule">Vente de véhicule</option>
                <option value="Location véhicule">Location véhicule</option>
                <option value="Assurance">Assurance</option>
                <option value="Vente pièce auto">Vente pièce auto</option>
                <option value="Entretiens et réparations">Entretiens et réparations</option>
                <option value="Vente carburant">Vente carburant</option>
              </select>
            </div>
            <div className="form-group"><label>Adresse</label><input required onChange={e=>setData({...data, adresse:e.target.value})} value={data.adresse}/></div>
            <div className="form-group"><label>Ville</label><input required onChange={e=>setData({...data, ville:e.target.value})} value={data.ville}/></div>
            <div className="form-group"><label>Code Postal</label><input required onChange={e=>setData({...data, code_postal:e.target.value})} value={data.code_postal}/></div>
            <div className="form-group"><label>Contact</label><input onChange={e=>setData({...data, contact:e.target.value})} value={data.contact}/></div>
            <div className="form-group"><label>Téléphone</label><input required onChange={e=>setData({...data, tel:e.target.value})} value={data.tel}/></div>
            <div className="form-group"><label>Fax</label><input onChange={e=>setData({...data, fax:e.target.value})} value={data.fax}/></div>
            <div className="form-group"><label>Email</label><input required type="email" onChange={e=>setData({...data, email:e.target.value})} value={data.email}/></div>
            <div className="form-group"><label>Site Web</label><input onChange={e=>setData({...data, site_web:e.target.value})} value={data.site_web}/></div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Modal Pièce ---
const PieceModal = ({ isOpen, onClose, onSubmit, fournisseurs }) => {
  const [data, setData] = useState({ fournisseur_id: '', constructeur: '', numero: '', nom: '', prix: '', date_prix: '' });
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Ajouter Pièce</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Fournisseur</label>
              <select required onChange={e=>setData({...data, fournisseur_id:e.target.value})} value={data.fournisseur_id}>
                <option value="">Sélectionner...</option>
                {fournisseurs.map(f => <option key={f.id} value={f.id}>{f.nom} {f.prenom}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Constructeur</label><input required onChange={e=>setData({...data, constructeur:e.target.value})} value={data.constructeur}/></div>
            <div className="form-group"><label>Numéro</label><input required onChange={e=>setData({...data, numero:e.target.value})} value={data.numero}/></div>
            <div className="form-group"><label>Nom Pièce</label><input required onChange={e=>setData({...data, nom:e.target.value})} value={data.nom}/></div>
            <div className="form-group"><label>Prix</label><input type="number" required onChange={e=>setData({...data, prix:e.target.value})} value={data.prix}/></div>
            <div className="form-group"><label>Date Prix</label><input type="date" required onChange={e=>setData({...data, date_prix:e.target.value})} value={data.date_prix}/></div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Modal Alerte ---
const AlerteModal = ({ isOpen, onClose, onSubmit }) => {
  const [data, setData] = useState({ email: '', type: '' });
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Alerte par Email</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label><input type="email" required onChange={e=>setData({...data, email:e.target.value})} value={data.email}/>
          </div>
          <div className="form-group">
            <label>Type</label>
            <select required onChange={e=>setData({...data, type:e.target.value})} value={data.type}>
              <option value="Assurance">Assurance</option>
              <option value="Taxe circulation">Taxe circulation</option>
              <option value="Visite technique">Visite technique</option>
              <option value="Entretien">Entretien</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-primary">Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 2. COMPOSANTS PAGES (Tableaux)
// ==========================================

const PageFournisseurs = ({ fournisseurs, onAdd }) => (
  <div>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
      <h1>GESTION FOURNISSEURS</h1>
      <button className="btn btn-primary" onClick={onAdd}>+ Ajouter Fournisseur</button>
    </div>
    <table>
      <thead><tr><th>Nom</th><th>Type</th><th>Email</th><th>Tel</th></tr></thead>
      <tbody>
        {fournisseurs.length === 0 ? <tr><td colSpan="4">Aucun fournisseur</td></tr> :
        fournisseurs.map(f => <tr key={f.id}><td>{f.nom} {f.prenom}</td><td>{f.type}</td><td>{f.email}</td><td>{f.tel}</td></tr>)}
      </tbody>
    </table>
  </div>
);

const PagePieces = ({ pieces, fournisseurs, onAdd }) => (
  <div>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
      <h1>GESTION PIÈCES</h1>
      <button className="btn btn-primary" onClick={onAdd}>+ Ajouter Pièce</button>
    </div>
    <table>
      <thead><tr><th>Nom</th><th>Fournisseur</th><th>Constructeur</th><th>Prix</th></tr></thead>
      <tbody>
        {pieces.length === 0 ? <tr><td colSpan="4">Aucune pièce</td></tr> :
        pieces.map(p => (
          <tr key={p.id}>
            <td>{p.nom}</td>
            <td>{fournisseurs.find(f=>f.id===p.fournisseur_id)?.nom || 'Inconnu'}</td>
            <td>{p.constructeur}</td>
            <td>{p.prix}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const PageAlertes = ({ alertes, onAdd }) => (
  <div>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
      <h1>ALERTES EMAIL</h1>
      <button className="btn btn-primary" onClick={onAdd}>+ Ajouter Alerte</button>
    </div>
    <table>
      <thead><tr><th>Type</th><th>Email</th></tr></thead>
      <tbody>
        {alertes.length === 0 ? <tr><td colSpan="2">Aucune alerte</td></tr> :
        alertes.map(a => <tr key={a.id}><td>{a.type}</td><td>{a.email}</td></tr>)}
      </tbody>
    </table>
  </div>
);

// ==========================================
// 3. COMPOSANT SIDEBAR
// ==========================================
const Sidebar = ({ role }) => (
  <aside className="sidebar">
    <h2>GARAGE</h2>
    <nav>
      <Link to="/fournisseurs" style={{display:'block', padding:'10px', color:'black', textDecoration:'none'}}>Fournisseurs</Link>
      <Link to="/pieces" style={{display:'block', padding:'10px', color:'black', textDecoration:'none'}}>Pièces</Link>
      {role === 'admin' && <Link to="/alertes" style={{display:'block', padding:'10px', color:'black', textDecoration:'none'}}>Alertes Email</Link>}
    </nav>
  </aside>
);

// ==========================================
// 4. APP PRINCIPALE (LOGIQUE)
// ==========================================
function App() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({ fournisseurs: [], pieces: [], alertes: [] });

  // États des Modals (TOUS ICI)
  const [showFModal, setShowFModal] = useState(false);
  const [showPModal, setShowPModal] = useState(false);
  const [showAModal, setShowAModal] = useState(false);

  // Chargement Data
  useEffect(() => {
    if(!user) return;
    const loadData = async () => {
        try {
            const [resF, resP, resA] = await Promise.all([
                api.get('/fournisseurs'),
                api.get('/pieces'),
                api.get('/alertes')
            ]);
            setData({
                fournisseurs: resF.data,
                pieces: resP.data,
                alertes: resA.data
            });
        } catch(e) { console.error(e); }
    };
    loadData();
  }, [user]);

  const handleLogin = (role) => {
    setUser(role);
    // navigate('/fournisseurs');
  };

  // Handlers Ajout
  const handleAddF = async (d) => {
    try {
      const res = await api.post('/fournisseurs', d);
      setData(prev => ({...prev, fournisseurs: [...prev.fournisseurs, res.data]}));
      setShowFModal(false);
    } catch(e) {
      console.error('Erreur ajout fournisseur:', e);
      alert('Erreur lors de l\'ajout: ' + (e.response?.data?.message || e.message));
    }
  };
  const handleAddP = async (d) => {
    try {
      const res = await api.post('/pieces', d);
      setData(prev => ({...prev, pieces: [...prev.pieces, res.data]}));
      setShowPModal(false);
    } catch(e) {
      console.error('Erreur ajout pièce:', e);
      alert('Erreur lors de l\'ajout: ' + (e.response?.data?.message || e.message));
    }
  };
  const handleAddA = async (d) => {
    try {
      const res = await api.post('/alertes', d);
      setData(prev => ({...prev, alertes: [...prev.alertes, res.data]}));
      setShowAModal(false);
    } catch(e) {
      console.error('Erreur ajout alerte:', e);
      alert('Erreur lors de l\'ajout: ' + (e.response?.data?.message || e.message));
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        
        <Route path="/" element={
          <Layout>
            <Dashboard />
          </Layout>
        } />
        
        <Route path="/fournisseurs" element={
          <Layout>
            <PageFournisseurs fournisseurs={data.fournisseurs} onAdd={() => setShowFModal(true)} />
          </Layout>
        } />
        
        <Route path="/pieces" element={
          <Layout>
            <PagePieces pieces={data.pieces} fournisseurs={data.fournisseurs} onAdd={() => setShowPModal(true)} />
          </Layout>
        } />
        
        <Route path="/alertes" element={
          <Layout>
            <PageAlertes alertes={data.alertes} onAdd={() => setShowAModal(true)} />
          </Layout>
        } />
        
        {/* Add more routes as needed */}
      </Routes>
      
      {/* Modals */}
      <FournisseurModal 
        isOpen={showFModal} 
        onClose={() => setShowFModal(false)} 
        onSubmit={handleAddF} 
      />
      
      <PieceModal 
        isOpen={showPModal} 
        onClose={() => setShowPModal(false)} 
        onSubmit={handleAddP}
        fournisseurs={data.fournisseurs}
      />
      
      <AlerteModal 
        isOpen={showAModal} 
        onClose={() => setShowAModal(false)} 
        onSubmit={handleAddA} 
      />
      
      {/* Page Login */}
      { !user && (
        <div style={{height:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:'#f3f4f6'}}>
          <div style={{background:'white', padding:'40px', borderRadius:'10px', textAlign:'center'}}>
            <h2>Connexion</h2>
            <button className="btn btn-primary" onClick={() => handleLogin('admin')} style={{width:'100%', margin:'10px 0'}}>Admin</button>
            <button className="btn btn-secondary" onClick={() => handleLogin('client')} style={{width:'100%', margin:'10px 0'}}>Client</button>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;