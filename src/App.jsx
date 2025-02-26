import SearchSection from "./components/SearchSection";
import CurrentWeather from "./components/CurrentWeather";
import HourlyWeatherItem from "./components/HourlyWeatherItem";
import WeeklyForecast from "./components/WeeklyForecast"; // Import du nouveau composant
import { weatherCodes } from "./constants";
import { useEffect, useRef, useState } from "react";
import NoResults from "./components/NoResult";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecasts, setHourlyForecasts] = useState([]);
  const [hasNoResults, setHasNoResults] = useState(false);
  const [sevenDayForecast, setSevenDayForecast] = useState([]); 
  const searchInputRef = useRef(null);
  const API_KEY = import.meta.env.VITE_API_KEY;

  // Filtre les données horaires pour les 24 prochaines heures
  const filterHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;
    const next24HoursData = hourlyData.filter(({ time }) => {
      const forecastTime = new Date(time).getTime();
      return forecastTime >= currentHour && forecastTime <= next24Hours;
    });
    setHourlyForecasts(next24HoursData);
  };

  // Récupère les détails météo basés sur l'URL API
const getWeatherDetails = async (API_URL) => {
  setHasNoResults(false);
  window.innerWidth <= 768 && searchInputRef.current.blur();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    // Extraire les données météo actuelles
    const temperature = Math.floor(data.current.temp_c);
    const description = data.current.condition.text;
    const weatherIcon = Object.keys(weatherCodes).find((icon) => weatherCodes[icon].includes(data.current.condition.code));
    const humidity = data.current.humidity;  // Données d'humidité
    const windSpeed = data.current.wind_kph;  // Données de vitesse du vent

    // Mettre à jour l'état avec toutes les données pertinentes
    setCurrentWeather({
      temperature,
      description,
      weatherIcon,
      humidity,
      windSpeed
    });

    // Combiner les données horaires des deux premiers jours de prévision
    const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];
    searchInputRef.current.value = data.location.name;
    filterHourlyForecast(combinedHourlyData);

    // Vérification et complétion des 7 jours de prévisions
    let forecastDays = data.forecast.forecastday;

    // Compléter les jours manquants (si l'API retourne moins de 7 jours)
    // while (forecastDays.length < 7) {
    //   forecastDays.push({
    //     date: "Date non disponible",  // Utilisation d'une date fictive
    //     day: {
    //       maxtemp_c: 0,
    //       mintemp_c: 0,
    //       avgtemp_c: 0,
    //       condition: { text: "Données non disponibles" }
    //     },
    //     hour: []
    //   });
    // }

    // Limiter à 7 jours et afficher les prévisions
    setSevenDayForecast(forecastDays.slice(0, 7)); // Prendre uniquement les 7 premiers jours

  } catch (error) {
    console.error("Erreur lors de la récupération des données météo:", error);
    setHasNoResults(true);
    // Optionnel: Afficher un message d'erreur à l'utilisateur
    alert("Désolé, nous n'avons pas pu récupérer les données météo. Veuillez réessayer plus tard.");
  }
};






  // Récupérer les données météo pour une ville par défaut (London) lors du premier rendu
  useEffect(() => {
    const defaultCity = "London";
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${defaultCity}&days=7`; // Modifier le paramètre days pour 7 jours
    getWeatherDetails(API_URL);
  }, []);

  return (
    <div className="container">
      {/* Section de recherche */}
      <SearchSection getWeatherDetails={getWeatherDetails} searchInputRef={searchInputRef} />

      {/* Rendu conditionnel basé sur l'état hasNoResults */}
      {hasNoResults ? (
        <NoResults />
      ) : (
        <div className="weather-section">
          {/* Météo actuelle */}
          <CurrentWeather currentWeather={currentWeather} />

          {/* Liste des prévisions horaires */}
          <div className="hourly-forecast">
            <ul className="weather-list">
              {hourlyForecasts.map((hourlyWeather) => (
                <HourlyWeatherItem key={hourlyWeather.time_epoch} hourlyWeather={hourlyWeather} />
              ))}
            </ul>
          </div>

          {/* Affichage des prévisions à long terme */}
          {sevenDayForecast.length > 0 && (
            <WeeklyForecast forecastData={sevenDayForecast} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
