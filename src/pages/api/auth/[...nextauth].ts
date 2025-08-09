import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "../../../lib/db";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Admin hardcoded
        if (
          credentials.email === "admin" &&
          credentials.password ===
            "af89d56f8b00bf3d32a3eee1962ed989bb29434c2e1dd7c6836c8b0bcb5175c0"
        ) {
          return {
            id: "admin",
            name: "Administrador",
            email: "admin@guia-organico.com",
            role: "admin",
          };
        }

        try {
          const client = await clientPromise;
          const db = client.db("guia-organico");
          const user = await db.collection("users").findOne({
            email: credentials.email,
          });

          // Verificação simples para MVP (em produção use bcrypt)
          if (user && user.password === credentials.password) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role || "user",
            };
          }

          return null;
        } catch (error) {
          console.error("Erro na autenticação:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Para login com Google, salvar usuário no banco se não existir
      if (account?.provider === "google") {
        try {
          const client = await clientPromise;
          const db = client.db("guia-organico");

          const existingUser = await db.collection("users").findOne({
            email: user.email,
          });

          if (!existingUser) {
            await db.collection("users").insertOne({
              name: user.name,
              email: user.email,
              role: "user",
              provider: "google",
              createdAt: new Date(),
            });
          }
        } catch (error) {
          console.error("Erro ao salvar usuário do Google:", error);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Se é uma URL relativa, adiciona o baseUrl
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Se a URL já contém o baseUrl, retorna como está
      else if (new URL(url).origin === baseUrl) return url;
      // Caso contrário, redireciona para a home
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
