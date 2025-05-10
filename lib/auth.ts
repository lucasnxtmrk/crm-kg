import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserByEmail } from "@/lib/data"; // ✅ novo caminho

export const authOptions: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google,
    GitHub,
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || typeof credentials.email !== "string") {
          throw new Error("E-mail inválido");
        }

        const user = await getUserByEmail(credentials.email); // 🔐 busca real no banco

        if (!user || user.senha !== credentials.password) {
          throw new Error("Email ou senha incorretos");
        }

        return user;
      },
    }),
  ],
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
