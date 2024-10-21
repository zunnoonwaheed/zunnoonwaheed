Weather & Chatbot Application with Forecast Tables

Overview

This application provides real-time weather information and a chatbot feature using data from the OpenWeather API. The app fetches and displays the current weather for a specific city, a 5-day weather forecast, and includes interactive charts and forecast tables. Additionally, a basic chatbot allows users to interact by sending messages and receiving responses.

The project consists of several components, divided into HTML, CSS, and JavaScript files.

Project Files

- file.html: Main HTML structure for the weather widget and chatbot.
- file.css: Styles for the weather widget, chatbot, and general layout.
- file.js: JavaScript logic for fetching weather data, updating the weather widget, rendering charts, and handling chatbot interactions.
- tables.html: HTML structure for displaying forecast data in table format.
- tables.css: CSS for styling the forecast tables.
- script.js: JavaScript logic specific to handling the forecast table and additional functionality for the weather forecast.

Features

Weather Functionality
- Current Weather Display**: Shows the temperature, humidity, wind speed, and general weather conditions for a specified city.
- 5-Day Forecast: Displays a 5-day weather forecast for the selected city, showing the daily temperature and weather condition at 12:00 PM.
- Weather Icons: Displays weather icons corresponding to current and forecasted weather conditions.
- Interactive Charts: Bar, doughnut, and line charts provide a visual representation of the weather forecast (temperature trends and weather condition distribution).
- Forecast Table: The 5-day forecast is also displayed in a table format for easy reference.

Chatbot Functionality
- User Interaction: A simple chatbot interface allows users to enter messages and receive responses.
- Conversation Log: Displays user messages and chatbot replies in a conversation format.

API Integration
- **OpenWeather API**: Fetches current weather and forecast data for a specified city.
- **Chatbot API**: Handles user input and responds with chatbot-generated replies.

File Descriptions

HTML Files

file.html:
This is the main HTML file that serves as the entry point for the application. It contains:
- Input field for the user to enter a city name.
- Button to trigger the weather search.
- Weather widget that displays current weather information.
- Chatbot input field and button for interacting with the chatbot.
- Divs and containers for rendering charts and forecast data.

tables.html:
This file contains the structure of the forecast table, which displays the 5-day forecast in a tabular format. It includes:
- A table with headers for date, temperature, weather condition, and icons.
- Elements for dynamic population of forecast data using JavaScript.

CSS Files

file.css:
This file is responsible for the layout and style of the weather widget, chatbot, and other components. Key elements include:
- Weather Widget Styling: Ensures the weather information (temperature, humidity, wind speed, etc.) is presented in a clean, readable format.
- Chatbot Styling: Provides styles for the chatbot input and conversation container.
- Background Colors: Dynamic background colors based on weather conditions (e.g., sunny, cloudy, rainy).
- Responsive Design: The layout adjusts for different screen sizes.

tables.css:
This file contains the styles for the forecast table in `tables.html`. It includes:
- Table Styling: Ensures a clean, responsive layout for the forecast table, with borders and proper padding.
- Forecast Icons: Styles the weather icons displayed in the table.
- Hover Effects: Provides visual feedback when hovering over table rows.

JavaScript Files

file.js:
This JavaScript file contains the core logic for:
- Fetching Current Weather: Uses the OpenWeather API to fetch weather data for the city entered by the user.
- Fetching 5-Day Forecast: Extracts daily weather forecasts at 12:00 PM from the OpenWeather API.
- Updating Weather Widget: Updates the HTML elements in the weather widget based on the fetched data.
- Handling Chatbot Interaction: Sends user input to the chatbot API and displays responses in the chatbot container.
- Rendering Charts: Uses Chart.js to render a bar chart for temperatures, a doughnut chart for weather condition distribution, and a line chart for temperature trends.

script.js:
This script file is specific to handling the forecast table in `tables.html`. It performs the following:
- Updating Forecast Table: Dynamically populates the forecast table with data from the OpenWeather API.
- Icon Handling: Updates the table with appropriate weather icons for each forecast entry.
- Console Logging: Provides feedback on forecast table updates for debugging purposes.

Setup Instructions

Prerequisites
- Modern web browser (e.g., Chrome, Firefox, Edge).
- OpenWeather API key.
- Chatbot API key (optional for chatbot functionality).

Step-by-Step Setup

1. Clone the Repository:
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to Project Directory:
   ```bash
   cd <project-directory>
   ```

3. API Key Configuration:
   - Replace the placeholder API keys (`apiKey` and `chatbotApiKey`) in `file.js` with your actual OpenWeather and Chatbot API keys.

   ```javascript
   const apiKey = 'YOUR_OPENWEATHER_API_KEY';
   const chatbotApiKey = 'YOUR_CHATBOT_API_KEY';
   ```

4. Open HTML Files:
   - Open `file.html` in your browser to access the main weather widget and chatbot interface.
   - Open `tables.html` in your browser to view the forecast table.

Usage

Weather Search
1. City Input: Enter the name of a city in the input field on `file.html`.
2. Get Weather: Click the "Get Weather" button to fetch current weather and 5-day forecast.
3. View Forecast: The forecast data will be displayed as cards, a table, and charts.

Chatbot Interaction
1. Enter Message: Type a message in the chatbot input field.
2. Send Message: Click "Send" to interact with the chatbot.
3. View Conversation: The chatbot will display responses in the conversation log.

Forecast Table
1. Open `tables.html`: View the 5-day weather forecast in table format.
2. Dynamic Table: The table is updated automatically with temperature, weather conditions, and icons based on the data fetched from the OpenWeather API.

Possible Future Improvements
- Enhanced Chatbot: Add more sophisticated conversation capabilities, including contextual responses or predefined conversation flows.
- Customizable Forecast Times: Allow users to specify different times for forecast data instead of a fixed 12:00 PM snapshot.
- Expanded Error Handling: Improve error messages for network issues or invalid city input.
- Historical Weather Data: Integrate historical weather data to compare current weather with past conditions.



<!---
zunnoonwaheed/zunnoonwaheed is a ✨ special ✨ repository because its `README.md` (this file) appears on your GitHub profile.
You can click the Preview link to take a look at your changes.
--->
