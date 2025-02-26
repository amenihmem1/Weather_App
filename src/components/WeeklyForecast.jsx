import { v4 as uuidv4 } from 'uuid';  // Importer la fonction UUID

const WeeklyForecast = ({ forecastData }) => {
  return (
    <div className="weekly-forecast">
      <h3>7-Day Forecast</h3>
      <div className="forecast-list">
        {forecastData.map((day) => {
          // Vérification des données avant de les afficher
          const date = day.date && !isNaN(new Date(day.date).getTime()) ? new Date(day.date).toLocaleDateString() : "Date non disponible";
          const icon = day.day?.condition?.icon ? `https:${day.day.condition.icon}` : null;
          const temperature = day.day?.avgtemp_c != null ? Math.floor(day.day.avgtemp_c) : "Données non disponibles";
          const description = day.day?.condition?.text || "Données non disponibles";

          return (
            <div className="forecast-item" key={uuidv4()}>
              <p className="date">{date}</p>
              
              {/* Afficher l'icône si disponible, sinon un message alternatif */}
              {icon ? (
                <img src={icon} alt={description} className="weather-icon" />
              ) : (
                <p>Icône indisponible</p>
              )}
              
              <p className="temperature">
                {temperature}°C
              </p>
              <p className="description">{description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyForecast;
