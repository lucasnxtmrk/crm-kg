'use client';

import { Link } from '@/i18n/routing';
import LoginForm from "@/components/partials/auth/login-form";
import Image from "next/image";
import Logo from "@/components/logo";

export default function Login3() {
  return (
    <div
      className="flex w-full min-h-screen h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(/images/all-img/page-bg.png)`,
      }}
    >
      <div className="bg-white dark:bg-default-50 p-10 rounded-md shadow-md w-full max-w-md space-y-8">
        {/* Logo no topo */}
        <div className="flex justify-center">
          <Link href="/">
          <Image
      src="images\logo\logo-c-white.svg" // 🔥 Aqui coloque o caminho correto da sua imagem
      alt="Logo"
      width={150}  // 📐 ajuste o tamanho como quiser
      height={50}  // 📐 ajuste o tamanho como quiser
      className="object-contain"
    />
          </Link>
        </div>

        {/* Título */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-default-900">Entrar na Plataforma</h1>
          <p className="text-sm text-default-500">Acesse sua conta para continuar</p>
        </div>

        {/* Formulário de login */}
        <LoginForm />
      </div>
    </div>
  );
}
