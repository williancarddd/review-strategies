'use client';
import { ReactNode } from 'react';
import Image from 'next/image';
import { LoginRightPanel } from './login-right';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Área do Formulário à Esquerda */}
      <div className="flex-1 bg-slate-950 text-white flex items-center justify-center p-8">
        {children}
      </div>

      {/* Área de Imagem à Direita */}
      <LoginRightPanel />
      
    </div>
  );
}
