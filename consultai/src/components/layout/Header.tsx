"use client";
import React, { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LinkButton } from '@/components/layout/LinkButton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

type Props = {
  children?: ReactNode;
};

export function Header({ children }: Props) {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="w-full py-7 px-4 sm:px-6 lg:px-8 shadow-md" style={{backgroundColor: '#1e5ba8'}} aria-label="Cabeçalho principal">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex flex-col md:flex-row items-center gap-1 md:gap-4" aria-label="Ir para página inicial">
          <div className="w-40 md:w-auto">
            <Image
              src="/images/logoBranco.png"
              alt="Logo Prefeitura de Juiz de Fora"
              width={300}
              height={100}
            />
          </div>
          <div className="hidden md:block text-white text-4xl font-light">|</div>
          <div className="flex items-center gap-2">
            <Image
              src="/images/logoChatBot.svg"
              alt="Logo do ChatBot ConsultAI"
              width={50}
              height={50}
            />
            <div className="font-black text-xl md:text-3xl tracking-wider text-white" aria-label="Nome do sistema">ConsultAI</div>
          </div>
        </Link>
        {children && (
          <nav className="hidden md:flex gap-6 items-center">
            {children}
          </nav>
        )}
        <nav className="flex md:gap-4 items-center">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <span className="hidden md:block text-white text-sm">
                Olá, {user.nome}
              </span>
              <button
                onClick={handleLogout}
                className="hover:bg-white hover:text-black px-4 py-2 rounded text-white cursor-pointer transition duration-300 ease-in-out"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className='hidden md:flex w-46 justify-between gap-2'>
              <LinkButton href="/cadastro" label="Cadastro" />
              <LinkButton href="/login" label="Login" />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
