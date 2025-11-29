import React from 'react';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="py-6 px-4 sm:px-6 lg:px-8" style={{backgroundColor: '#1e5ba8'}} aria-label="Rodapé principal">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="text-sm mb-6 sm:mb-0 text-center sm:text-left" aria-label="Informações da Prefeitura">
          <h1 className="font-semibold text-blue-300 ">Prefeitura de Juiz de Fora</h1>
          <p className="text-gray-200">Av. Brasil, 2001 | Centro - Juiz de Fora/MG - CEP: 36060-010</p>
          <p className="text-gray-200 mt-1">
            © {new Date().getFullYear()} Todos os direitos reservados.
          </p>
        </div>
        <div className="flex items-center space-x-4 text-white" aria-label="Redes sociais">
          <Link href="https://www.facebook.com/JuizdeForaPJF/" target="_blank" rel="noopener noreferrer" aria-label="Facebook da Prefeitura de Juiz de Fora" title="Facebook" className="text-white hover:text-blue-200 transition-colors flex items-center">
            <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link href="https://x.com/prefeiturajf" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter) da Prefeitura de Juiz de Fora" title="X (Twitter)" className="text-white hover:text-blue-200 transition-colors flex items-center">
            <FaTwitter className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            <span className="sr-only">X (Twitter)</span>
          </Link>
          <Link href="https://www.youtube.com/JuizdeForaPJF" target="_blank" rel="noopener noreferrer" aria-label="YouTube da Prefeitura de Juiz de Fora" title="YouTube" className="text-white hover:text-blue-200 transition-colors flex items-center">
            <FaYoutube className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            <span className="sr-only">YouTube</span>
          </Link>
          <Link href="https://www.instagram.com/prefeiturajuizdefora/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Prefeitura de Juiz de Fora" title="Instagram" className="text-white hover:text-blue-200 transition-colors flex items-center">
            <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            <span className="sr-only">Instagram</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
