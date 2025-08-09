import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciais inválidas");
      setLoading(false);
    } else {
      // Redirecionar para página admin ou home
      router.push("/admin");
    }
  };

  return (
    <>
      <Head>
        <title>Login - Guia Orgânico</title>
      </Head>
      <div style={{ 
        maxWidth: "400px", 
        margin: "100px auto", 
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px"
      }}>
        <h1>Login - Guia Orgânico</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="password">Senha:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "4px"
              }}
            />
          </div>

          {error && (
            <div style={{ color: "red", marginBottom: "15px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#666" }}>
            Usuário de teste: admin@admin.com / senha: 123456
          </p>
        </div>
      </div>
    </>
  );
}
