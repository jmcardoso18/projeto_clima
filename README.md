# ☀️ Previsão do Tempo Simples

Uma aplicação web simples, limpa e responsiva para exibir a previsão do tempo atual, máxima e mínima, além de variáveis como umidade, vento e precipitação, utilizando a API Open-Meteo.

## 📁 Estrutura do Projeto

A estrutura do projeto está organizada de forma modular, separando a lógica (JavaScript), os estilos (CSS) e os arquivos de configuração.

```bash
/PROJETO_CLIMA 
|-- /assets 
|   |-- /css 
|   |   |-- styles.css (Estilos principais) 
|   |-- /js 
|   |   |-- api.js (Lógica principal, API e DOM) 
|   |-- /tests 
|   |   |-- api.test.js (Opcional: Arquivos de Teste) 
|-- .gitignore 
|-- index.html (Página principal) 
|-- README.md 
|-- LICENSE 
|-- NOTICE.md 
|-- package.json 
|-- package-lock.json

## 🚀 **Funcionalidades Principais**

### 🔍 Busca de cidades
- **Busca Direta:** Pesquisa o nome da cidade para obter as coordenadas através da API Geocoding.
- **Cache Inteligente:** Armazena resultados em cache localmente por 10 minutos para otimizar o desempenho.
- **Tratamento de Erros:** Exibe mensagens amigáveis em caso de cidade não encontrada ou falha na API.

### 🌡️ Dados climáticos exibidos
- **Temperatura Atual** (com ícone dinâmico)
- Temperatura **Mínima e Máxima**
- **Velocidade do Vento**
- **Umidade Relativa** (da hora atual)
- **Precipitação** (somatório do dia)
- **Condições Interpretadas** (Céu limpo, Chuva fraca, etc.)
- **Fundo Dinâmico:** O fundo muda de cor e gradiente conforme a condição climática (Noite, Chuva, Sol).

### 📦 Funcionalidades Avançadas (Próximas Tarefas)
- Sugestões automáticas / Digitação assistida.
- Suporte a dados como **Pressão atmosférica** e **Índice UV** (requer ajuste na URL da API).
- Sistema de **favoritos** usando LocalStorage.
- Modo claro/escuro.
- Melhorias de acessibilidade (WCAG).

---

## 🛠️ **Tecnologias Utilizadas**
- **HTML5**
- **CSS3** (Variáveis, Flexbox, Grid, Responsividade)
- **JavaScript Vanilla (ES6+)**
- **Open-Meteo API** (Geocoding API + Forecast API)
- **Weather Icons** (Via CDN)
- **LocalStorage** (Para o sistema de Cache)

---

## 📦 Instalação

O projeto roda inteiramente no navegador, sem a necessidade de um servidor backend.

1. **Clone o repositório:**
```sh
git clone [https://github.com/jmcardoso18/](https://github.com/jmcardoso18/projeto_clima)
````
Acesse o diretório:

````
Bash

cd projeto_clima

Abra o arquivo: Abra o arquivo index.html no seu navegador de preferência.

▶️ Execução

Basta abrir o arquivo index.html.

Ou utilizar uma extensão de IDE, como o Live Server (VSCode), para facilitar o desenvolvimento.
````
🧪 Testes

Opcional dependendo da etapa, incluir testes simulados ou unitários de funções JS.

Exemplo:
````
Bash

npm test
````

🔐 Segurança e Privacidade

Esta aplicação:

* ❌ Não coleta dados pessoais 
* ❌ Não armazena localização real do usuário 
* 🔒 Utiliza apenas dados públicos da API Open-Meteo


⚠️ Aviso de Privacidade: A aplicação pode enviar informações da cidade consultada para a API Open-Meteo, exclusivamente para obter dados climáticos. Nenhuma informação é armazenada nos servidores do desenvolvedor.

📜 Licença

O projeto está licenciado sob a MIT License. Arquivo completo disponível em: LICENSE.

📢 Créditos & Atribuições

API de Dados Climáticos: Open-Meteo (Licença: CC BY 4.0)

Ícones: Weather Icons

Layout e componentes inspirados em práticas modernas de UI/UX.

Avisos completos em NOTICE.md.

👩‍💻 Autor: JAMILA MORAES CARDOSO