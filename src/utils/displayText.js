export const sanitizeDisplayText = (value) => {
  const text = String(value ?? "");
  return text
    .replace(/\s*\(Berlin\)\s*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const sanitizeStationData = (station) => {
  if (!station) return station;

  return {
    ...station,
    value: sanitizeDisplayText(station.value),
    destination: station.destination
      ? {
          ...station.destination,
          name: sanitizeDisplayText(station.destination.name),
        }
      : station.destination,
  };
};