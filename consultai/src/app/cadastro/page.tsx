"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Toast from '@/components/Toast';
import { cadastroSchema } from '@/lib/validations';
import { z } from 'zod';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erros, setErros] = useState<{ nome?: string; email?: string; senha?: string; confirmarSenha?: string }>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErros({});
    
    try {
      // Validação com Zod
      const validatedData = cadastroSchema.parse({ nome, email, senha, confirmarSenha });
      
      // Se passou na validação, faz o cadastro
      await register(validatedData.nome, validatedData.email);
      setToast({ message: 'Cadastro realizado com sucesso!', type: 'success' });
      setTimeout(() => router.push('/'), 1000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Erros de validação do Zod
        const fieldErrors: { nome?: string; email?: string; senha?: string; confirmarSenha?: string } = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
          }
        });
        setErros(fieldErrors);
      } else {
        setToast({ message: 'Erro ao fazer cadastro. Tente novamente.', type: 'error' });
      }
    }
  };

  return (
    <main className="flex-1 w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen py-8">
      <form className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-3 my-auto" onSubmit={handleSubmit} aria-label="Formulário de cadastro">
        <h2 className="text-2xl font-bold text-blue-700 mb-1 text-center">Cadastro</h2>
        
        <div>
          <label htmlFor="nome" className="font-medium text-gray-700 block mb-1">Nome</label>
          <input 
            id="nome" 
            type="text" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none text-gray-900 bg-white placeholder:text-gray-400 ${
              erros.nome ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Digite seu nome completo" 
          />
          {erros.nome && <span className="text-red-500 text-sm mt-1 block">{erros.nome}</span>}
        </div>

        <div>
          <label htmlFor="email" className="font-medium text-gray-700 block mb-1">E-mail</label>
          <input 
            id="email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none text-gray-900 bg-white placeholder:text-gray-400 ${
              erros.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Digite seu e-mail" 
          />
          {erros.email && <span className="text-red-500 text-sm mt-1 block">{erros.email}</span>}
        </div>

        <div>
          <label htmlFor="senha" className="font-medium text-gray-700 block mb-1">Senha</label>
          <input 
            id="senha" 
            type="password" 
            value={senha} 
            onChange={e => setSenha(e.target.value)} 
            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none text-gray-900 bg-white placeholder:text-gray-400 ${
              erros.senha ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Mínimo 6 caracteres" 
          />
          {erros.senha && <span className="text-red-500 text-sm mt-1 block">{erros.senha}</span>}
          <p className="text-xs text-gray-500 mt-1">Deve conter maiúscula, minúscula e número</p>
        </div>

        <div>
          <label htmlFor="confirmarSenha" className="font-medium text-gray-700 block mb-1">Confirmar Senha</label>
          <input 
            id="confirmarSenha" 
            type="password" 
            value={confirmarSenha} 
            onChange={e => setConfirmarSenha(e.target.value)} 
            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none text-gray-900 bg-white placeholder:text-gray-400 ${
              erros.confirmarSenha ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Digite a senha novamente" 
          />
          {erros.confirmarSenha && <span className="text-red-500 text-sm mt-1 block">{erros.confirmarSenha}</span>}
        </div>

        <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-3 font-bold hover:bg-blue-700 transition-colors mt-1">
          Cadastrar
        </button>
        <Link href="/login" className="text-blue-600 text-sm text-center hover:underline">
          Já tem conta? Faça login
        </Link>
      </form>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </main>
  );
}
