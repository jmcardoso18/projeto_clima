// Constantes para elementos do DOM
const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');

// Função para exibir o resultado no Frontend
function displayWeather(cityName, data) {
    weatherResult.classList.remove('visible'); // Esconde o resultado anterior
    if (!data || !data.current_weather) {
        weatherResult.innerHTML = `<p class="error">Dados do clima não disponíveis para ${cityName}.</p>`;
        weatherResult.classList.add('visible'); // Torna visível para mostrar o erro
        return;
    }

    const { temperature, windspeed, winddirection, time } = data.current_weather;
    const weatherCode = data.current_weather.weathercode;

    let weatherDescription = 'Condição Desconhecida';
    if (weatherCode === 0) weatherDescription = 'Céu Limpo ☀️';
    else if (weatherCode >= 1 && weatherCode <= 3) weatherDescription = 'Parcialmente Nublado 🌥️';
    else if (weatherCode >= 51 && weatherCode <= 67) weatherDescription = 'Chuva 🌧️';
    else if (weatherCode >= 71 && weatherCode <= 75) weatherDescription = 'Neve ❄️';

    weatherResult.innerHTML = `
        <h2>Clima Atual em ${cityName}</h2>
        <p><strong>Temperatura:</strong> ${temperature} °C</p>
        <p><strong>Condição:</strong> ${weatherDescription}</p>
        <p><strong>Velocidade do Vento:</strong> ${windspeed} km/h</p>
        <p><strong>Direção do Vento:</strong> ${winddirection}°</p>
        <p class="small-text">Atualizado em: ${new Date(time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</p>
    `;
    weatherResult.classList.add('visible'); // Torna o resultado visível
}

// ... (código existente) ...

async function getWeatherData(cityName) {
    weatherResult.classList.remove('visible'); // Esconde o resultado enquanto busca
    weatherResult.innerHTML = `<p>Buscando clima para **${cityName}**...</p>`;
    weatherResult.classList.add('visible'); // Mostra a mensagem de "Buscando..."

    const coords = await getCoordinates(cityName);

    if (!coords) {
        weatherResult.innerHTML = `<p class="error">⚠️ Cidade **${cityName}** não encontrada. Por favor, verifique a escrita.</p>`;
        weatherResult.classList.add('visible'); // Mostra a mensagem de erro
        return;
    }

    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

    try {
        const response = await fetch(weatherApiUrl);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        displayWeather(cityName, data);

    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        weatherResult.innerHTML = `<p class="error">❌ Ocorreu um erro ao obter os dados do clima. Tente novamente mais tarde.</p>`;
        weatherResult.classList.add('visible'); // Mostra a mensagem de erro
    }
}

// Função para buscar coordenadas da cidade
async function getCoordinates(cityName) {
    const geoApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=pt&format=json`;

    try {
        const response = await fetch(geoApiUrl);
        if (!response.ok) {
            throw new Error(`Erro de rede ao buscar coordenadas: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Verifica se algum resultado foi encontrado
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
                latitude: result.latitude,
                longitude: result.longitude
            };
        } else {
            return null; // Cidade não encontrada
        }
    } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        return null;
    }
}

// Função principal para buscar os dados do clima
async function getWeatherData(cityName) {
    weatherResult.innerHTML = `<p>Buscando clima para **${cityName}**...</p>`;

    // 1. Obter Latitude e Longitude
    const coords = await getCoordinates(cityName);

    if (!coords) {
        weatherResult.innerHTML = `<p class="error">⚠️ Cidade **${cityName}** não encontrada. Por favor, verifique a escrita.</p>`;
        return;
    }

    // 2. Montar a URL da API do Clima
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

    try {
        // 3. Fazer a requisição HTTP (GET)
        const response = await fetch(weatherApiUrl);

        if (!response.ok) {
            // Lança um erro se a resposta HTTP não for bem-sucedida (status 4xx ou 5xx)
            throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // 4. Tratar e Exibir os dados
        displayWeather(cityName, data);

    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        weatherResult.innerHTML = `<p class="error">❌ Ocorreu um erro ao obter os dados do clima. Tente novamente mais tarde.</p>`;
    }
}


// Event Listener para o formulário
weatherForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o recarregamento da página
    const cityName = cityInput.value.trim(); // Pega o valor e remove espaços
    
    if (cityName) {
        getWeatherData(cityName);
    } else {
        weatherResult.innerHTML = `<p class="error">Por favor, digite o nome de uma cidade.</p>`;
    }
});