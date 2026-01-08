(function() {
  'use strict';
  
  var WIDGET_ID = 'simulador';
  
  // Verificar se já foi carregado
  if (window.simuladorFioBLoaded) {
    return;
  }
  window.simuladorFioBLoaded = true;
  
  // Detectar URL base automaticamente a partir do script atual
  function getBaseUrl() {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src;
      if (src && src.indexOf('loader.js') !== -1) {
        return src.substring(0, src.lastIndexOf('/'));
      }
    }
    // Fallback: usar window.location se não encontrar
    return window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
  }
  
  var BASE_URL = getBaseUrl();
  
  // Função para criar o elemento se não existir
  function ensureContainer() {
    var container = document.getElementById(WIDGET_ID);
    if (!container) {
      container = document.createElement('div');
      container.id = WIDGET_ID;
      document.body.appendChild(container);
    }
    return container;
  }
  
  // Função para carregar CSS - tenta múltiplos caminhos possíveis
  function loadCSS(baseUrl) {
    // Verificar se já foi carregado
    var existing = document.querySelector('link[href*="index.css"]');
    if (existing) {
      return;
    }
    
    // Tentar carregar o CSS (pode ter hash ou não)
    var possiblePaths = [
      baseUrl + '/assets/index.css',
      baseUrl + '/assets/embed.css'
    ];
    
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = possiblePaths[0];
    
    // Se falhar, tentar o próximo caminho
    link.onerror = function() {
      if (possiblePaths[1]) {
        link.href = possiblePaths[1];
      }
    };
    
    document.head.appendChild(link);
  }
  
  // Função para carregar script
  function loadScript(src, callback) {
    // Verificar se já foi carregado
    var existing = document.querySelector('script[src="' + src + '"]');
    if (existing) {
      if (callback) callback();
      return;
    }
    var script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    script.onload = callback;
    script.onerror = function() {
      console.error('Erro ao carregar o script do simulador Fio B');
    };
    document.head.appendChild(script);
  }
  
  // Inicializar
  function init() {
    ensureContainer();
    
    // Carregar CSS
    loadCSS(BASE_URL + '/assets/index.css');
    
    // Carregar JS principal
    loadScript(BASE_URL + '/assets/embed.js', function() {
      // Widget será inicializado automaticamente pelo embed.js
    });
  }
  
  // Executar quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

