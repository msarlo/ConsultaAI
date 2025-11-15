import React from 'react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 rounded-lg shadow-sm">
      <div className="px-6 py-4 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">ConsultaAI</h1>
        </div>
      </div>
    </header>
  );
}
