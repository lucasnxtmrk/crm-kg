'use client';

import { Link } from '@/i18n/routing';
import LoginForm from "@/components/partials/auth/login-form";
import Logo from "@/components/logo";
import Image from 'next/image';


export default function Login3() {
  return (
    <div
      className="flex w-full min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{backgroundColor:"#230621"}}
    >
      <div className="bg-white dark:bg-default-50 p-10 rounded-md shadow-md w-full max-w-md space-y-8">
        
        {/* Logo centralizada e maior */}
        <div className="flex justify-center items-center mb-2">
          <Link href="/">
            <div className="w-[180px] h-[60px] relative">
  <Image
    src="/images/logo/logo.svg"
    alt="Logo"
    fill
    className="object-contain"
  />
</div>
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
