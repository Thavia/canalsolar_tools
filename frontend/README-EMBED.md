# Widget Embedável - Simulador Fio B

Este documento explica como usar o widget Simulador Fio B como um componente embedável em outros sites.

## Como Funciona

O widget pode ser incorporado em qualquer site HTML simplesmente adicionando um elemento `<div>` e incluindo um script loader.

## Instalação

### 1. Build do Widget

Primeiro, gere os arquivos de build do widget:

```bash
npm run build:embed
```

Isso irá gerar os seguintes arquivos na pasta `dist/`:
- `loader.js` - Script loader que deve ser incluído nos sites
- `assets/embed.js` - JavaScript principal do widget
- `assets/index.css` - Estilos do widget
- Outros assets necessários

### 2. Hospedar os Arquivos

Faça upload dos arquivos da pasta `dist/` para seu servidor web. Por exemplo:
- `https://seu-dominio.com/loader.js`
- `https://seu-dominio.com/assets/embed.js`
- `https://seu-dominio.com/assets/index.css`

## Uso em Outros Sites

### Método Simples

Adicione o seguinte código HTML onde deseja que o widget apareça:

```html
<div id="simulador"></div>
<script src="https://seu-dominio.com/loader.js"></script>
```

### Exemplo Completo

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Site</title>
</head>
<body>
    <h1>Bem-vindo ao meu site</h1>
    
    <!-- Widget Simulador Fio B -->
    <div id="simulador"></div>
    
    <!-- Script loader (deve ser o último antes do </body>) -->
    <script src="https://seu-dominio.com/loader.js"></script>
</body>
</html>
```

## Personalização

### ID do Container

Por padrão, o widget procura por um elemento com `id="simulador"`. Se você quiser usar um ID diferente, você pode:

1. Usar o ID padrão `simulador`
2. Ou chamar manualmente a função de inicialização:

```html
<div id="meu-widget"></div>
<script src="https://seu-dominio.com/loader.js"></script>
<script>
  // Aguardar o carregamento do widget
  window.addEventListener('load', function() {
    if (window.initSimuladorFioB) {
      window.initSimuladorFioB('meu-widget');
    }
  });
</script>
```

## Requisitos

- O widget requer um elemento container no DOM
- O script loader deve ser carregado após o elemento container estar no DOM
- Recomenda-se colocar o script antes do fechamento da tag `</body>`

## Desenvolvimento

Para testar o widget localmente durante o desenvolvimento:

```bash
# Terminal 1: Iniciar servidor de desenvolvimento
npm run dev

# Em outro terminal, abra o arquivo embed-example.html no navegador
# ou use um servidor local simples
```

## Estrutura de Arquivos

```
frontend/
├── src/
│   ├── embed.tsx          # Ponto de entrada do widget embedável
│   └── components/
│       └── SimuladorFioBPage.tsx
├── public/
│   └── loader.js          # Script loader para sites externos
├── embed.html             # HTML para build do embed
├── embed-example.html     # Exemplo de uso
└── dist/                  # Arquivos gerados pelo build
    ├── loader.js
    └── assets/
        ├── embed.js
        └── index.css
```

## Notas Importantes

1. **CORS**: Certifique-se de que seu servidor permite requisições CORS se o widget precisar fazer chamadas à API de um domínio diferente.

2. **API URL**: O widget usa a variável de ambiente `VITE_API_URL` para determinar a URL da API. Certifique-se de configurá-la corretamente no build.

3. **Estilos**: O widget inclui seus próprios estilos (Tailwind CSS). Ele não deve conflitar com estilos do site hospedeiro, mas pode ser necessário ajustar se houver conflitos.

4. **Responsividade**: O widget é totalmente responsivo e se adapta ao tamanho do container.

## Suporte

Para problemas ou dúvidas, consulte a documentação principal do projeto ou entre em contato com a equipe de desenvolvimento.

