"use client";

import ForgotPass from "@/components/partials/auth/forgot-pass";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";


export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">

            <h1 className="text-xl font-semibold text-default-900">
              Recuperar Senha
            </h1>
            <p className="text-sm text-default-500 mt-1">
              Digite seu e-mail para receber o link de redefinição.
            </p>
          </div>

          <ForgotPass />

          <p className="text-xs text-default-500 text-center">
            Já lembrou sua senha?{" "}
            <a href="/" className="text-primary hover:underline font-medium">
              Voltar ao login
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
