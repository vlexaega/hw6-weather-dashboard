//User types in city name and clicks search 
    //pull data from API and match with the city the user searched
    //return the relevant data for the next 5 days in the days columns

var tableBody = document.getElementById('weather-display');
var fetchButton = document.getElementById('fetch-button');

//test the API pulling the data to confirm it 
function getWeather (){
    var requestUrl = 'api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={4941bfdda32877230c1f6b853660b979}';

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

