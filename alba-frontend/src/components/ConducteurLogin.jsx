import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ConducteurLogin() {
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

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    setError("");

    fetch("http://localhost:8000/api/conducteurs/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(form)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) throw data;
        return data;
      })
      .then(data => {
        // Stocker les infos du conducteur dans localStorage
        localStorage.setItem('conducteur', JSON.stringify(data.conducteur));
        localStorage.setItem('conducteur_token', data.token);
        
        // Rediriger vers le dashboard
        navigate('/conducteur/dashboard');
      })
      .catch(err => {
        console.error("Erreur de connexion:", err);
        setError(err.message || "Email ou mot de passe incorrect");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.offWhite,
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{
            color: colors.deepRed,
            fontSize: "28px",
            fontWeight: "700",
            margin: "0 0 10px 0"
          }}>
            Espace Conducteur
          </h1>
          <p style={{
            color: colors.lightGray,
            fontSize: "14px",
            margin: 0
          }}>
            Connectez-vous à votre espace personnel
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{
              display: "block",
              color: colors.darkGray,
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="votre@email.com"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: `2px solid ${colors.lightGray}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "inherit",
                transition: "all 0.3s ease",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = colors.deepRed}
              onBlur={(e) => e.target.style.borderColor = colors.lightGray}
            />
          </div>

          <div>
            <label style={{
              display: "block",
              color: colors.darkGray,
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••••"
              style={{
                width: "100%",
                padding: "12px 16px",
                border: `2px solid ${colors.lightGray}`,
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "inherit",
                transition: "all 0.3s ease",
                outline: "none"
              }}
              onFocus={(e) => e.target.style.borderColor = colors.deepRed}
              onBlur={(e) => e.target.style.borderColor = colors.lightGray}
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: "#fef2f2",
              color: colors.deepRed,
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px",
              border: `1px solid ${colors.deepRed}`
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px 24px",
              backgroundColor: loading ? colors.grayTaupe : colors.deepRed,
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(128, 12, 31, 0.4)",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div style={{
          textAlign: "center",
          marginTop: "20px",
          paddingTop: "20px",
          borderTop: `1px solid ${colors.lightGray}`
        }}>
          <p style={{
            color: colors.lightGray,
            fontSize: "12px",
            margin: 0
          }}>
            En cas de problème, contactez l'administrateur
          </p>
        </div>
      </div>
    </div>
  );
}

export default ConducteurLogin;
