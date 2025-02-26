import  { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-heat";

const TemperatureMap = ({ temperatureData }) => {
  useEffect(() => {
    // Créer la carte
    const map = L.map("map", {
      center: [51.505, -0.09], // Par défaut, centre sur un point générique
      zoom: 2,
    });

    // Ajouter le fond de carte (par exemple OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // Si temperatureData existe, ajouter une heatmap
    if (temperatureData && temperatureData.length > 0) {
      const heatData = temperatureData.map((data) => [
        data.lat, // Latitude
        data.lon, // Longitude
        data.temperature, // Valeur de la température
      ]);

      L.heatLayer(heatData, { radius: 25 }).addTo(map);
    }
  }, [temperatureData]);

  return <div id="map" style={{ height: "400px" }}></div>;
};

export default TemperatureMap;
