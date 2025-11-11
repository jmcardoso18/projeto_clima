// Constantes para elementos do DOM
const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const container = document.querySelector('.container'); 
const errorMessageBox = document.getElementById('error-message-box'); 

// Event Listener para o ícone de casa (retorna à busca)
// Este código escuta por cliques no painel de resultado
weatherResult.addEventListener('click', function(event) {
    
    // Verifica se o elemento clicado (ou um parente próximo) 
    // é o <div class="home-icon">
    if (event.target.closest('.home-icon')) {
        
        // Se for, chama a função de reset
        resetApp(); 
    }
});

// --- NOVOS HELPERS (Requisito 2.1) ---

/**
 * Mapeia o WMO weathercode para a classe CSS do Weather Icons.
 * Requer o 'is_day' (1 = dia, 0 = noite) para ícones corretos.
 * @param {number} code - O weathercode da API.
 * @param {number} is_day - 1 se for dia, 0 se for noite.
 * @returns {string} A classe CSS do ícone (ex: 'wi wi-day-sunny').
 */
function getWeatherIconClass(code, is_day) {
    const iconPrefix = 'wi ';
    const dayIcons = {
        0: 'wi-day-sunny', // Céu limpo
        1: 'wi-day-cloudy', // Principalmente limpo
        2: 'wi-day-cloudy', // Parcialmente nublado
        3: 'wi-cloudy',     // Nublado
        45: 'wi-day-fog',  // Nevoeiro
        48: 'wi-day-fog',  // Nevoeiro depositado
        51: 'wi-day-rain', // Chuva leve
        53: 'wi-day-rain', // Chuva moderada
        55: 'wi-day-rain', // Chuva forte
        56: 'wi-day-rain', // Chuva congelante leve
        57: 'wi-day-rain', // Chuva congelante forte
        61: 'wi-day-showers', // Chuva leve
        63: 'wi-day-showers', // Chuva moderada
        65: 'wi-day-showers', // Chuva forte
        66: 'wi-day-sleet', // Chuva congelante leve
        67: 'wi-day-sleet', // Chuva congelante forte
        71: 'wi-day-snow', // Neve leve
        73: 'wi-day-snow', // Neve moderada
        75: 'wi-day-snow', // Neve forte
        77: 'wi-snow',     // Grãos de neve
        80: 'wi-day-rain', // Aguaceiros leves
        81: 'wi-day-rain', // Aguaceiros moderados
        82: 'wi-day-rain', // Aguaceiros violentos
        85: 'wi-day-snow', // Aguaceiros de neve leves
        86: 'wi-day-snow', // Aguaceiros de neve fortes
        95: 'wi-day-thunderstorm', // Trovoada
        96: 'wi-day-thunderstorm', // Trovoada com granizo leve
        99: 'wi-day-thunderstorm', // Trovoada com granizo forte
    };
    
    const nightIcons = {
        ...dayIcons, // Começa com os ícones de dia (para os neutros como 'wi-cloudy')
        0: 'wi-night-clear', // Céu limpo (noite)
        1: 'wi-night-alt-cloudy',
        2: 'wi-night-alt-cloudy',
        45: 'wi-night-fog',
        48: 'wi-night-fog',
        // ... (você pode adicionar mais substituições específicas para a noite)
    };

    const icons = is_day ? dayIcons : nightIcons;
    return iconPrefix + (icons[code] || 'wi-day-sunny'); // 'wi-day-sunny' como padrão
}

/**
 * Mapeia o WMO weathercode para uma descrição em Português.
 * @param {number} code - O weathercode da API.
 * @returns {string} A descrição do clima.
 */
function getWeatherDescription(code) {
    const descriptions = {
        0: 'Céu limpo',
        1: 'Principalmente limpo',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Nevoeiro',
        48: 'Nevoeiro depositado',
        51: 'Chuvisco leve',
        53: 'Chuvisco moderado',
        55: 'Chuvisco forte',
        56: 'Chuvisco congelante leve',
        57: 'Chuvisco congelante forte',
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        66: 'Chuva congelante leve',
        67: 'Chuva congelante forte',
        71: 'Neve leve',
        73: 'Neve moderada',
        75: 'Neve forte',
        77: 'Grãos de neve',
        80: 'Aguaceiros leves',
        81: 'Aguaceiros moderados',
        82: 'Aguaceiros violentos',
        85: 'Aguaceiros de neve leves',
        86: 'Aguaceiros de neve fortes',
        95: 'Trovoada',
        96: 'Trovoada com granizo leve',
        99: 'Trovoada com granizo forte',
    };
    return descriptions[code] || 'Condição desconhecida';
}
/**
 * Retorna uma classe CSS baseada no código do clima.
 */
function getBackgroundClass(code) {
    if (code >= 0 && code <= 1) return 'bg-clear';
    if (code >= 2 && code <= 48) return 'bg-cloudy';
    if (code >= 51 && code <= 67) return 'bg-rain';
    if (code >= 80 && code <= 82) return 'bg-rain'; // Aguaceiros
    if (code >= 95 && code <= 99) return 'bg-thunder';
    if (code >= 71 && code <= 77) return 'bg-snow';
    if (code >= 85 && code <= 86) return 'bg-snow'; // Aguaceiros de neve
    return 'bg-clear'; // Padrão
}
/**
 * Formata uma data ISO (da API) para o formato "dia da semana, DD de MMMM de YYYY".
 * @param {string} isoString - Data no formato ISO 8601.
 * @returns {string} Data formatada.
 */
function formatFullDate(isoString) {
    const date = new Date(isoString);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    let formatted = new Intl.DateTimeFormat('pt-BR', options).format(date);
    // Capitaliza o dia da semana
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// --- FIM DOS NOVOS HELPERS ---


// Função auxiliar para exibir a mensagem de erro do formulário
function displayFormError(message) {
    if (errorMessageBox) {
        errorMessageBox.textContent = message;
        errorMessageBox.style.display = 'block';
    }
}

// Função auxiliar para limpar a mensagem de erro do formulário
function clearFormError() {
    if (errorMessageBox) {
        errorMessageBox.textContent = '';
        errorMessageBox.style.display = 'none';
    }
}

// Função para reverter para o estado inicial (formulário de busca)
function resetApp() {
    weatherForm.style.display = 'flex'; // Mostra o formulário
    weatherResult.classList.remove('visible'); // Esconde o card de resultado
    cityInput.value = ''; // Limpa o input
    container.classList.remove('result-view'); // Remove classe do container
    
    // ATUALIZADO: Limpa todas as classes de clima e noite do body
    const classesToRemove = ['night', 'bg-clear', 'bg-cloudy', 'bg-rain', 'bg-snow', 'bg-thunder'];
    document.body.classList.remove(...classesToRemove);
    
    clearFormError(); // Limpa o erro ao resetar
}

/**
 * ATUALIZADO: Função para exibir o resultado no Frontend
 * Agora mostra o HORÁRIO LOCAL em vez do fuso.
 */
function displayWeather(cityName, data) {
    clearFormError(); 

    // 1. Oculta o Formulário e prepara o Container
    weatherForm.style.display = 'none';
    container.classList.add('result-view'); 
    weatherResult.classList.remove('visible');
    
    if (!data || !data.current) {
        weatherResult.innerHTML = `<p class="error">Dados da API indisponíveis. <a href="#" onclick="resetApp()">Tentar novamente</a></p>`;
        weatherResult.classList.add('visible'); 
        return;
    }

    // 2. Extrai os dados
    const { temperature_2m: temperature, is_day, weather_code, time } = data.current;
    
    // 3. Obtém os valores dos helpers
    const description = getWeatherDescription(weather_code);
    const iconClass = getWeatherIconClass(weather_code, is_day);
    const formattedDate = formatFullDate(time);

    // 4. ATUALIZADO: Extrai a hora local
    // O 'time' vem como "2025-11-11T15:30". Pegamos só a parte depois do "T".
    const localTime = time.split('T')[1]; // Isso resulta em "15:30"

    // 5. Lógica de Fundo (sem alteração)
    const classesToRemove = ['bg-clear', 'bg-cloudy', 'bg-rain', 'bg-snow', 'bg-thunder'];
    document.body.classList.remove(...classesToRemove);
    document.body.classList.toggle('night', !is_day); 
    const weatherClass = getBackgroundClass(weather_code);
    document.body.classList.add(weatherClass);

    // 6. Gera o novo HTML (com horário local)
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
    
    // 7. Torna o resultado visível
    weatherResult.classList.add('visible');
}

// Função para buscar coordenadas da cidade (Permanece inalterada)
async function getCoordinates(cityName) {
    const geoApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=pt&format=json`;

    try {
        const response = await fetch(geoApiUrl);
        if (!response.ok) {
            throw new Error(`Erro de rede ao buscar coordenadas: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const fullName = `${result.name}, ${result.country}`; 
            return {
                latitude: result.latitude,
                longitude: result.longitude,
                fullName: fullName 
            };
        } else {
            return null; // Cidade não encontrada
        }
    } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        return null;
    }
}

/**
 * ATUALIZADO: Função principal para buscar os dados do clima
 * Modificada para usar a API 'current' em vez de 'current_weather'.
 */
async function getWeatherData(cityName) {
    clearFormError(); 
    
    weatherResult.classList.remove('visible'); 
    weatherResult.innerHTML = `<p>Buscando clima para ${cityName}...</p>`;
    weatherResult.classList.add('visible'); 
    
    weatherForm.style.display = 'none'; 

    const coords = await getCoordinates(cityName);

    if (!coords) {
        weatherResult.classList.remove('visible'); 
        weatherForm.style.display = 'flex'; 
        displayFormError(`Cidade não encontrada. Tente novamente.`);
        return;
    }

    // ATUALIZADO: URL da API
    // Trocamos 'current_weather=true' por 'current=...' para pedir dados específicos.
    // 'temperature_2m' é a temperatura, 'weather_code' é a descrição, 'is_day' é dia/noite.
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,is_day,weather_code&temperature_unit=celsius&timezone=auto`;

    try {
        const response = await fetch(weatherApiUrl);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        // Passa o nome completo e os dados da API
        displayWeather(coords.fullName, data);

    } catch (error) {
        // Tratamento de erro de rede ou falha na API de clima
        console.error('Erro ao buscar dados do clima:', error);
        weatherResult.innerHTML = `<p class="error">❌ Ocorreu um erro ao obter os dados do clima. <a href="#" onclick="resetApp()">Tentar novamente</a></p>`;
        weatherResult.classList.add('visible');
        weatherForm.style.display = 'none'; 
    }
}


// Event Listener para o formulário (Permanece inalterado)
weatherForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const cityName = cityInput.value.trim(); 
    
    clearFormError(); 
    
    if (cityName) {
        getWeatherData(cityName);
    } else {
        displayFormError(`Por favor, digite o nome de uma cidade.`);
    }
});