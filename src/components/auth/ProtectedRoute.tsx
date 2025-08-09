import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Ainda carregando

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    if (requiredRole && session.user?.role !== requiredRole) {
      router.push("/auth/error?error=SessionRequired");
      return;
    }
  }, [session, status, router, requiredRole]);

  if (status === "loading") {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <p>Redirecionando para login...</p>
      </div>
    );
  }

  if (requiredRole && session.user?.role !== requiredRole) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <p>Acesso negado. Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return <>{children}</>;
}
