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
//function to display the time on the page every second
function updateDateTime() {
    var currentDateTime = dayjs().format('ddd MMM d, YY h:ma');
    document.getElementById('current-date-time').textContent = currentDateTime;
  }
  
  // Initial call to update the date and time
  updateDateTime();
  // Update the date and time every second
  setInterval(updateDateTime, 1000);

  

// Retrieve the previous searches from local storage
var previousSearches = localStorage.getItem('LocalWeatherSearches');
var searchList = previousSearches ? JSON.parse(previousSearches) : [];


// Display the last 5 searches
displaySearchHistory();

// Add event listener to the fetch button
fetchButton.addEventListener('click', function(event) {
    event.preventDefault();
    var cityName = searchInput.value.trim();
    cityName = capitalizeFirstLetter(cityName); //capitalizes the first letter of the city name even if user types in lowercase
    console.log(cityName);
    if (cityName) {
        displayWeather(cityName);
        addSearchToHistory(cityName);
        searchInput.value = '';
    }
});
console.log(cityName)
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

                    var dailyData = {}; // Object to store weather data grouped by day

                    // Group weather data by day
                    for (var i = 0; i < data.list.length; i++) {
                        var date = dayjs(data.list[i].dt_txt).format('ddd MMM D, YYYY');
                        if (!dailyData[date]) {
                            dailyData[date] = [];
                        }
                        var temperature = Math.round((data.list[i].main.temp - 273.15) * 9/5 + 32); // Convert temperature from Kelvin to Fahrenheit
                        var description = data.list[i].weather[0].description;
                        dailyData[date].push({ temperature: temperature, description: description });
                    }

                    var dayCounter = 0;
                    var createTableRow; // Variable to store the current table row element

                    // Create table rows for each day
                    for (var date in dailyData) {
                        if (dayCounter % 5 === 0) {
                            createTableRow = document.createElement('tr');
                        }

                        var dateData = document.createElement('td');
                        var temperatureData = document.createElement('td');
                        var descriptionData = document.createElement('td');

                        dateData.textContent = date;

                        // Display the first weather data entry for each day
                        var weatherData = dailyData[date][0];
                        temperatureData.textContent = `${weatherData.temperature}°F`;
                        descriptionData.textContent = weatherData.description;

                        createTableRow.appendChild(dateData);
                        createTableRow.appendChild(temperatureData);
                        createTableRow.appendChild(descriptionData);

                        if (dayCounter % 5 === 4) {
                            tableBody.appendChild(createTableRow);
                        }

                        dayCounter++;
                    }

                    // Check if there is an incomplete row and append it to the table body
                    if (createTableRow) {
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
        var searchItem = document.createElement('ul');
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
