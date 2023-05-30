//User types in city name and clicks search 
    //pull data from API and match with the city the user searched
    //return the relevant data for the next 5 days in the days columns

//target the displays and buttons on the html page
var tableBody = document.getElementById('weather-display');
var fetchButton = document.getElementById('fetch-button');

//create undefined variables for the lat and lon 
var lat;
var lon;

//set date format
var today = dayjs().format('ddd MMM D, YYYY');

//store the users search data in local storage 
var citySearch = document.querySelector("#search-input")

fetchButton.addEventListener('click', function(event){
    event.preventDefault;
    var cityWeather = {
        name: citySearch.value,
    }
    localStorage.setItem("Local Weather", JSON.stringify(cityWeather))
    citySearch.value = " "
});

//test the API pulling the data to confirm it 
function getWeather (){
    //var APIKey = "4941bfdda32877230c1f6b853660b979";
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={4941bfdda32877230c1f6b853660b979}';

    fetch(requestUrl)
    .then(function (response){
        console.log(response);
        return response.json();
        })
    .then(function (data) {
        console.log(data)
        for (var i=0; i < data.length; i++) {
            var createTableRow = document.createElement('tr');
            var tableData = document.createElement('td');
            var link = document.createElement('a');

            link.textContent = data[i].html_url;
            link.href = data[i].html_url;

            tableData.appendChild(link);
            createTableRow.appendChild(tableData);
            tableBody.appendChild(createTableRow);
        }
    });
}
fetchButton.addEventListener('click', getWeather);

