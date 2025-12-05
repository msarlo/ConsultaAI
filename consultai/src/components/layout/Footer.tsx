import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-2 px-4 sm:px-6 lg:px-8" style={{backgroundColor: '#1e5ba8'}} aria-label="Rodapé principal">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="text-sm mb-4 sm:mb-0 text-center sm:text-left" aria-label="Informações da Prefeitura">
          <h2 className="font-semibold text-white">Prefeitura de Juiz de Fora</h2>
          <p className="text-gray-200">Av. Brasil, 2001 | Centro - Juiz de Fora/MG - CEP: 36060-010</p>
          <p className="text-gray-200">
            Telefone: (32) 3690-7392 | E-mail: <a href="mailto:secretariadesaude@pjf.mg.gov.br" className="hover:underline">secretariadesaude@pjf.mg.gov.br</a>
          </p>
          <p className="text-gray-200 mt-1">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
        <div className="flex items-center" aria-label="Redes sociais">
          <Link
            href="https://linktr.ee/prefeiturajuizdefora"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Acesse nossos links e redes sociais"
            className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Nossos Links
          </Link>
        </div>
      </div>
    </footer>
  );
}
