//CONVERSION FUNCTIONS
const getNextDay = (dateSkip) => {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ]
  const today = new Date().getDay()
  if(today+dateSkip>=7){
    return weekday[today+dateSkip-7]
  }else{
    return weekday[today+dateSkip]
  }
}
let convertCloudCoverage = (coverage) => {
  if(coverage>87)return"Overcast"
  else if(coverage>69)return"Mostly cloudy"
  else if(coverage>50)return"Mostly Sunny"
  else if(coverage>25)return"Partly cloudy"
  else if(coverage>5)return"Mostly clear"
  else return"clear" 

}
let convertUnixToString = (unix) => {
  let date=new Date(unix*1000)
  let hours=date.getHours()
  let minutes = "0" + date.getMinutes()
  return hours + ":" + minutes.substr(-2)
}
let convert24HourTimeTo12 = (time) => {
  let hours=time.split(":")[0]
  let minutes=time.split(":")[1]
  let pm=false
  if(hours>12){
    hours=hours%12
    pm=true
  }
  if(hours==0)return `12:${minutes}${pm?"PM":"AM"}`
  return hours+":"+minutes+ (pm?"PM":"AM")
}
//END
let URLparams = new URLSearchParams(window.location.search)
let coords = new URLSearchParams(window.location.search)
const apiKey = "9d1ad02be55860b48fa529745562adee" // pwwease dont steal api key ;=;
fetch(URLparams.has('city')?`https://api.openweathermap.org/data/2.5/weather?q=${URLparams.get('city')}&appid=${apiKey}&units=metric` : `https://api.openweathermap.org/data/2.5/weather?lat=${URLparams.get('lat')}&lon=${URLparams.get('lon')}&appid=${apiKey}&units=metric`).then(async (response) => {
  let currentWeatherAPI = await response.json()
  if(currentWeatherAPI.cod!=200){
    document.body.innerHTML=`CODE:${currentWeatherAPI.cod}<br>MESSAGE:${currentWeatherAPI.message}<br><button onclick="window.location.href='/index.html'">return to home page</button>`
    document.body.style.backgroundImage='none'
    return;
  }
  document.getElementsByClassName('title')[0].innerHTML=currentWeatherAPI.name
  fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${currentWeatherAPI.coord.lat}&lon=${currentWeatherAPI.coord.lon}&exclude=minutely&units=metric&appid=${apiKey}`).then(async (response2) => {
    let weather = await response2.json()
    //OPENWEATHERMAP RETURNS A UNIX TIMESTAMP DON'T BE STUPID
    const docElements = {
      //=========current=========
      currentForecast: document.getElementsByClassName('currentForecast'),
      sevenDayForecast: document.getElementsByClassName('sevenDayForecast'),
      sunrise: document.getElementById('sunrise'),
      sunset: document.getElementById('sunset'),
      tempature: document.getElementById('tempature'),
      feelsLike: document.getElementById('feelsLike'),
      humidity: document.getElementById('humidity'),
      clouds: document.getElementById('clouds'),
      uv: document.getElementById('uv'),
      windSpeed: document.getElementById('windSpeed'),
      //weather
      weatherImage: document.getElementById('weatherImage'),
      weatherMain: document.getElementById('weatherMain'),
      weatherDisc:document.getElementById('weatherDisc'),
      //other info
      country: document.getElementById('countryCode'),
      timezone: document.getElementById('timezone'),
      longitude: document.getElementById('lon'),
      latitude: document.getElementById('lat'),
      //=========forecast=========
      forecastOne:document.getElementById('sevenDayForecastOne'),
      forecastTwo:document.getElementById('sevenDayForecastTwo'),
      forecastThree:document.getElementById('sevenDayForecastThree'),
      forecastFour:document.getElementById('sevenDayForecastFour'),
      forecastFive:document.getElementById('sevenDayForecastFive'),
      forecastSix:document.getElementById('sevenDayForecastSix'),
      forecastSeven:document.getElementById('sevenDayForecastSeven'),
    }
    docElements.sunrise.innerHTML=convert24HourTimeTo12(convertUnixToString(weather.current.sunrise))
    docElements.sunset.innerHTML=convert24HourTimeTo12(convertUnixToString(weather.current.sunset))
    docElements.tempature.innerHTML=weather.current.temp + "&#176;"
    docElements.feelsLike.innerHTML=weather.current.feels_like + "&#176;"
    docElements.humidity.innerHTML=weather.current.humidity+"%"
    docElements.clouds.innerHTML=convertCloudCoverage(weather.current.clouds)+`(${weather.current.clouds}%)`
    docElements.uv.innerHTML=weather.current.uvi
    docElements.windSpeed.innerHTML=currentWeatherAPI.wind.speed+"m/h"
    //weather
    docElements.weatherImage.src=`https://openweathermap.org/img/wn/${currentWeatherAPI.weather[0].icon}@2x.png`
    docElements.weatherMain.innerHTML=currentWeatherAPI.weather[0].main
    docElements.weatherDisc.innerHTML=currentWeatherAPI.weather[0].description
    //other info
    docElements.timezone.innerHTML=weather.timezone
    docElements.country.innerHTML=currentWeatherAPI.sys.country
    docElements.longitude.innerHTML=weather.lon
    docElements.latitude.innerHTML=weather.lat
    //forecast
    console.log(weather.daily[1])
    docElements.forecastOne.innerHTML=`
    <div><img src="./icons/calendar.png" width=25>Day: ${getNextDay(1)}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Max tempature: ${weather.daily[1].temp.max}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Min tempature: ${weather.daily[1].temp.min}</div><br><br>
    <div><img src="https://openweathermap.org/img/wn/${weather.daily[1].weather[0].icon}@2x.png" width=25>${weather.daily[1].weather[0].main}<br>${weather.daily[1].weather[0].description}</div><br><br>
    <div><img src="./icons/raindrop.png"width=25>Prob of rain: ${weather.daily[1].pop}%</div><br><br>
    <div><img src="./icons/clouds.png"width=25>Clouds: ${weather.daily[1].clouds}%</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunrise at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[1].sunrise))}</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunset at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[1].sunset))}</div><br><br>
    <div><img src="./icons/uv.png"width=25>UV: ${weather.daily[1].uvi}</div><br><br>
    <div><img src="./icons/humidity.png" width=25>Humidity: ${weather.daily[1].humidity}%</div><br><br>`
    docElements.forecastTwo.innerHTML=`
    <div><img src="./icons/calendar.png" width=25>Day: ${getNextDay(2)}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Max tempature: ${weather.daily[2].temp.max}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Min tempature: ${weather.daily[2].temp.min}</div><br><br>
    <div><img src="https://openweathermap.org/img/wn/${weather.daily[2].weather[0].icon}@2x.png" width=25>${weather.daily[2].weather[0].main}<br>${weather.daily[2].weather[0].description}</div><br><br>
    <div><img src="./icons/raindrop.png"width=25>Prob of rain: ${weather.daily[2].pop}%</div><br><br>
    <div><img src="./icons/clouds.png"width=25>Clouds: ${weather.daily[2].clouds}%</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunrise at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[2].sunrise))}</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunset at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[2].sunset))}</div><br><br>
    <div><img src="./icons/uv.png"width=25>UV: ${weather.daily[2].uvi}</div><br><br>
    <div><img src="./icons/humidity.png" width=25>Humidity: ${weather.daily[2].humidity}%</div><br><br>`
    docElements.forecastThree.innerHTML=`
    <div><img src="./icons/calendar.png" width=25>Day: ${getNextDay(3)}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Max tempature: ${weather.daily[3].temp.max}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Min tempature: ${weather.daily[3].temp.min}</div><br><br>
    <div><img src="https://openweathermap.org/img/wn/${weather.daily[3].weather[0].icon}@2x.png" width=25>${weather.daily[3].weather[0].main}<br>${weather.daily[3].weather[0].description}</div><br><br>
    <div><img src="./icons/raindrop.png"width=25>Prob of rain: ${weather.daily[3].pop}%</div><br><br>
    <div><img src="./icons/clouds.png"width=25>Clouds: ${weather.daily[3].clouds}%</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunrise at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[3].sunrise))}</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunset at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[3].sunset))}</div><br><br>
    <div><img src="./icons/uv.png"width=25>UV: ${weather.daily[3].uvi}</div><br><br>
    <div><img src="./icons/humidity.png" width=25>Humidity: ${weather.daily[3].humidity}%</div><br><br>`
    docElements.forecastFour.innerHTML=`    
    <div><img src="./icons/calendar.png" width=25>Day: ${getNextDay(4)}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Max tempature: ${weather.daily[4].temp.max}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Min tempature: ${weather.daily[4].temp.min}</div><br><br>
    <div><img src="https://openweathermap.org/img/wn/${weather.daily[4].weather[0].icon}@2x.png" width=25>${weather.daily[4].weather[0].main}<br>${weather.daily[4].weather[0].description}</div><br><br>
    <div><img src="./icons/raindrop.png"width=25>Prob of rain: ${weather.daily[4].pop}%</div><br><br>
    <div><img src="./icons/clouds.png"width=25>Clouds: ${weather.daily[4].clouds}%</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunrise at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[4].sunrise))}</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunset at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[4].sunset))}</div><br><br>
    <div><img src="./icons/uv.png"width=25>UV: ${weather.daily[4].uvi}</div><br><br>
    <div><img src="./icons/humidity.png" width=25>Humidity: ${weather.daily[4].humidity}%</div><br><br>`
    docElements.forecastFive.innerHTML=`    
    <div><img src="./icons/calendar.png" width=25>Day: ${getNextDay(5)}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Max tempature: ${weather.daily[5].temp.max}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Min tempature: ${weather.daily[5].temp.min}</div><br><br>
    <div><img src="https://openweathermap.org/img/wn/${weather.daily[5].weather[0].icon}@2x.png" width=25>${weather.daily[5].weather[0].main}<br>${weather.daily[5].weather[0].description}</div><br><br>
    <div><img src="./icons/raindrop.png"width=25>Prob of rain: ${weather.daily[5].pop}%</div><br><br>
    <div><img src="./icons/clouds.png"width=25>Clouds: ${weather.daily[5].clouds}%</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunrise at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[5].sunrise))}</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunset at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[5].sunset))}</div><br><br>
    <div><img src="./icons/uv.png"width=25>UV: ${weather.daily[5].uvi}</div><br><br>
    <div><img src="./icons/humidity.png" width=25>Humidity: ${weather.daily[5].humidity}%</div><br><br>`
    docElements.forecastSix.innerHTML=`    
    <div><img src="./icons/calendar.png" width=25>Day: ${getNextDay(6)}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Max tempature: ${weather.daily[6].temp.max}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Min tempature: ${weather.daily[6].temp.min}</div><br><br>
    <div><img src="https://openweathermap.org/img/wn/${weather.daily[6].weather[0].icon}@2x.png" width=25>${weather.daily[6].weather[0].main}<br>${weather.daily[6].weather[0].description}</div><br><br>
    <div><img src="./icons/raindrop.png"width=25>Prob of rain: ${weather.daily[6].pop}%</div><br><br>
    <div><img src="./icons/clouds.png"width=25>Clouds: ${weather.daily[6].clouds}%</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunrise at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[6].sunrise))}</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunset at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[6].sunset))}</div><br><br>
    <div><img src="./icons/uv.png"width=25>UV: ${weather.daily[6].uvi}</div><br><br>
    <div><img src="./icons/humidity.png" width=25>Humidity: ${weather.daily[6].humidity}%</div><br><br>`
    docElements.forecastSeven.innerHTML=`    
    <div><img src="./icons/calendar.png" width=25>Day: ${getNextDay(7)}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Max tempature: ${weather.daily[7].temp.max}</div><br><br>
    <div><img src="./icons/tempature.png"width=25>Min tempature: ${weather.daily[7].temp.min}</div><br><br>
    <div><img src="https://openweathermap.org/img/wn/${weather.daily[7].weather[0].icon}@2x.png" width=25>${weather.daily[7].weather[0].main}<br>${weather.daily[7].weather[0].description}</div><br><br>
    <div><img src="./icons/raindrop.png"width=25>Prob of rain: ${weather.daily[7].pop}%</div><br><br>
    <div><img src="./icons/clouds.png"width=25>Clouds: ${weather.daily[7].clouds}%</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunrise at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[7].sunrise))}</div><br><br>
    <div><img src="./icons/sunrise.png" width=25>Sunset at: ${convert24HourTimeTo12(convertUnixToString(weather.daily[7].sunset))}</div><br><br>
    <div><img src="./icons/uv.png"width=25>UV: ${weather.daily[7].uvi}</div><br><br>
    <div><img src="./icons/humidity.png" width=25>Humidity: ${weather.daily[7].humidity}%</div><br><br>`


    for(i=0;i<24;i++){
      let element=document.getElementById(`hourlyForecast${i+1}`)
      let hourlyWeather = weather.hourly[i]
      element.innerHTML=`
      <div><img src="./icons/clock.png"width=25>${convert24HourTimeTo12(convertUnixToString(hourlyWeather.dt))}</div><br><br>
      <div><img src="./icons/tempature.png"width=25>Tempature: ${hourlyWeather.temp}</div><br><br>
      <div><img src="./icons/tempature.png"width=25>Feels like: ${hourlyWeather.feels_like}</div><br><br>
      <div><img src="https://openweathermap.org/img/wn/${hourlyWeather.weather[0].icon}@2x.png" width=25>${hourlyWeather.weather[0].main}<br>${hourlyWeather.weather[0].description}</div><br><br>
      <div><img src="./icons/humidity.png"width=25>Humidity: ${hourlyWeather.humidity}%</div><br><br>
      <div><img src="./icons/uv.png"width=25>UV: ${hourlyWeather.uvi}</div><br><br>
      <div><img src="./icons/clouds.png"width=25>Clouds: ${hourlyWeather.clouds}%</div><br><br>
      `
    }
  })
})