import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";

export default function UserAvatar() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pedidosMes, setPedidosMes] = useState<number | null>(null);
  const [creditosUsuario, setCreditosUsuario] = useState<number | null>(null);
  const [creditosGlobais, setCreditosGlobais] = useState<number | null>(null);
  const [proximoCiclo, setProximoCiclo] = useState<string>("");

  // Buscar créditos do usuário e créditos globais
  useEffect(() => {
    async function fetchDados() {
      if (session?.user?.email) {
        try {
          const [resPedidos, resConfig, resUsuario, resCiclo] = await Promise.all([
            fetch(`/api/pedidos?email=${session.user.email}`),
            fetch(`/api/configuracoes`),
            fetch(`/api/usuarios`),
            fetch(`/api/ciclo`),
          ]);

          const pedidosData = await resPedidos.json();
          const configData = await resConfig.json();
          const usuariosData = await resUsuario.json();
          const cicloData = await resCiclo.json();
          const usuarioAtual = usuariosData.find(
            (u: any) => u.email === session.user.email
          );

          setPedidosMes(pedidosData.count ?? 0);
          setCreditosGlobais(configData.creditoPadrao ?? 0);
          setCreditosUsuario(usuarioAtual?.credito ?? 0);
          setProximoCiclo(cicloData.proximoCiclo ?? "");
        } catch (err) {
          setPedidosMes(null);
          setCreditosGlobais(null);
          setCreditosUsuario(null);
          setProximoCiclo("");
        }
      }
    }
    if (isOpen) fetchDados();
  }, [isOpen, session?.user?.email]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (status === "loading") {
    return (
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: "12px" }}>...</span>
      </div>
    );
  }

  if (!session) {
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
          fontSize: "14px",
        }}
      >
        Entrar
      </button>
    );
  }

  const userImage = session.user?.image;
  const userName = session.user?.name || session.user?.email || "Usuário";
  const userInitials = userName.charAt(0).toUpperCase();

  return (
  <div style={{ position: "relative" }} ref={dropdownRef}>
      {/* Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "2px solid #e5e7eb",
          cursor: "pointer",
          backgroundColor: "transparent",
          padding: "0",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        ) : (
          <span
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#374151",
              backgroundColor: "#f3f4f6",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {userInitials}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "50px",
            right: "0",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            minWidth: "200px",
            zIndex: 1000,
          }}
        >
          {/* Informações do usuário */}
          <div
            style={{
              padding: "12px 16px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{ fontWeight: "600", fontSize: "14px", color: "#111827" }}
            >
              {userName}
            </div>
            <div style={{ fontSize: "12px", color: "#6b7280" }}>
              {session.user?.email}
            </div>
          </div>

          {/* Menu Items */}
          <div style={{ padding: "8px 0" }}>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/perfil");
              }}
              style={{
                width: "100%",
                padding: "8px 16px",
                textAlign: "left",
                backgroundColor: creditosUsuario !== null && creditosUsuario <= 0 ? "#f3f4f6" : "transparent",
                border: "none",
                cursor: creditosUsuario !== null && creditosUsuario <= 0 ? "not-allowed" : "pointer",
                fontSize: "14px",
                color: creditosUsuario !== null && creditosUsuario <= 0 ? "#a1a1aa" : "#374151",
              }}
              disabled={creditosUsuario !== null && creditosUsuario <= 0}
              onMouseEnter={(e) => {
                if (!(creditosUsuario !== null && creditosUsuario <= 0)) e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = creditosUsuario !== null && creditosUsuario <= 0 ? "#f3f4f6" : "transparent";
              }}
            >
              👤 Ver Perfil
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/meus-pedidos");
              }}
              style={{
                width: "100%",
                padding: "8px 16px",
                textAlign: "left",
                backgroundColor: creditosUsuario !== null && creditosUsuario <= 0 ? "#f3f4f6" : "transparent",
                border: "none",
                cursor: creditosUsuario !== null && creditosUsuario <= 0 ? "not-allowed" : "pointer",
                fontSize: "14px",
                color: creditosUsuario !== null && creditosUsuario <= 0 ? "#a1a1aa" : "#374151",
              }}
              disabled={creditosUsuario !== null && creditosUsuario <= 0}
              onMouseEnter={(e) => {
                if (!(creditosUsuario !== null && creditosUsuario <= 0)) e.currentTarget.style.backgroundColor = "#f3f4f6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = creditosUsuario !== null && creditosUsuario <= 0 ? "#f3f4f6" : "transparent";
              }}
            >
              📦 Ver meus pedidos
            </button>

            {session.user?.role === "admin" && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/admin");
                }}
                style={{
                  width: "100%",
                  padding: "8px 16px",
                  textAlign: "left",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#374151",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#f3f4f6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                ⚙️ Painel Admin
              </button>
            )}

            <hr
              style={{
                margin: "8px 0",
                border: "none",
                borderTop: "1px solid #e5e7eb",
              }}
            />

            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              style={{
                width: "100%",
                padding: "8px 16px",
                textAlign: "left",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "#ef4444",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fef2f2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              🚪 Sair
            </button>

            {/* Créditos disponíveis */}
            <div
              style={{
                width: "100%",
                padding: "8px 16px",
                fontSize: "13px",
                color: "#6b7280",
                textAlign: "center",
              }}
            >
              {creditosUsuario !== null && creditosGlobais !== null ? (
                creditosUsuario > 0 ? (
                  `Créditos: ${creditosUsuario} / ${creditosGlobais}`
                ) : (
                  <span>
                    Créditos esgotados.<br />
                    Próximo ciclo: <b>{proximoCiclo}</b>
                  </span>
                )
              ) : (
                "Carregando créditos..."
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
