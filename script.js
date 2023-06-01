// User types in city name and clicks search 
// Pull data from API and match with the city the user searched
// Return the relevant data for the next 5 days in the days columns

// Target the displays and buttons on the HTML page
var tableBody = document.getElementById('weather-display');
var fetchButton = document.getElementById('fetch-button');
var currentWeatherDisplay = document.getElementById('current-weather-display');
var searchInput = document.getElementById('search-input');
var searchHistory = document.getElementById('search-history');

// Set date format
var today = dayjs().format('ddd MMM D, YYYY');

// Retrieve the previous searches from local storage
var previousSearches = localStorage.getItem('LocalWeatherSearches');
var searchList = previousSearches ? JSON.parse(previousSearches) : [];

// Display the last 5 searches
displaySearchHistory();

// Add event listener to the fetch button
fetchButton.addEventListener('click', function(event) {
    event.preventDefault();
    var cityName = searchInput.value.trim();
    if (cityName) {
        displayWeather(cityName);
        addSearchToHistory(cityName);
        searchInput.value = '';
    }
});

// Function to display weather data
function displayWeather(cityName) {
    var APIKey = "4941bfdda32877230c1f6b853660b979";
    var geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${APIKey}`;

    fetch(geocodeUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function(data) {
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKey}`;

            fetch(requestUrl)
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then(function(data) {
                    console.log(data);
                    tableBody.innerHTML = ""; // Clear existing table data
                    var currentWeather = data.list[0]; // Get the current day's weather
                    var currentTemperature = Math.round((currentWeather.main.temp - 273.15) * 9/5 + 32); // Convert temperature from Kelvin to Fahrenheit
                    var currentDescription = currentWeather.weather[0].description;
                    currentWeatherDisplay.textContent = `Current Weather in ${cityName}: ${currentTemperature}°F, ${currentDescription}`;

                    for (var i = 0; i < data.list.length; i += 8) {
                        // Fetch data for every 24 hours or 8 data points per day
                        var createTableRow = document.createElement('tr');
                        var dateData = document.createElement('td');
                        var temperatureData = document.createElement('td');
                        var descriptionData = document.createElement('td');

                        var date = dayjs(data.list[i].dt_txt).format('ddd MMM D, YYYY');
                        var temperature = Math.round((data.list[i].main.temp - 273.15) * 9/5 + 32); // Convert temperature from Kelvin to Fahrenheit
                        var description = data.list[i].weather[0].description;

                        dateData.textContent = date;
                        temperatureData.textContent = `${temperature}°F`;
                        descriptionData.textContent = description;

                        createTableRow.appendChild(dateData);
                        createTableRow.appendChild(temperatureData);
                        createTableRow.appendChild(descriptionData);
                        tableBody.appendChild(createTableRow);
                    }
                })
                .catch(function(error) {
                    console.error("Error:", error);
                    // Handle error and display appropriate message to the user
                });
        })
        .catch(function(error) {
            console.error("Error:", error);
            // Handle error and display appropriate message to the user
        });
}

// Function to display search history
function displaySearchHistory() {
    searchHistory.innerHTML = '';
    for (var i = 0; i < searchList.length; i++) {
        var searchItem = document.createElement('li');
        searchItem.textContent = capitalizeFirstLetter(searchList[i]);
        searchHistory.appendChild(searchItem);
    }
}

// Function to add search to history
function addSearchToHistory(cityName) {
    // Remove the city name if it already exists in the list
    searchList = searchList.filter(function(item) {
        return item !== cityName;
    });
    // Prepend the new city name to the list
    searchList.unshift(cityName);
    // Keep only the last 5 searches
    if (searchList.length > 5) {
        searchList.pop();
    }
    // Update the local storage
    localStorage.setItem('LocalWeatherSearches', JSON.stringify(searchList));
    // Display the updated search history
    displaySearchHistory();
}

// Function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
