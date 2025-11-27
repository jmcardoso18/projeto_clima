# 📌 Aplicativo de Previsão do Tempo — Open-Meteo API

Este projeto é uma aplicação moderna de **consulta de clima em tempo real**, desenvolvida com **HTML, CSS e JavaScript**, consumindo a API da **Open-Meteo**. A interface é responsiva, intuitiva e exibe informações detalhadas sobre o clima da cidade pesquisada.

---

## 🌤️ **Funcionalidades**

### 🔍 Busca por Cidade

* Localiza coordenadas (latitude e longitude) usando a **API de Geocodificação**.
* Retorna automaticamente o nome completo do local (cidade + país).

### 🌡️ Dados Climáticos Apresentados

* Temperatura Atual
* Máxima e Mínima do Dia
* Umidade
* Velocidade do Vento
* Precipitação do dia
* Condição do céu (ex.: Limpo, Nublado, Chuva…)
* Ícone dinâmico representando o clima
* Estilo visual do fundo muda conforme a condição atual

### ⚡ Cache Inteligente (LocalStorage)

* Armazena resultados por **10 minutos**
* Aumenta velocidade e reduz número de requisições

### 📱 Design Responsivo

* Interface adaptada para celular, tablet e desktop
* Cartões de variáveis exibidos em **grid responsivo**

---

## 🛠️ **Tecnologias Utilizadas**

| Tecnologia            | Uso                                   |
| --------------------- | ------------------------------------- |
| **HTML5**             | Estrutura da aplicação                |
| **CSS3**              | Estilização e layout responsivo       |
| **Weather Icons**     | Ícones animados/climáticos            |
| **JavaScript (ES6+)** | Lógica da aplicação + consumo de API  |
| **Open-Meteo API**    | Dados meteorológicos e geocodificação |

---

## 🔗 **APIs Utilizadas**

### 📍 1. API de Geocoding

Usada para transformar o nome da cidade em coordenadas.

`https://geocoding-api.open-meteo.com/v1/search?name=CIDADE&count=1&language=pt&format=json`

### ☁️ 2. API de Previsão

Consome dados detalhados do clima:

* Temperaturas
* Umidade relativa
* Vento
* Clima atual
* Precipitação

`https://api.open-meteo.com/v1/forecast?...`

---

## 📂 **Estrutura de Arquivos**

```
📁 projeto/
 ├── index.html
 ├── assets/
 │    ├── CSS/
 │    │     └── styles.css
 │    └── JS/
 │          └── api.js
 └── README.md
```

---

## ▶️ **Como Executar o Projeto**

1. Baixe ou clone o repositório:

   ```bash
   git clone https://github.com/seu-repo.git
   ```
2. Abra o arquivo **index.html** no navegador.
3. Digite o nome de uma cidade.
4. Veja instantaneamente a previsão.

---

## 🧠 **Principais Lógicas Implementadas**

### ✔ Conversão de Cidade → Coordenadas

Valida, busca e trata erros da API.

### ✔ Consumo de Dados Climáticos

Recupera dados atuais, horários e diários.

### ✔ Tratamento de Erros

* Cidade inválida
* Falha de conexão
* Dados incompletos

### ✔ Função de Estilo Dinâmico

Altera automaticamente o fundo conforme o clima:

* céu limpo
* nublado
* chuva
* neve
* noite

### ✔ Cache com Expiração

Evita requisições repetidas.

---

## 🖼️ **Componentes Visuais

* Ícone principal do clima
* Temperatura grande e destacada
* Cartões em grid:

  * Umidade
  * Vento
  * Precipitação
* Botão redondo "Voltar" estilizado com hover

---

## 🧪 **Possíveis Melhorias Futuras**

* Previsão de 7 dias
* Gráfico de variação de temperatura
* Suporte a geolocalização automática
* Tema escuro manual
* Histórico de buscas

---

## 👩‍💻 **Autor(a)**

[JAMILA MORAES CARDOSO](https://github.com/jmcardoso18)


