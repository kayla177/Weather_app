const temp = document.getElementById("temp"),
    date = document.getElementById("date-time"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
    weatherCards = document.querySelector("#weather-cards"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searchForm = document.querySelector("#search"),
    search = document.querySelector("#query");


let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";


function getDateTime() {
    let now = new Date(),
        hour = now.getHours(),
        minute = now.getMinutes();

    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    hour = hour % 12;
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}:${minute}`;
}

date.innerText = getDateTime();
//update time every second
setInterval(() => {
    date.innerText = getDateTime();
}, 1000);

function getPublicIp() {
    fetch("https://geolocation-db.com/json/", {
        method: "GET",
        headers: {},
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            currentCity = data.city;
            getWeatherData(currentCity, currentUnit, hourlyorWeek);//comment this to see original
        })
        .catch((err) => {
            console.error(err);
        });
}

getPublicIp();

function getWeatherData(city, unit, hourlyorWeek) {
    fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=XW4KTN4JHGWQ96T65KTYKTWUG&contentType=json`,
        {
            method: "GET",
            headers: {},
        }
    )
        .then((response) => response.json())
        .then((data) => {
            console.log("Weather API Response:", data);
            let today = data.currentConditions;
            console.log("Icon Condition:", today.icon);


            if (unit === "c") {
                temp.innerText = today.temp;
            } else {
                // console.log(celciusToFahrenheit(today.temp));
                temp.innerText = celciusToFahrenheit(today.temp);
            }
            currentLocation.innerText = data.resolvedAddress;
            condition.innerText = today.conditions;
            rain.innerText = "Perc - " + today.precip + "%";
            uvIndex.innerText = today.uvindex;
            windSpeed.innerText = today.windspeed;
            humidity.innerText = today.humidity + "%";
            visibility.innerText = today.visibility;
            airQuality.innerText = today.winddir;
            measureUvIndex(today.uvindex);
            updateHumidityStatus(today.humidity);
            updateVisibiltyStatus(today.visibility);
            updateAirQualityStatus(today.winddir);
            sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
            sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
            mainIcon.src = getIcon(today.icon);
            if (hourlyorWeek === "hourly") {
                updateForecast(data.days[0].hours, unit, "day");
            } else {
                updateForecast(data.days, unit, "week");
            }
            changeBackground(today.icon);

        })
        .catch((err) => {
            alert("City not found in our database");
        });
}

function celciusToFahrenheit(temp) {
    // console.log(temp);
    return ((temp * 9) / 5 + 32).toFixed(1);
}

function measureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
        uvText.innerText = "Low";
    } else if (uvIndex <= 5) {
        uvText.innerText = "Moderate";
    } else if (uvIndex <= 7) {
        uvText.innerText = "High";
    } else if (uvIndex <= 10) {
        uvText.innerText = "Very High";
    } else {
        uvText.innerText = "Better stay at home ;)";
    }
}

function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
        humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
        humidityStatus.innerText = "Moderate";
    } else {
        humidityStatus.innerText = "High";
    }
}

function updateVisibiltyStatus(visibility) {
    if (visibility <= 0.03) {
        visibilityStatus.innerText = "Dense Fog 🌫";
    } else if (visibility <= 0.16) {
        visibilityStatus.innerText = "Moderate Fog";
    } else if (visibility <= 0.35) {
        visibilityStatus.innerText = "Light Fog";
    } else if (visibility <= 1.13) {
        visibilityStatus.innerText = "Very Light Fog";
    } else if (visibility <= 2.16) {
        visibilityStatus.innerText = "Light Mist";
    } else if (visibility <= 5.4) {
        visibilityStatus.innerText = "Very Light Mist";
    } else if (visibility <= 10.8) {
        visibilityStatus.innerText = "Clear Air";
    } else {
        visibilityStatus.innerText = "Very Clear Air";
    }
}

function updateAirQualityStatus(airquality) {
    if (airquality <= 50) {
        airQualityStatus.innerText = "Good👌";
    } else if (airquality <= 100) {
        airQualityStatus.innerText = "Moderate😐";
    } else if (airquality <= 150) {
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
    } else if (airquality <= 200) {
        airQualityStatus.innerText = "Unhealthy😷";
    } else if (airquality <= 250) {
        airQualityStatus.innerText = "Very Unhealthy😨";
    } else {
        airQualityStatus.innerText = "Hazardous😱";
    }
}


function convertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    hour = hour ? hour : 12;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
}

function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
        return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
        return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
        return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
        return "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === "clear-night") {
        return "https://i.ibb.co/1nxNGHL/10.png";
    } else if (condition === "snow") {
        return "./icons/snow.png";
    } else if (condition === "cloudy") {
        return "./icons/cloudy.png";
    } else {
        return "https://i.ibb.co/rb4rrJL/26.png";
    }
}

function getDayName(date) {
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[day.getDay()];
}

function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else {
        return `${hour}:${min} AM`;
    }
}


function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";
    let day = 0;
    let numCards = 0;
    if (type === "day") {
        numCards = 24;
    } else {
        numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
        let card = document.createElement("div");
        card.classList.add("card");

        //hour if hourly time and day name if weekly
        let dayName = getHour(data[day].datetime);
        if (type === "week") {
            dayName = getDayName(data[day].datetime);
        }
        let dayTemp = data[day].temp;
        if (unit === "f") {
            dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if (unit === "f") {
            tempUnit = "°F";
        }
        card.innerHTML = `
                <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" class="day-icon" alt="" />
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
            </div>
  `;
        weatherCards.appendChild(card);
        day++;
    }
}

fahrenheitBtn.addEventListener("click", () => {
    changeUnit("f");
});
celciusBtn.addEventListener("click", () => {
    changeUnit("c");
});


function changeUnit(unit) {
    if (currentUnit !== unit) {
        currentUnit = unit;
        tempUnit.forEach((elem) => {
            elem.innerText = `°${unit.toUpperCase()}`;
        });
        if (unit === "c") {
            celciusBtn.classList.add("active");
            fahrenheitBtn.classList.remove("active");
        } else {
            celciusBtn.classList.remove("active");
            fahrenheitBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}

hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
});
weekBtn.addEventListener("click", () => {
    changeTimeSpan("week");
});


function changeTimeSpan(unit) {
    if (hourlyorWeek !== unit) {
        hourlyorWeek = unit;
        if (unit === "hourly") {
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        } else {
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
}


function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";
    if (condition === "partly-cloudy-day") {
        bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
    } else if (condition === "partly-cloudy-night") {
        bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
    } else if (condition === "rain") {
        bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
    } else if (condition === "clear-day") {
        bg = "https://i.ibb.co/WGry01m/cd.jpg";
    } else if (condition === "clear-night") {
        bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
    } else if (condition === "snow") {
        bg = "./images/snow.jpg";
    } else if (condition === "cloudy") {
        bg = "./images/cloudy.jpeg";
    } else {
        bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
    }
    body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
        currentCity = location;
        getWeatherData(currentCity, currentUnit, hourlyorWeek);
    }
});

const searchFormContainer = searchForm;

var currentFocus;
search.addEventListener("input", function (e) {
    removeSuggestions();
    var a,
        b,
        i,
        val = this.value;

    //if there is nothing search input do nothing
    if (!val) {
        return false;
    }
    currentFocus = -1;

    //create a ul with a id suggestion
    a = document.createElement("ul");
    a.setAttribute("id", "suggestions");

    //append the ul to its parent which is search form
    this.parentNode.appendChild(a);


    //adding li's with matching search suggestion
    for (i = 0; i < cities.length; i++) {
        //check if the item starts with the same letters as the text field value:
        if (cities[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            //if any suggestion matching then create li
            b = document.createElement("li");
            //adding content in li    make the matching letters bold:
            b.innerHTML = "<strong>" + cities[i].substr(0, val.length) + "</strong>";


            b.innerHTML += cities[i].substr(val.length);
            //insert a input field that will hold the current array item's value -->suggestion value
            b.innerHTML += "<input type='hidden' value='" + cities[i] + "'>";


            //execute a function when someone clicks on the item value (DIV element):
            b.addEventListener("click", function (e) {
                search.value = this.getElementsByTagName("input")[0].value;
                removeSuggestions();
            });

            a.appendChild(b);
        }
    }
});


function removeSuggestions() {
    //select the ul which is being adding on a search input
    var x = document.getElementById("suggestions");
    //if x exist remove it
    if (x) x.parentNode.removeChild(x);
}

search.addEventListener("keydown", function (e) {
    var x = document.getElementById("suggestions");
    //select the li elements of suggestion ul
    if (x) x = x.getElementsByTagName("li");
    if (e.keyCode == 40) {
        //If the arrow DOWN key is pressed, increase the currentFocus variable
        currentFocus++;
        //and make the current item more visible:
        addActive(x);
    } else if (e.keyCode == 38) {
        currentFocus--;
        addActive(x);
    }
    if (e.keyCode == 13) {
        //If the ENTER key is pressed, add the current select suggestion in input field
        e.preventDefault();
        if (currentFocus > -1) {
            //and simulate a click on the "active" item:
            if (x) x[currentFocus].click();
        }
    }
});

function addActive(x) {
    //if there is no suggestion return as it is
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);

    //if current focus is more than the length of suggestion arrays make it 0
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;

    //adding active class on focused li
    x[currentFocus].classList.add("active");
}


function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("active");
    }
}


const cities = [
    "New York",
    "Los Angeles",
    "Chicago",
    "London",
    "Paris",
    "Berlin",
    "Tokyo",
    "Beijing",
    "Sydney",
    "Toronto",
    "Mumbai",
    "Cairo",
    "Rio de Janeiro",
    "Moscow",
    "Cape Town",
    "Dubai",
    "Singapore",
    "Seoul",
    "Mexico City",
    "Toronto",
    "Vancouver",
    "Melbourne",
    "Auckland",
    "Rome",
    "Madrid",
    "Amsterdam",
    "Stockholm",
    "Oslo",
    "Copenhagen",
    "Helsinki",
    "Dublin",
    "Edinburgh",
    "Prague",
    "Vienna",
    "Budapest",
    "Warsaw",
    "Athens",
    "Istanbul",
    "Bangkok",
    "Hanoi",
    "Delhi",
    "Kolkata",
    "Lisbon",
    "Barcelona",
    "Dubrovnik",
    "Venice",
    "Zurich",
    "Geneva",
    "Munich",
    "Frankfurt",
    "Hamburg",
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Wellington",
    "Christchurch",
];
