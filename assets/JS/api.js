
// =============================
//  CONSTANTES DO DOM
// =============================
const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const errorMessageBox = document.getElementById('error-message-box');
const bodyElement = document.body;

const BACKGROUND_CLASSES = ['night', 'is-clear', 'is-cloudy', 'is-raining', 'is-snowing', 'is-thunder'];

// Tempo em milissegundos para expiração do cache (10 minutos)
const CACHE_EXPIRATION = 10 * 60 * 1000;

// =============================
//  SISTEMA DE CACHE
// =============================
function saveToCache(city, data) {
    const cacheObject = {
        timestamp: Date.now(),
        data
    };
    localStorage.setItem(`weather_${city.toLowerCase()}`, JSON.stringify(cacheObject));
}

function loadFromCache(city) {
    const cache = localStorage.getItem(`weather_${city.toLowerCase()}`);
    if (!cache) return null;

    const { timestamp, data } = JSON.parse(cache);

    if (Date.now() - timestamp > CACHE_EXPIRATION) return null;

    return data;
}

// =============================
//  HELPERS DE UI E FORMATOS
// =============================
function getWeatherIconClass(code, isDay) {
    const prefix = 'wi ';
    const dayIcons = {
        0: 'wi-day-sunny',
        1: 'wi-day-cloudy',
        2: 'wi-day-cloudy',
        3: 'wi-cloudy',
        45: 'wi-day-fog',
        48: 'wi-day-fog',
        51: 'wi-day-rain',
        53: 'wi-day-rain',
        55: 'wi-day-rain',
        61: 'wi-day-showers',
        63: 'wi-day-showers',
        65: 'wi-day-showers',
        71: 'wi-day-snow',
        73: 'wi-day-snow',
        75: 'wi-day-snow',
        80: 'wi-day-rain',
        81: 'wi-day-rain',
        82: 'wi-day-rain',
        85: 'wi-day-snow',
        86: 'wi-day-snow',
        95: 'wi-day-thunderstorm',
        96: 'wi-day-thunderstorm',
        99: 'wi-day-thunderstorm'
    };

    const nightIcons = {
        ...dayIcons,
        0: 'wi-night-clear',
        1: 'wi-night-alt-cloudy',
        2: 'wi-night-alt-cloudy',
        45: 'wi-night-fog',
        48: 'wi-night-fog'
    };

    const icons = isDay ? dayIcons : nightIcons;
    return prefix + (icons[code] || 'wi-day-sunny');
}

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
        61: 'Chuva leve',
        63: 'Chuva moderada',
        65: 'Chuva forte',
        71: 'Neve leve',
        73: 'Neve moderada',
        75: 'Neve forte',
        80: 'Aguaceiros leves',
        81: 'Aguaceiros moderados',
        82: 'Aguaceiros violentos',
        85: 'Aguaceiros de neve leves',
        86: 'Aguaceiros de neve fortes',
        95: 'Trovoada',
        96: 'Trovoada com granizo leve',
        99: 'Trovoada com granizo forte'
    };

    return descriptions[code] || 'Condição desconhecida';
}

function getBackgroundClass(code) {
    if (code <= 1) return 'is-clear';
    if (code <= 48) return 'is-cloudy';
    if (code <= 67) return 'is-raining';
    if (code <= 77) return 'is-snowing';
    if (code <= 82) return 'is-raining';
    if (code <= 86) return 'is-snowing';
    if (code <= 99) return 'is-thunder';
    return 'is-clear';
}

function formatFullDate(isoString) {
    const date = new Date(isoString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formatted = new Intl.DateTimeFormat('pt-BR', options).format(date);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// =============================
//  UI
// =============================
function displayFormError(message) {
    errorMessageBox.textContent = message;
    errorMessageBox.style.display = 'block';
}

function clearFormError() {
    errorMessageBox.textContent = '';
    errorMessageBox.style.display = 'none';
}

function resetApp() {
    clearFormError();
    bodyElement.classList.remove('result-view', ...BACKGROUND_CLASSES);
}

function displayWeather(cityName, data) {
    // 1. Desestruturação de dados: Incluindo novas variáveis
    const {
        temperature_2m, is_day, weather_code, time, wind_speed_10m
    } = data.current;

    // As variáveis 'daily' e 'hourly' não estão no 'current', então acessamos separadamente
    // Pegamos a primeira ocorrência (o dia de hoje, índice 0)
    const maxTemp = Math.round(data.daily.temperature_2m_max[0]);
    const minTemp = Math.round(data.daily.temperature_2m_min[0]);

    // Pega a umidade da hora atual. O Open-Meteo não tem umidade em 'current', usa 'hourly'.
    // A hora atual é o índice 0 na lista de dados horários.
    const currentHourIndex = data.hourly.time.findIndex(t => t === time);
    const humidity = data.hourly.relative_humidity_2m[currentHourIndex];

    // Precipitação acumulada nas últimas 24h ou apenas a atual. 
    // Para simplificar, usamos a precipitação do dia todo (diária).
    const precipitation = data.daily.precipitation_sum[0] || 0;


    const description = getWeatherDescription(weather_code);
    const iconClass = getWeatherIconClass(weather_code, is_day);
    const formattedDate = formatFullDate(time);
    const dateOnly = formattedDate.split(',')[0]; // Ex: domingo, 2 de novembro de 2025

    // Aplica classes de fundo dinâmicas
    bodyElement.classList.remove(...BACKGROUND_CLASSES);
    bodyElement.classList.toggle('night', !is_day);
    bodyElement.classList.add(getBackgroundClass(weather_code));

    // 2. Injeção do novo HTML
    weatherResult.innerHTML = `
        <h1>Previsão do Tempo ☀️</h1>
        <div class="temp-box">
            
            <i class="weather-icon ${iconClass}"></i>
            <span>${Math.round(temperature_2m)}°</span>
        </div>
        <div class="city-name">${cityName}</div>
        <div class="description">${description}</div>
        <div class="date">${dateOnly}</div>
        
        <div class="temp-min-max">
            <div class="temp-detail temp-max">
                <span class="label">MÁXIMA</span>
                <span class="value">${maxTemp}°</span>
            </div>
            <div class="temp-detail temp-min">
                <span class="label">MÍNIMA</span>
                <span class="value">${minTemp}°</span>
            </div>
        </div>
        
       <div class="additional-variables grid-cards">
    <div class="variable-card">
        <i class="wi wi-humidity"></i>
        <span class="value">${humidity}%</span>
        <span class="label">UMIDADE</span>
    </div>

    <div class="variable-card">
        <i class="wi wi-strong-wind"></i>
        <span class="value">${Math.round(wind_speed_10m)} km/h</span>
        <span class="label">VENTO</span>
    </div>

    <div class="variable-card">
        <i class="wi wi-raindrops"></i>
        <span class="value">${precipitation.toFixed(1)} mm</span>
        <span class="label">PRECIPITAÇÃO</span>
    </div>
</div>
        
        <div class="home-icon" title="Nova busca">Voltar</div>
    `;

    bodyElement.classList.add('result-view');
}

// =============================
//  API
// =============================
async function getCoordinates(cityName) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1&language=pt&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error();
        const data = await response.json();
        const r = data.results?.[0];

        return r ? { latitude: r.latitude, longitude: r.longitude, fullName: `${r.name}, ${r.country}` } : null;
    } catch {
        return null;
    }
}

async function getWeatherData(cityName) {
    clearFormError();

    const cachedData = loadFromCache(cityName);
    if (cachedData) {
        displayWeather(cachedData.fullName, cachedData);
        return;
    }

    const coords = await getCoordinates(cityName);
    if (!coords) return displayFormError(`Cidade não encontrada: ${cityName}`);

    // 3. ATUALIZAÇÃO DA URL: Adicionamos 'wind_speed_10m', 'relative_humidity_2m', 
    //    'temperature_2m_max', 'temperature_2m_min' e 'precipitation_sum'.
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,is_day,weather_code,wind_speed_10m&hourly=relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&temperature_unit=celsius&timezone=auto`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error();

        const data = await response.json();
        const fullData = { ...data, fullName: coords.fullName };

        saveToCache(cityName, fullData);

        displayWeather(coords.fullName, fullData);
    } catch {
        displayFormError('Não foi possível obter os dados do clima. Tente novamente mais tarde.');
    }
}

// =============================
//  EVENTOS
// =============================
weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    return city ? getWeatherData(city) : displayFormError('Digite o nome de uma cidade.');
});

weatherResult.addEventListener('click', (e) => {
    if (e.target.closest('.home-icon')) resetApp();
});
