import { useRouter } from "next/router";
import Head from "next/head";

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  const getErrorMessage = (error: string | string[] | undefined) => {
    switch (error) {
      case "CredentialsSignin":
        return "Credenciais inválidas. Verifique seu email e senha.";
      case "Signin":
        return "Erro ao fazer login. Tente novamente.";
      case "OAuthSignin":
        return "Erro no provedor de autenticação.";
      case "OAuthCallback":
        return "Erro na callback de autenticação.";
      case "OAuthCreateAccount":
        return "Erro ao criar conta com provedor.";
      case "EmailCreateAccount":
        return "Erro ao criar conta com email.";
      case "Callback":
        return "Erro na callback de autenticação.";
      case "OAuthAccountNotLinked":
        return "Email já está em uso com outro provedor.";
      case "EmailSignin":
        return "Erro ao enviar email de login.";
      case "CredentialsSignup":
        return "Erro ao criar conta.";
      case "SessionRequired":
        return "Você precisa estar logado para acessar esta página.";
      default:
        return "Erro de autenticação. Tente novamente.";
    }
  };

  return (
    <>
      <Head>
        <title>Erro de Autenticação - Guia Orgânico</title>
      </Head>
      <div style={{ 
        maxWidth: "400px", 
        margin: "100px auto", 
        padding: "20px",
        border: "1px solid #ff6b6b",
        borderRadius: "8px",
        backgroundColor: "#fff5f5"
      }}>
        <h1 style={{ color: "#e53e3e" }}>Erro de Autenticação</h1>
        
        <p style={{ marginBottom: "20px" }}>
          {getErrorMessage(error)}
        </p>

        <button
          onClick={() => router.push("/auth/signin")}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Tentar Novamente
        </button>

        <button
          onClick={() => router.push("/")}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "transparent",
            color: "#0070f3",
            border: "1px solid #0070f3",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Voltar ao Início
        </button>
      </div>
    </>
  );
}
