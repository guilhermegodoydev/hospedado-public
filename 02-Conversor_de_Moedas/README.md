# 💱 Conversor de Moedas

Um conversor de moedas **em tempo real** que utiliza uma API externa para consultar valores atualizados e permite visualizar **gráficos interativos** com base em diferentes períodos.

## ✨ Funcionalidades

- Conversão entre moedas usando dados atualizados via API.
- Gráficos dinâmicos com a variação da cotação nos períodos:
  - Últimas 24 horas
  - Últimos 7 dias
  - Último mês
  - Último ano

## 🧰 Tecnologias Utilizadas

- **HTML5**
- **JavaScript (Fetch API)**
- **Tailwind CSS** (build via CLI)
- **[Chart.js](https://www.chartjs.org/)** — para renderização dos gráficos
- **[Day.js](https://day.js.org/)** - para manipulação de dias para a API

## 🚀 Como usar

### ✅ Versão Online

Acesse a versão hospedada: [https://moedaio.netlify.app/](https://moedaio.netlify.app/)

### 💻 Rodar Localmente

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/conversor-moedas.git
   cd conversor-moedas
   ```

2. Instale as dependências (apenas para gerar o CSS do Tailwind):

   ```bash
   npm install
   ```

3. Gere o CSS do Tailwind:

   ```bash
   npx tailwindcss -i ./src/css/input.css -o ./dist/output.css --minify
   ```

4. Abra o arquivo `index.html` no navegador.

> **Obs:** Todo o projeto roda no navegador (client-side).  
> Não é necessário backend.