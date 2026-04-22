import React, { useEffect, useState } from "react";
import { sanitizeDisplayText } from "../utils/displayText";

const TramM6RadarList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // BVG Radar API für Tram M6 (Linienname: "M6")
  const fetchRadar = async () => {
    setLoading(true);
    setError(null);
    try {
      // Großes Berlin-Gebiet, alle Metro-Trams holen und dann filtern
      const url = `https://v6.bvg.transport.rest/radar?products=metro&north=52.6&south=52.4&east=13.7&west=13.3`;
      const response = await fetch(url);
      const data = await response.json();
      // Nur Fahrzeuge der Linie M6 anzeigen
      const m6Vehicles = Array.isArray(data)
        ? data.filter(v => v.line && v.line.name === "M6")
        : [];
      setVehicles(m6Vehicles);
    } catch (err) {
      setError("Fehler beim Laden der Fahrzeugdaten.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRadar();
    const interval = setInterval(fetchRadar, 30000); // alle 30 Sekunden aktualisieren
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <h2>Live-Positionen Tram M6</h2>
      {loading && <div>Lade Daten...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <ul>
        {vehicles.length === 0 && !loading && <li>Keine Fahrzeuge gefunden.</li>}
        {vehicles.map((vehicle) => (
          <li key={vehicle.id}>
            Linie: {vehicle.line?.name || "M6"}, Richtung: {sanitizeDisplayText(vehicle.direction) || "?"},
            Position: {vehicle.location?.latitude}, {vehicle.location?.longitude},
            Fahrzeug-ID: {vehicle.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TramM6RadarList;
