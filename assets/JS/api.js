// --- CONSTANTES DO DOM ---
const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const container = document.querySelector('.container');
const errorMessageBox = document.getElementById('error-message-box');
const bodyElement = document.body;

// Lista de todas as classes de fundo para limpeza
const BACKGROUND_CLASSES = ['night', 'is-clear', 'is-cloudy', 'is-raining', 'is-snowing', 'is-thunder'];

// --- HELPERS DE TRADUÇÃO ---

/**
 * Mapeia o WMO weathercode para a classe CSS do Weather Icons.
 */
function getWeatherIconClass(code, is_day) {
    const iconPrefix = 'wi ';
    const dayIcons = {
        0: 'wi-day-sunny', 1: 'wi-day-cloudy', 2: 'wi-day-cloudy', 3: 'wi-cloudy',
        45: 'wi-day-fog', 48: 'wi-day-fog',
        51: 'wi-day-rain', 53: 'wi-day-rain', 55: 'wi-day-rain',
        61: 'wi-day-showers', 63: 'wi-day-showers', 65: 'wi-day-showers',
        71: 'wi-day-snow', 73: 'wi-day-snow', 75: 'wi-day-snow',
        80: 'wi-day-rain', 81: 'wi-day-rain', 82: 'wi-day-rain',
        85: 'wi-day-snow', 86: 'wi-day-snow',
        95: 'wi-day-thunderstorm', 96: 'wi-day-thunderstorm', 99: 'wi-day-thunderstorm',
    };
    const nightIcons = {
        ...dayIcons,
        0: 'wi-night-clear', 1: 'wi-night-alt-cloudy', 2: 'wi-night-alt-cloudy',
        45: 'wi-night-fog', 48: 'wi-night-fog',
    };
    const icons = is_day ? dayIcons : nightIcons;
    return iconPrefix + (icons[code] || 'wi-day-sunny'); // Padrão
}

/**
 * Mapeia o WMO weathercode para uma descrição em Português.
 */
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Céu limpo', 1: 'Principalmente limpo', 2: 'Parcialmente nublado',
        3: 'Nublado', 45: 'Nevoeiro', 48: 'Nevoeiro depositado',
        51: 'Chuvisco leve', 53: 'Chuvisco moderado', 55: 'Chuvisco forte',
        61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
        71: 'Neve leve', 73: 'Neve moderada', 75: 'Neve forte',
        80: 'Aguaceiros leves', 81: 'Aguaceiros moderados', 82: 'Aguaceiros violentos',
        85: 'Aguaceiros de neve leves', 86: 'Aguaceiros de neve fortes',
        95: 'Trovoada', 96: 'Trovoada com granizo leve', 99: 'Trovoada com granizo forte',
    };
    return descriptions[code] || 'Condição desconhecida';
}

/**
 * Retorna uma classe CSS de fundo com base no código do clima.
 */
function getBackgroundClass(code) {
    if (code >= 0 && code <= 1) return 'is-clear';
    if (code >= 2 && code <= 48) return 'is-cloudy';
    if (code >= 51 && code <= 67) return 'is-raining';
    if (code >= 80 && code <= 82) return 'is-raining'; // Aguaceiros
    if (code >= 95 && code <= 99) return 'is-thunder';
    if (code >= 71 && code <= 77) return 'is-snowing';
    if (code >= 85 && code <= 86) return 'is-snowing'; // Aguaceiros de neve
    return 'is-clear'; // Padrão
}

/**
 * Formata uma data ISO para o formato "dia da semana, DD de MMMM de YYYY".
 */
function formatFullDate(isoString) {
    const date = new Date(isoString);
    const options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    };
    let formatted = new Intl.DateTimeFormat('pt-BR', options).format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// --- FUNÇÕES PRINCIPAIS DA APLICAÇÃO ---

/**
 * Exibe a mensagem de erro no formulário.
 */
function displayFormError(message) {
    errorMessageBox.textContent = message;
    errorMessageBox.style.display = 'block';
}

/**
 * Limpa a mensagem de erro do formulário.
 */
function clearFormError() {
    errorMessageBox.textContent = '';
    errorMessageBox.style.display = 'none';
}

/**
 * Reseta a aplicação para o estado inicial (tela de busca).
 */
function resetApp() {
    bodyElement.classList.remove('result-view');
    clearFormError();
    
    // Limpa todas as classes de fundo
    bodyElement.classList.remove(...BACKGROUND_CLASSES);
}

/**
 * Exibe os dados do clima no card (Layout da Foto).
 */
function displayWeather(cityName, data) {
    clearFormError();
    
    // 1. Extrai os dados
    const { temperature_2m: temperature, is_day, weather_code, time } = data.current;
    
    // 2. Obtém valores dos helpers
    const description = getWeatherDescription(weather_code);
    const iconClass = getWeatherIconClass(weather_code, is_day);
    const formattedDate = formatFullDate(time);
    const localTime = time.split('T')[1]; // Extrai "HH:MM" do ISO "YYYY-MM-DDTHH:MM"

    // 3. Lógica de Fundo (Dia/Noite e Animação)
    bodyElement.classList.remove(...BACKGROUND_CLASSES); // Limpa fundos antigos
    bodyElement.classList.toggle('night', !is_day); // Adiciona .night se for noite
    bodyElement.classList.add(getBackgroundClass(weather_code)); // Adiciona .is-raining, etc.
    
    // 4. Injeta o HTML no card de resultado (Conforme a foto)
    weatherResult.innerHTML = `
        <div class="temp-box">
            <i class="weather-icon ${iconClass}"></i>
            <span>${Math.round(temperature)}°C</span>
        </div>
        <div class="city-name">
            ${cityName}
        </div>
        <div class="description">
            ${description}
        </div>
        <div class="date">
            ${formattedDate}
        </div>
        <div class="local-time">
            Horário local: ${localTime}
        </div>
        <div class="home-icon" title="Nova busca">
            &#127968; 
        </div>
    `;
    
    // 5. Mostra o resultado (adicionando a classe ao BODY)
    bodyElement.classList.add('result-view');
}

/**
 * Busca coordenadas da cidade.
 */
async function getCoordinates(cityName) {
    const geoApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=pt&format=json`;
    try {
        const response = await fetch(geoApiUrl);
        if (!response.ok) throw new Error('Erro de rede ao buscar coordenadas.');
        
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
                latitude: result.latitude,
                longitude: result.longitude,
                fullName: `${result.name}, ${result.country}` 
            };
        } else {
            return null; // Cidade não encontrada
        }
    } catch (error) {
        console.error('Erro getCoordinates:', error);
        return null;
    }
}

/**
 * Busca os dados do clima e inicia a exibição.
 */
async function getWeatherData(cityName) {
    clearFormError();
    
    // 1. Busca Coordenadas
    const coords = await getCoordinates(cityName);
    if (!coords) {
        displayFormError(`Cidade não encontrada: ${cityName}. Tente novamente.`);
        return;
    }

    // 2. Busca Dados do Clima
    // Pede temperatura, se é dia/noite, e o código do clima
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,is_day,weather_code&temperature_unit=celsius&timezone=auto`;

    try {
        const response = await fetch(weatherApiUrl);
        if (!response.ok) throw new Error('Erro de rede ao buscar dados do clima.');
        
        const data = await response.json();
        
        // 3. Exibe os dados
        displayWeather(coords.fullName, data);

    } catch (error) {
        console.error('Erro getWeatherData:', error);
        displayFormError('Não foi possível obter os dados do clima. Tente mais tarde.');
    }
}


// --- EVENT LISTENERS (Ouvintes de Ação) ---

// 1. Ao enviar o formulário (buscar)
weatherForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const cityName = cityInput.value.trim(); 
    
    if (cityName) {
        getWeatherData(cityName);
    } else {
        displayFormError(`Por favor, digite o nome de uma cidade.`);
    }
});

// 2. Ao clicar no ícone "Home" (voltar)
weatherResult.addEventListener('click', function(event) {
    // Verifica se o clique foi no elemento com a classe 'home-icon'
    if (event.target.closest('.home-icon')) {
        resetApp(); // Chama a função de reset
    }
});