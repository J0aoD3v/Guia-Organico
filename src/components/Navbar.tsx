import Link from "next/link";
import UserAvatar from "./auth/UserAvatar";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <nav style={{ borderBottom: "1px solid #e5e7eb", padding: "12px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button 
            aria-label="Abrir menu" 
            onClick={() => setOpen(!open)} 
            style={{ 
              fontSize: 20, 
              background: "none", 
              border: "none", 
              cursor: "pointer",
              padding: "8px",
              borderRadius: "4px"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            ☰
          </button>
          <Link href="/" style={{ textDecoration: "none", color: "inherit", fontWeight: 700, fontSize: "18px" }}>
            🌱 Guia Orgânico
          </Link>
        </div>
        <UserAvatar />
      </div>

      {open && (
        <div style={{ 
          marginTop: 10, 
          display: "grid", 
          gap: 4,
          backgroundColor: "#f9fafb",
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #e5e7eb"
        }}>
          <Link 
            href="/" 
            style={{ 
              color: "#111827", 
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: router.pathname === "/" ? "#e5e7eb" : "transparent"
            }}
            onMouseEnter={(e) => {
              if (router.pathname !== "/") e.currentTarget.style.backgroundColor = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              if (router.pathname !== "/") e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => setOpen(false)}
          >
            🏠 Início
          </Link>
          
          <Link 
            href="/buscar" 
            style={{ 
              color: "#111827", 
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: router.pathname === "/buscar" ? "#e5e7eb" : "transparent"
            }}
            onMouseEnter={(e) => {
              if (router.pathname !== "/buscar") e.currentTarget.style.backgroundColor = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              if (router.pathname !== "/buscar") e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => setOpen(false)}
          >
            🔍 Pesquisar
          </Link>
          
          <Link 
            href="/categorias" 
            style={{ 
              color: "#111827", 
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: router.pathname.startsWith("/categorias") ? "#e5e7eb" : "transparent"
            }}
            onMouseEnter={(e) => {
              if (!router.pathname.startsWith("/categorias")) e.currentTarget.style.backgroundColor = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              if (!router.pathname.startsWith("/categorias")) e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => setOpen(false)}
          >
            📂 Categorias
          </Link>
          
          <Link 
            href="/pedidos/novo" 
            style={{ 
              color: "#111827", 
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: router.pathname === "/pedidos/novo" ? "#e5e7eb" : "transparent"
            }}
            onMouseEnter={(e) => {
              if (router.pathname !== "/pedidos/novo") e.currentTarget.style.backgroundColor = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              if (router.pathname !== "/pedidos/novo") e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => setOpen(false)}
          >
            📋 Solicitar Autorização
          </Link>
          
          <Link 
            href="/sobre" 
            style={{ 
              color: "#111827", 
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: router.pathname === "/sobre" ? "#e5e7eb" : "transparent"
            }}
            onMouseEnter={(e) => {
              if (router.pathname !== "/sobre") e.currentTarget.style.backgroundColor = "#e5e7eb";
            }}
            onMouseLeave={(e) => {
              if (router.pathname !== "/sobre") e.currentTarget.style.backgroundColor = "transparent";
            }}
            onClick={() => setOpen(false)}
          >
            ℹ️ Sobre o App
          </Link>
        </div>
      )}
    </nav>
  );
}
