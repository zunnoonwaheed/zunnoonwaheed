const apiKey = '535a0eb521bf01111342a90564e4ab12';
const chatbotApiKey = 'AIzaSyB8N5NjcLMIFqGPaIauTHU6ZwjB821MKXo'; 
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const iconBaseUrl = 'https://openweathermap.org/img/wn/';

let temperatureChartInstance;
let weatherConditionsChartInstance;
let lineChartInstance;


// Fetch weather data
async function fetchWeather(city) {
    const response = await fetch(`${weatherUrl}?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error('City not found');
    return await response.json();
}

// Fetch 5-day forecast data (one forecast per day)
async function fetchForecast(city) {
    const response = await fetch(`${forecastUrl}?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();

    // Extract forecasts at 12:00 PM for better daily insights
    const dailyForecasts = data.list.filter(entry => entry.dt_txt.includes('12:00:00'));
    return dailyForecasts;
}

// Update Weather Widget with Data and Image/Icon
function updateWeatherWidget(data) {
    const weatherWidget = document.getElementById('weather-widget');
    if (!weatherWidget) return; 

    const iconCode = data.weather[0].icon;
    const iconUrl = `${iconBaseUrl}${iconCode}@2x.png`;

    weatherWidget.innerHTML = `
        <h2>${data.name} (${data.weather[0].description})</h2>
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon"/>
    `;

    const weatherCondition = data.weather[0].main.toLowerCase();
    if (weatherCondition.includes('cloud')) {
        weatherWidget.style.background = '#b3cde0';
    } else if (weatherCondition.includes('rain')) {
        weatherWidget.style.background = '#cfd2d9';
    } else if (weatherCondition.includes('clear')) {
        weatherWidget.style.background = '#ffccbc';
    } else {
        weatherWidget.style.background = '#e0e0e0';
    }
}

// Update Forecast Cards
function updateForecastCards(forecastData) {
    const forecastContainer = document.getElementById('forecast-container');
    if (!forecastContainer) return; 
    forecastContainer.innerHTML = '';

    forecastData.forEach(entry => {
        const date = new Date(entry.dt_txt).toLocaleDateString();
        const temp = entry.main.temp;
        const weather = entry.weather[0].main;
        const iconCode = entry.weather[0].icon;
        const iconUrl = `${iconBaseUrl}${iconCode}@2x.png`;

        const card = document.createElement('div');
        card.classList.add('forecast-card');
        card.innerHTML = `
            <h3>${date}</h3>
            <p><strong>Temp:</strong> ${temp}°C</p>
            <p><strong>Weather:</strong> ${weather}</p>
            <img src="${iconUrl}" alt="${weather}" class="forecast-icon"/>
        `;
        forecastContainer.appendChild(card);
    });

    updateForecastTable(forecastData);
}

// Update Forecast Table
function updateForecastTable(forecastData) {
    const forecastTableBody = document.getElementById('forecast-table-body');
    if (!forecastTableBody) return; 
    forecastTableBody.innerHTML = '';

    forecastData.forEach(entry => {
        const date = new Date(entry.dt_txt).toLocaleDateString();
        const temp = entry.main.temp;
        const weather = entry.weather[0].main;
        const iconCode = entry.weather[0].icon;
        const iconUrl = `${iconBaseUrl}${iconCode}@2x.png`;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date}</td>
            <td>${temp}°C</td>
            <td>${weather}</td>
            <td><img src="${iconUrl}" alt="${weather}" class="forecast-icon"/></td>
        `;
        forecastTableBody.appendChild(row);
    });

    console.log('Forecast table updated. Current HTML:', forecastTableBody.innerHTML); 
}

// Update Charts with Forecast Data
function updateCharts(forecastData) {
    const temperatureData = forecastData.map(entry => entry.main.temp);
    const weatherConditions = forecastData.map(entry => entry.weather[0].main);
    const labels = forecastData.map(entry => new Date(entry.dt_txt).toLocaleDateString());

    if (temperatureChartInstance) temperatureChartInstance.destroy();
    if (weatherConditionsChartInstance) weatherConditionsChartInstance.destroy();
    if (lineChartInstance) lineChartInstance.destroy();

    const tempCtx = document.getElementById('temperature-chart').getContext('2d');
    temperatureChartInstance = new Chart(tempCtx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{ label: 'Temperature (°C)', data: temperatureData, backgroundColor: '#ffccbc' }]
        },
        options: { responsive: true }
    });

    const conditionsCount = weatherConditions.reduce((acc, condition) => {
        acc[condition] = (acc[condition] || 0) + 1;
        return acc;
    }, {});
    const conditionLabels = Object.keys(conditionsCount);
    const conditionValues = Object.values(conditionsCount);

    const conditionCtx = document.getElementById('weather-conditions-chart').getContext('2d');
    weatherConditionsChartInstance = new Chart(conditionCtx, {
        type: 'doughnut',
        data: {
            labels: conditionLabels,
            datasets: [{ data: conditionValues, backgroundColor: ['#ffccbc', '#b3cde0'] }]
        },
        options: { responsive: true }
    });

    const lineCtx = document.getElementById('line-chart').getContext('2d');
    lineChartInstance = new Chart(lineCtx, {
        type: 'line',
        data: {
            labels,
            datasets: [{ label: 'Temperature (°C)', data: temperatureData, borderColor: '#ffccbc', fill: false }]
        },
        options: { responsive: true }
    });
}

// Handle Get Weather Button Click
document.getElementById('get-weather-btn').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value.trim();

    if (!city) {
        alert('Please enter a city name.');
        return;
    }

    try {
        const weatherData = await fetchWeather(city);
        updateWeatherWidget(weatherData);

        const forecastData = await fetchForecast(city);
        updateForecastCards(forecastData);
        updateCharts(forecastData);
    } catch (error) {
        alert(error.message);
    }
});

// Basic chatbot functionality
async function fetchChatbotResponse(userMessage) {
    console.log('Sending message to chatbot:', userMessage); // Log the user message
    const response = await fetch(`https://api.chatbot.com/message?apiKey=${chatbotApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) {
        console.error('Chatbot response error:', response);
        throw new Error('Chatbot response not available');
    }
    return await response.json();
}

// Handle Chatbot Interaction
document.getElementById('chatbot-send-btn').addEventListener('click', async () => {
    const userMessage = document.getElementById('chatbot-input').value.trim();
    if (!userMessage) {
        alert('Please enter a message for the chatbot.');
        return;
    }

    try {
        const chatbotResponse = await fetchChatbotResponse(userMessage);
        const chatbotContainer = document.getElementById('chatbot-container');
        if (chatbotContainer) { 
            chatbotContainer.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
            chatbotContainer.innerHTML += `<p><strong>Chatbot:</strong> ${chatbotResponse.reply}</p>`;
        }
        document.getElementById('chatbot-input').value = ''; 
    } catch (error) {
        alert(error.message);
    }
});
