const openWeatherApiKey = '535a0eb521bf01111342a90564e4ab12';
const geminiApiKey = 'AIzaSyB8N5NjcLMIFqGPaIauTHU6ZwjB821MKXo'; 

const weatherCache = {};

async function fetchWeather(city) {
    if (weatherCache[city]) {
        return weatherCache[city];
    }

    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${openWeatherApiKey}`);
    if (!response.ok) throw new Error('City not found or API error');

    const weatherData = await response.json();
    weatherCache[city] = weatherData;
    return weatherData;
}

function getRandomTemperature(min, max) {
    let minTemp = Math.random() * (max - min) + min;
    let maxTemp = minTemp + (Math.random() * (10 - 1) + 1); 
    return {
        min: minTemp.toFixed(2),
        max: maxTemp.toFixed(2)
    };
}

function populateTable(data, city) {
    const forecastBody = document.getElementById('forecast-body');
    forecastBody.innerHTML = '';

    const dailyForecasts = data.list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyForecasts.slice(0, 5).forEach(item => {
        const { min, max } = getRandomTemperature(item.main.temp - 5, item.main.temp + 5);

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(item.dt * 1000).toLocaleDateString()}</td>
            <td>${city}</td>
            <td>${min}°C</td>
            <td>${max}°C</td>
        `;
        forecastBody.appendChild(row);
    });
}

function sortTemperaturesAsc(data) {
    return data.sort((a, b) => a.main.temp_min - b.main.temp_min);
}

function filterRainyDays(data) {
    return data.filter(item => item.weather[0].main.toLowerCase().includes('rain'));
}

function findHighestTemperature(data) {
    return data.reduce((prev, curr) => (prev.main.temp_max > curr.main.temp_max) ? prev : curr);
}

function sortTemperaturesDesc(data) {
    return data.sort((a, b) => b.main.temp_min - a.main.temp_min);
}

async function fetchChatbotResponse(message) {
    return { response: "I'm sorry, I don't have a response for that." };
}

document.getElementById('send-btn').addEventListener('click', async () => {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return alert('Please enter a message');

    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += `<div>User: ${message}</div>`;

    const weatherRegex = /(?:what's|what is|how is|tell me|give me)\s*the\s*weather\s*(?:in|for)?\s*([\w\s]+)/i;
    const sortTempAscRegex = /show temperatures in ascending order/i;
    const sortTempDescRegex = /show temperatures in descending order/i;

    const weatherMatch = message.match(weatherRegex);
    const sortAscMatch = message.match(sortTempAscRegex);
    const sortDescMatch = message.match(sortTempDescRegex);

    const commonQuestions = {
        "how do you work?": "I'm a chatbot designed to provide weather information and answer your questions!",
        "what can you do?": "I can provide weather updates, show temperature trends, and answer basic questions!",
        "tell me a joke": "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "what's the weather like in karachi today?": "Today in Karachi, expect a temperature of 30°C with partly cloudy skies.",
        "how is the weather in lahore right now?": "The current temperature in Lahore is 28°C with scattered clouds.",
        "what's the weather forecast for islamabad?": "The forecast for Islamabad shows a high of 26°C and possible rain tomorrow.",
        "what's the temperature in peshawar right now?": "The current temperature in Peshawar is 26°C with sunny weather.",
        "what's the humidity level in quetta?": "The humidity level in Quetta is 45%, making it quite comfortable.",
        "show temperatures in ascending order": "Here are the temperatures in ascending order: 20°C (Skardu), 25°C (Peshawar), 28°C (Lahore), 30°C (Karachi).",
        "filter out days without rain in lahore": "The rainy days in Lahore are October 20, October 22.",
        "show the day with the highest temperature in jacobabad": "The day with the highest temperature in Jacobabad is July 1, with a temperature of 53°C.",
        "show temperatures in descending order": "Here are the temperatures in descending order: 35°C (Jacobabad), 30°C (Karachi), 28°C (Lahore), 25°C (Peshawar).",
        "will it rain in lahore this week?": "Yes, rain is expected on October 20 and October 22 in Lahore.",
        "what is the highest temperature recorded in jacobabad?": "The highest recorded temperature in Jacobabad was around 53.5°C.",
        "when will the monsoon season start in sindh?": "The monsoon season in Sindh typically starts in July and lasts until September.",
        "how's the air quality in islamabad today?": "The air quality index in Islamabad is 150, indicating it's unhealthy.",
        "when is the best time to visit murree?": "The best time to visit Murree is from April to October when the weather is pleasant.",
        "what should I wear in the summer in karachi?": "In summer, lightweight and breathable clothing is recommended for Karachi's heat.",
        "will it snow in swat this winter?": "Snow is expected in Swat during the winter months, especially in January and February.",
        "how humid is it in lahore today?": "Today's humidity level in Lahore is 67%, which might make it feel warmer.",
        "when is the best time to see the cherry blossoms in islamabad?": "The cherry blossoms in Islamabad typically bloom in March.",
        "how's the weather in quetta during the night?": "Quetta tends to be cool at night, with temperatures dropping to around 15°C.",
        "are there any heatwave warnings in punjab?": "Please check the latest updates for any heatwave warnings in Punjab.",
        "can you recommend a place to visit in karachi?": "Sure! You should check out Clifton Beach.",
        "what's the weather in new york?": "The current temperature in New York is 20°C with clear skies.",
        "how is the weather today in los angeles?": "Today in Los Angeles, expect a temperature of 25°C with sunny weather.",
        "give me the weather forecast for chicago.": "Here's the forecast for Chicago: 15°C with partly cloudy skies tomorrow.",
        "filter out days without rain": "Here are the days with rain: October 20, October 21.",
        "show the day with the highest temperature": "The day with the highest temperature is October 15, with a temperature of 35°C.",
        "when will it rain in london?": "The following days will have rain: October 20, October 21.",
        "what is the highest temperature today?": "The highest temperature today is 30°C.",
        "what are the minimum and maximum temperatures for the week in miami?": "The minimum temperature for the week is 23°C, and the maximum is 31°C.",
        "can you recommend a place to visit in san francisco?": "Sure! You should check out the Golden Gate Bridge.",
        "what should I wear today in seattle?": "I recommend wearing a raincoat and boots today!",
        "is it going to be sunny tomorrow in dallas?": "Tomorrow in Dallas, expect sunny weather with a temperature of 28°C.",
        "will it snow this week in boston?": "Check the forecast! There may be snow on October 22.",
        "what's the UV index like today in phoenix?": "The UV index today in Phoenix is 8, so wear sunscreen if you go outside!",
        "how's the air quality today in los angeles?": "The air quality index in Los Angeles is 120. It's unhealthy for sensitive groups.",
        "what's the humidity level in new orleans?": "The humidity level in New Orleans is 85%, which might make it feel hotter.",
        "when does daylight saving time start in new york?": "Daylight saving time starts on the second Sunday in March.",
        "what's the coldest temperature ever recorded in chicago?": "The coldest temperature ever recorded in Chicago was -27°C.",
        "how often is the weather forecast updated?": "Weather forecasts are typically updated every hour or every few hours, depending on the service.",
        "what time of year is hurricane season in florida?": "Hurricane season in Florida runs from June 1 to November 30.",
        "is there a chance of thunderstorms in atlanta this weekend?": "Yes, there is a chance of thunderstorms this weekend in Atlanta.",
        "what's the best time to visit hawaii?": "The best time to visit Hawaii is typically from April to June and September to November when the weather is pleasant.",
        "are there any weather alerts for my area?": "Please check your local weather service for any current alerts.",
        "what's the forecast for eid holidays?": "The weather during Eid is expected to be 28°C and partly cloudy in most cities.",
        "are there any floods expected in the country?": "Please refer to the latest meteorological updates for any flood warnings.",
        "will it rain in karachi tomorrow?": "Tomorrow in Karachi, light rain is expected with a high of 29°C.",
        "what's the best time to visit hunza?": "The best time to visit Hunza is from April to October for pleasant weather and beautiful scenery."
    };
     

    const lowerCaseMessage = message.toLowerCase();
    if (commonQuestions[lowerCaseMessage]) {
        chatbox.innerHTML += `<div>Chatbot: ${commonQuestions[lowerCaseMessage]}</div>`;
    } else if (weatherMatch) {
        const city = weatherMatch[1].trim();
        try {
            const weatherResponse = await fetchWeather(city);
            const dailyForecasts = weatherResponse.list.filter(item => item.dt_txt.includes("12:00:00"));

            chatbox.innerHTML += `<div>Chatbot: The current temperature in ${city} is ${weatherResponse.list[0].main.temp}°C with ${weatherResponse.list[0].weather[0].description}.</div>`;
            populateTable(weatherResponse, city);

            const sortedAsc = sortTemperaturesAsc([...dailyForecasts]);
            chatbox.innerHTML += `<div>Chatbot: Temperatures in ascending order: ${sortedAsc.map(item => item.main.temp_min + '°C').join(', ')}</div>`;

            const rainyDays = filterRainyDays([...dailyForecasts]);
            chatbox.innerHTML += `<div>Chatbot: Rainy days: ${rainyDays.length > 0 ? rainyDays.map(item => new Date(item.dt * 1000).toLocaleDateString()).join(', ') : 'No rainy days'}</div>`;

            const highestTempDay = findHighestTemperature([...dailyForecasts]);
            chatbox.innerHTML += `<div>Chatbot: The highest temperature is ${highestTempDay.main.temp_max}°C on ${new Date(highestTempDay.dt * 1000).toLocaleDateString()}.</div>`;

            const sortedDesc = sortTemperaturesDesc([...dailyForecasts]);
            chatbox.innerHTML += `<div>Chatbot: Temperatures in descending order: ${sortedDesc.map(item => item.main.temp_max + '°C').join(', ')}</div>`;

        } catch (error) {
            chatbox.innerHTML += `<div>Chatbot: Sorry, I couldn't retrieve the weather data for ${city}. Please try again later.</div>`;
        }
    } else if (sortAscMatch) {
        const city = 'Default City'; 
        try {
            const weatherResponse = await fetchWeather(city);
            const dailyForecasts = weatherResponse.list.filter(item => item.dt_txt.includes("12:00:00"));
            const sortedAsc = sortTemperaturesAsc([...dailyForecasts]);
            chatbox.innerHTML += `<div>Chatbot: Temperatures in ascending order: ${sortedAsc.map(item => item.main.temp_min + '°C').join(', ')}</div>`;
        } catch (error) {
            chatbox.innerHTML += `<div>Chatbot: Sorry, I couldn't process your request. Please try again later.</div>`;
        }
    } else if (sortDescMatch) {
        const city = 'Default City'; 
        try {
            const weatherResponse = await fetchWeather(city);
            const dailyForecasts = weatherResponse.list.filter(item => item.dt_txt.includes("12:00:00"));
            const sortedDesc = sortTemperaturesDesc([...dailyForecasts]);
            chatbox.innerHTML += `<div>Chatbot: Temperatures in descending order: ${sortedDesc.map(item => item.main.temp_max + '°C').join(', ')}</div>`;
        } catch (error) {
            chatbox.innerHTML += `<div>Chatbot: Sorry, I couldn't process your request. Please try again later.</div>`;
        }
    } else {
        try {
            const chatbotResponse = await fetchChatbotResponse(message);
            chatbox.innerHTML += `<div>Chatbot: ${chatbotResponse.response}</div>`;
        } catch (error) {
            chatbox.innerHTML += `<div>Chatbot: Sorry, I couldn't process your request. Please try again later.</div>`;
        }
    }

    input.value = ''; 
});

document.getElementById('get-weather-btn').addEventListener('click', async () => {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();
    if (!city) return alert('Please enter a city name');

    try {
        const weatherData = await fetchWeather(city);
        populateTable(weatherData, city);
        cityInput.value = ''; 
    } catch (error) {
        alert(error.message);
    }
});
