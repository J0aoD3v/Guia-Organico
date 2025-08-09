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
      // Buscar sessão para saber o role
      const session = await getSession();
      if (session?.user?.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/perfil");
      }
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
            <label htmlFor="email">Usuário:</label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu usuário ou email"
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
          <div style={{ 
            borderTop: "1px solid #ddd", 
            paddingTop: "20px",
            marginBottom: "20px"
          }}>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
              Ou faça login com:
            </p>
            <button
              type="button"
              onClick={async () => {
                setLoading(true);
                setError("");
                const result = await signIn("google", { redirect: false });
                if (result?.error) {
                  setError("Erro ao autenticar com Google");
                  setLoading(false);
                } else {
                  // Buscar sessão para saber o role
                  const session = await getSession();
                  if (session?.user?.role === "admin") {
                    router.push("/admin");
                  } else {
                    router.push("/perfil");
                  }
                }
              }}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#4285f4",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
