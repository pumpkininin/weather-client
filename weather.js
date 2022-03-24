//define variable
const OPEN_WEATHER_API_KEY = "ca6df66beamsha1d205404841071p1be2b2jsn4193e54a4c9d"
const cityName = document.querySelector(".city-name");
const countryName = document.querySelector(".country-name");
const condition = document.querySelector(".condition");
const icon = document.querySelector(".icon")
const tempF = document.querySelector(".temp-f")
const tempC = document.querySelector(".temp-c")
const humidity = document.querySelector(".humidity")
const windDirection = document.querySelector(".wind-dir")
const windSpeed = document.querySelector(".wind-kph")
const input = document.querySelector("input");
const btnNext = document.querySelector(".btn-next")
const btnPrev = document.querySelector(".btn-prev")

//format date in form yyyy/MM/dd
composeDate = (date) => {
    return date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate();
}

//get current time
let today = new Date();
let currentDay = composeDate(today);
let currentHour = today.getHours();
let keyword = "hanoi";
let count = 0;

//add search event for input
input.addEventListener("keyup", (evt) => {
    if(evt.key === 'Enter'){
        keyword = evt.target.value;
        updateWeatherInfo(keyword)
    }
})
//add event for btn Next
btnNext.addEventListener("click", (evt) => {
    count++;
    var nextDay = new Date(currentDay);
    nextDay.setDate(nextDay.getDate() + count);
    nextDay = composeDate(nextDay)
    updateWeatherInfo(keyword, nextDay, currentHour);
    document.querySelectorAll('.active').forEach(e => e.classList.remove("active"));
    document.getElementsByClassName(nextDay)[currentHour].parentElement.classList.add("active")
    document.querySelectorAll('.day-in-week ').forEach(e => {
        child = e.getElementsByClassName(nextDay)
        if(child.length == 1){
            e.classList.add("active")
        }
    })
})
//add event for btn Prev
btnPrev.addEventListener("click", (evt) => {
    count --;
    var prevDay = new Date(currentDay);
    prevDay.setDate(prevDay.getDate() + count );
    prevDay = composeDate(prevDay)
    updateWeatherInfo(keyword, prevDay, currentHour);
    document.querySelectorAll('.active').forEach(e => e.classList.remove("active"));
    document.getElementsByClassName(prevDay)[currentHour].parentElement.classList.add("active")
    document.querySelectorAll('.day-in-week ').forEach(e => {
        child = e.getElementsByClassName(prevDay)
        if(child.length == 1){
            e.classList.add("active")
        }
    })
})
//get forcast data in next 3 days
getForecastInfo = async (keyword) => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
            'X-RapidAPI-Key': OPEN_WEATHER_API_KEY
        }
    };
    
    response = await fetch(`https://weatherapi-com.p.rapidapi.com/forecast.json?q=${keyword}&days=14`, options)//fetch data
    return response.json();
}
//get history weather data
getHistoryInfo = async (keyword, date) => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
            'X-RapidAPI-Key': 'ca6df66beamsha1d205404841071p1be2b2jsn4193e54a4c9d'
        }
    };
    
    response = await fetch(`https://weatherapi-com.p.rapidapi.com/history.json?q=${keyword}&dt=${date}&lang=en`, options)

    return response.json();
}
//update GUI by 3 params
//keyword - search keyword (city, place, country)
//day - to get data for specific day (current day as default value)
//hour - to get data for specific hour (current hour as default value)
updateWeatherInfo = (keyword = keyword, day = currentDay, hour = today.getHours()) => {
    dateDiff = Number(day.substring(7)) - Number(currentDay.substring(7))
    if(dateDiff >= 0){
        res = getForecastInfo(keyword)
        .then(res => {
            cityName.innerHTML = res.location.name ;
            countryName.innerHTML = res.location.country ;
            condition.innerHTML =  res.forecast.forecastday[dateDiff].hour[hour].condition.text;
            icon.src = res.forecast.forecastday[dateDiff].hour[hour].condition.icon;
            tempF.innerHTML = res.forecast.forecastday[dateDiff].hour[hour].temp_f;
            tempC.innerHTML = res.forecast.forecastday[dateDiff].hour[hour].temp_c;
            windDirection.innerHTML = res.forecast.forecastday[dateDiff].hour[hour].wind_dir;
            windSpeed.innerHTML = res.forecast.forecastday[dateDiff].hour[hour].wind_kph;
            humidity.innerHTML = res.forecast.forecastday[dateDiff].hour[hour].humidity;
        })
    }else{
        res = getHistoryInfo(keyword, day)
        .then(res => {
            console.log(res);
            cityName.innerHTML = res.location.name;
            countryName.innerHTML = res.location.country;
            condition.innerHTML =  res.forecast.forecastday[0].hour[hour].condition.text;
            icon.src = res.forecast.forecastday[0].hour[hour].condition.icon;
            tempF.innerHTML = res.forecast.forecastday[0].hour[hour].temp_f;
            tempC.innerHTML = res.forecast.forecastday[0].hour[hour].temp_c;
            windDirection.innerHTML = res.forecast.forecastday[0].hour[hour].wind_dir;
            windSpeed.innerHTML = res.forecast.forecastday[0].hour[hour].wind_kph;
            humidity.innerHTML = res.forecast.forecastday[0].hour[hour].humidity;
        });
    }
    document.querySelectorAll(".hour-in-day").forEach(e => {
        e.childNodes[1].innerHTML = day.substring(2)
        e.childNodes[1].className = day
    })
    if(count >= 2){
        btnNext.disabled = true
    }else if(count <= -7){
        btnPrev.disabled = true
    }else{
        btnNext.disabled = false
        btnPrev.disabled = false
    }
}
updateDayInWeek = () => {
    const dayInWeek = document.querySelectorAll(".day-in-week");
    var options = {  weekday: 'long'};
    for(let i = -4; i < 3; i++){
        date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
        detailDate = composeDate(date)
        dayInWeek[i+4].innerHTML = `<p>${date.toLocaleTimeString('en-us', options).split(' ')[0]}</p><p class="${detailDate}">${detailDate.substring(2)}</p>`
        dayInWeek[i+4].addEventListener("click", (evt) => {
            document.querySelector('.active.day-in-week').classList.remove("active")
            evt.currentTarget.classList.add("active");
            updateWeatherInfo(keyword, evt.currentTarget.childNodes[1].className, currentHour)
        })
    }
    dayInWeek[4].classList.add('active');
}
updateHourInDay = () => {
    const hourInDay = document.querySelectorAll(".hour-in-day");
    date = new Date();
    detailDate = composeDate(date)
    for(let i = 0; i < 24; i++){
        if(i === currentHour){
            hourInDay[i].classList.add("active");
        }
        hourInDay[i].innerHTML = `<p>${i}:00</p><p class="${detailDate}">${detailDate.substring(2)}</p>`;
        hourInDay[i].id = i;
        hourInDay[i].addEventListener("click", (evt) =>{
            document.querySelector('.active.hour-in-day').classList.remove("active")
            currentTarget = evt.currentTarget
            currentTarget.classList.add("active");
            console.log(evt.currentTarget.childNodes[1].className);
            updateWeatherInfo(keyword, evt.currentTarget.childNodes[1].className, evt.currentTarget.id)
        })
    }
}

updateWeatherInfo(keyword)
updateDayInWeek();
updateHourInDay();
