import Link from "next/link";
import UserAvatar from "./auth/UserAvatar";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ borderBottom: "1px solid #e5e7eb", padding: "12px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button aria-label="Abrir menu" onClick={() => setOpen(!open)} style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer" }}>☰</button>
          <Link href="/" style={{ textDecoration: "none", color: "inherit", fontWeight: 700 }}>
            🌱 Guia Orgânico
          </Link>
        </div>
        <UserAvatar />
      </div>

      {open && (
        <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
          <Link href="/buscar" style={{ color: "#111827" }}>Pesquisar</Link>
          <Link href="/categorias" style={{ color: "#111827" }}>Categorias</Link>
          <Link href="/pedidos/novo" style={{ color: "#111827" }}>Solicitar Autorização</Link>
          <Link href="/sobre" style={{ color: "#111827" }}>Sobre o App</Link>
        </div>
      )}
    </nav>
  );
}
