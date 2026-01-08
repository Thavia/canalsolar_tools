import React from 'react'
import ReactDOM from 'react-dom/client'
import SimuladorFioBPage from './components/SimuladorFioBPage.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'

// Função para inicializar o widget em um elemento específico
function initWidget(elementId: string = 'simulador') {
  const container = document.getElementById(elementId);
  
  if (!container) {
    console.error(`Elemento com id "${elementId}" não encontrado.`);
    return;
  }

  // Limpar o container antes de montar
  container.innerHTML = '';

  // Criar root e renderizar
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <SimuladorFioBPage />
      </HelmetProvider>
    </React.StrictMode>
  );
}

// Auto-inicializar se o elemento existir no DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initWidget('simulador');
  });
} else {
  initWidget('simulador');
}

// Exportar função para uso externo
(window as any).initSimuladorFioB = initWidget;

