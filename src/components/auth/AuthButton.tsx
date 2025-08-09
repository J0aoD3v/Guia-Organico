import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <button disabled style={{ padding: "8px 16px", opacity: 0.6 }}>
        Carregando...
      </button>
    );
  }

  if (session) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <span style={{ fontSize: "14px" }}>
          Olá, {session.user?.name || session.user?.email}
        </span>
        
        {session.user?.role === "admin" && (
          <button
            onClick={() => router.push("/admin")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Admin
          </button>
        )}

        <button
          onClick={() => signOut()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px"
          }}
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      style={{
        padding: "8px 16px",
        backgroundColor: "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px"
      }}
    >
      Entrar
    </button>
  );
}
