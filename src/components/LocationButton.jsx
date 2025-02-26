const LocationButton = ({ onLocation }) => {
  const handleLocation = async () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      onLocation(position.coords.latitude, position.coords.longitude);
    } catch (error) {
      let errorMessage = "Erreur lors de la récupération de votre position.";

      if (error.code === 1) {
        errorMessage = "Accès à la localisation refusé. Veuillez autoriser l'accès.";
      } else if (error.code === 2) {
        errorMessage = "Position non disponible. Veuillez réessayer.";
      } else if (error.code === 3) {
        errorMessage = "Délai d'attente dépassé. Veuillez réessayer.";
      }

      alert(errorMessage);
    }
  };

  return (
    <button onClick={handleLocation}>Utiliser ma localisation</button>
  );
};

export default LocationButton;
