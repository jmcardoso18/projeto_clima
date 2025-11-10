// Constantes para elementos do DOM
const weatherForm = document.getElementById('weather-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const container = document.querySelector('.container'); // Seletor para o container principal
// NOVO: Adiciona a constante para a caixa de erro (DEVE existir no index.html)
const errorMessageBox = document.getElementById('error-message-box'); 

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
    container.classList.remove('result-view'); // Remove classe de visualização de resultado
    clearFormError(); // Limpa o erro ao resetar
}

// Event Listener para o ícone de casa (retorna à busca)
// Usamos delegação de eventos para o elemento gerado dinamicamente
weatherResult.addEventListener('click', function(event) {
    // Verifica se o clique foi no elemento com a classe 'home-icon' ou em seus descendentes
    if (event.target.closest('.home-icon')) {
        resetApp();
    }
});

// Função para exibir o resultado no Frontend (MODIFICADA para o layout minimalista)
function displayWeather(cityName, data) {
    clearFormError(); // Limpa qualquer erro anterior antes de mostrar o resultado

    // 1. Oculta o Formulário e prepara o Container
    weatherForm.style.display = 'none';
    container.classList.add('result-view'); // Adiciona classe para possíveis ajustes de layout

    weatherResult.classList.remove('visible');
    
    if (!data || !data.current_weather) {
        // Em caso de erro DENTRO dos dados do clima (após encontrar a cidade)
        weatherResult.innerHTML = `<p class="error">Dados do clima não disponíveis para ${cityName}. <a href="#" onclick="resetApp()">Tentar novamente</a></p>`;
        weatherResult.classList.add('visible'); 
        return;
    }

    // Apenas a temperatura é necessária para este layout
    const { temperature } = data.current_weather; 

    // 2. Gera o novo HTML minimalista (com base no layout solicitado)
    weatherResult.innerHTML = `
        <div class="temp-box">
            ${Math.round(temperature)}° 
        </div>
        <div class="city-name">
            ${cityName}
        </div>
        <div class="home-icon" title="Nova busca">
            &#8962; 
        </div>
    `;
    
    // 3. Torna o resultado visível
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
        
        // Verifica se algum resultado foi encontrado
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

// Função principal para buscar os dados do clima (CORRIGIDA)
async function getWeatherData(cityName) {
    clearFormError(); // Limpa qualquer mensagem de erro antes de iniciar a busca
    
    // Mostra o feedback de busca no weatherResult (opcional, mas bom feedback)
    weatherResult.classList.remove('visible'); 
    weatherResult.innerHTML = `<p>Buscando clima para **${cityName}**...</p>`;
    weatherResult.classList.add('visible'); 
    
    weatherForm.style.display = 'none'; // Oculta o formulário APENAS durante a busca

    const coords = await getCoordinates(cityName);

    if (!coords) {
        // CASO DE ERRO 1: Cidade não encontrada.
        weatherResult.classList.remove('visible'); // Oculta a mensagem de "Buscando..."
        weatherForm.style.display = 'flex'; // Re-exibe o formulário
        
        // Exibe o erro estilizado, conforme a imagem
        displayFormError(`Cidade não encontrada. Tente novamente.`);
        
        return;
    }

    // ... (restante da lógica de busca do clima)
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current_weather=true&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`;

    try {
        const response = await fetch(weatherApiUrl);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        displayWeather(coords.fullName, data);

    } catch (error) {
        // CASO DE ERRO 2: Erro de API/rede
        console.error('Erro ao buscar dados do clima:', error);
        weatherResult.innerHTML = `<p class="error">❌ Ocorreu um erro ao obter os dados do clima. <a href="#" onclick="resetApp()">Tentar novamente</a></p>`;
        weatherResult.classList.add('visible');
        weatherForm.style.display = 'none'; // Mantém o formulário oculto
    }
}


// Event Listener para o formulário (MODIFICADO para usar clearFormError)
weatherForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const cityName = cityInput.value.trim(); 
    
    clearFormError(); // Limpa o erro antes de iniciar a busca
    
    if (cityName) {
        getWeatherData(cityName);
    } else {
        // Se o campo estiver vazio
        displayFormError(`Por favor, digite o nome de uma cidade.`);
        // O formulário permanece visível
    }
});