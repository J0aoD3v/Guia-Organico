import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import "../styles/globals.css";
import { useEffect, useState } from "react";

type AppPropsWithAuth = AppProps & {
  pageProps: {
    session?: Session;
  };
};

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) {
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <SessionProvider session={session}>
      {splash ? (
        <div style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          background: "#f8fafc",
          transition: "opacity 300ms"
        }}>
          <div style={{ fontSize: 56 }}>🌱</div>
          <div style={{ marginTop: 8, fontWeight: 800, letterSpacing: 1 }}>GUIA ORGÂNICO</div>
          <div style={{ color: "#6b7280", marginTop: 4 }}>O Aplicativo que Simplifica a Agricultura Orgânica</div>
        </div>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}
