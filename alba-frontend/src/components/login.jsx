import React, { useState } from "react";
import bg from "../assets/car.png";
import logo from "../assets/autopark.png";

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token dans localStorage
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        
        // Appeler onLogin avec les données utilisateur
        onLogin(data.user);
      } else {
        // Gérer les erreurs de l'API
        setError(data.message || data.error || "Email ou mot de passe incorrect");
      }
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Erreur de connexion au serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>
      
      <div style={styles.rightSection}>
        <div style={styles.loginCard}>
          <div style={styles.logoContainer}>
            <img src={logo} alt="Autopark" style={styles.logo} />

          {error && (
            <div style={styles.errorContainer}>
              <span style={styles.errorText}>{error}</span>
            </div>
          )}
</div>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputContainer}>
                <input
                  type="email"
                  name="email"
                  placeholder="Entrez votre email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Mot de passe</label>
              <div style={styles.inputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              style={{...styles.button, ...(loading ? styles.buttonDisabled : {})}}
              disabled={loading}
            >
              {loading ? (
                <span style={styles.loadingText}>
                  <span style={styles.spinner}></span>
                  Connexion en cours...
                </span>
              ) : (
                <span style={styles.buttonText}>
                  Se connecter
                </span>
              )}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Besoin d'aide ? Contactez l'administrateur
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "relative",
    overflow: "hidden"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.1)",
    zIndex: 1
  },
  rightSection: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "40px",
    position: "relative",
    zIndex: 2,
    maxWidth: "400px",
    marginRight: "60px"
  },
  loginCard: {
    width: "100%",
    maxWidth: "350px",
    padding: "30px 25px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.2)"
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "0px"
  },
  logo: {
    width: "300px",
    height: "300px",
    borderRadius: "1px",
    marginBottom: "0px",
    objectFit: "cover"
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 8px 0",
    letterSpacing: "1px",
    color: "#ffffff",
    textShadow: "0 1px 2px rgba(0,0,0,0.1)"
  },
  subtitle: {
    fontSize: "14px",
    margin: 0,
    color: "#ffffff",
    fontWeight: "400"
  },
  cardHeader: {
    textAlign: "center",
    marginBottom: "25px"
  },
  loginTitle: {
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 8px 0",
    color: "#ffffff",
    letterSpacing: "-0.3px"
  },
  loginSubtitle: {
    fontSize: "14px",
    margin: 0,
    color: "#ffffff",
    fontWeight: "400"
  },
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px",
    background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
    borderRadius: "10px",
    marginBottom: "20px",
    border: "1px solid rgba(255, 107, 107, 0.3)"
  },
  errorText: {
    color: "white",
    fontSize: "13px",
    fontWeight: "500"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#ffffff",
    margin: "0"
  },
  inputContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center"
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "10px",
    fontSize: "14px",
    background: "rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
    color: "#ffffff"
  },
  passwordToggle: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    color: "#ffffff",
    padding: "4px",
    borderRadius: "4px",
    transition: "all 0.2s ease"
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #000000ff 0%, #000000ff 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 6px 12px rgba(92, 120, 150, 0.25)",
    marginTop: "8px"
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed"
  },
  buttonText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  loadingText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  },
  spinner: {
    animation: "spin 1s linear infinite"
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)"
  },
  footerText: {
    fontSize: "12px",
    color: "#ffffff",
    margin: 0
  }
};

export default Login;
