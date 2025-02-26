const CurrentWeather = ({ currentWeather }) => {
  return (
    <div className="current-weather">
      <img src={`icons/${currentWeather.weatherIcon}.svg`} className="weather-icon" alt="weather condition" />
      <h2 className="temperature">
        {currentWeather.temperature} <span>°C</span>
      </h2>
      <p className="description">{currentWeather.description}</p>

      {/* Add humidity and wind speed */}
      <p className="humidity">Humidity: {currentWeather.humidity}%</p>
      <p className="wind-speed">Wind: {currentWeather.windSpeed} km/h</p>
    </div>
  );
};

export default CurrentWeather;
