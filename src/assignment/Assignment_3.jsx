import { useEffect, useState } from "react";

export default function Assignment_3() {
  const [userLocation, setUserLocation] = useState(null); // user GPS info
  const [closestPlace, setClosestPlace] = useState(null); // nearest town from JSON
  const [error, setError] = useState(""); // error message

  // GPS settings for better accuracy
  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  // calculate distance between 2 GPS points
  const getDistance = (latitude1, longitude1, latitude2, longitude2) => {
    const R = 6371; // earth radius (km)

    const dLatitude = ((latitude2 - latitude1) * Math.PI) / 180;
    const dLongitude = ((longitude2 - longitude1) * Math.PI) / 180;

    const a =
      Math.sin(dLatitude / 2) ** 2 +
      Math.cos((latitude1 * Math.PI) / 180) *
        Math.cos((latitude2 * Math.PI) / 180) *
        Math.sin(dLongitude / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    // get user GPS location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const crd = pos.coords;

        const latitude = crd.latitude;
        const longitude = crd.longitude;

        setUserLocation({ latitude, longitude, accuracy: crd.accuracy });

        // load sri lanka towns/districts
        fetch("./srilanka.map.json")
          .then((res) => res.json())
          .then((data) => {
            let closest = null;
            let minDistance = Infinity;

            // loop through each district and town
            Object.keys(data).forEach((district) => {
              Object.keys(data[district]).forEach((town) => {
                const place = data[district][town];

                // distance between user and town
                const dist = getDistance(
                  latitude,
                  longitude,
                  parseFloat(place.latitude),
                  parseFloat(place.longitude)
                );

                // keep the nearest town
                if (dist < minDistance) {
                  minDistance = dist;
                  closest = {
                    district,
                    town,
                    ...place,
                  };
                }
              });
            });

            setClosestPlace(closest); // update nearest town
          })
          .catch(() => setError("Failed to load srilanka.map.json"));
      },
      // GPS error
      (err) => {
        setError(`Error(${err.code}): ${err.message}`);
      },

      options // high accuracy settings
    );
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Current Location Finder (Sri Lanka)</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!userLocation && !error && <p>Fetching your current location...</p>}

      {userLocation && (
        <div>
          <h3>Your Coordinates:</h3>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
          <p>Accuracy: ± {userLocation.accuracy} meters</p>
        </div>
      )}

      {closestPlace && (
        <div style={{ marginTop: "20px" }}>
          <h3>Nearest Location Found:</h3>
          <p>
            <b>District:</b> {closestPlace.district}
          </p>
          <p>
            <b>Town:</b> {closestPlace.town}
          </p>
          <p>
            <b>Postal Code:</b> {closestPlace.code}
          </p>
        </div>
      )}
    </div>
  );
}
