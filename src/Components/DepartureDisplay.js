/* eslint-disable no-loop-func */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import DepartureTable from "./DepartureTable";
import { sanitizeDisplayText } from "../utils/displayText";

const DepartureDisplay = (props) => {
  const TRANSPORT_API_BASE_URLS = [
    "https://v6.vbb.transport.rest",
    "https://v6.bvg.transport.rest",
  ];
  const TRIP_DESTINATION_CACHE_TTL_MS = 5 * 60 * 1000;

  const [columnData, setColumnData] = useState([]);
  const departureDataRef = useRef([]);
  const fetchCounter = useRef(0);
  const fetchIsInProgress = useRef(false);
  const tripDestinationCacheRef = useRef(new Map());

  useEffect(() => {
    let interval;
    if (props.selectedStations.length > 0) {
      fetchDataForSelectedStations();
      interval = setInterval(() => {
        fetchDataForSelectedStations();
      }, 60000);
    } else {
      setColumnData([]);
    }
    return () => {
      clearInterval(interval);
    };
  }, [props.selectedStations]);

  const fetchDataForSelectedStations = () => {
    if (fetchIsInProgress.current) return;

    fetchIsInProgress.current = true;
    departureDataRef.current = [];
    fetchCounter.current = 0;
    for (let i = 0; i < props.selectedStations.length; i++) {
      const selectedStation = props.selectedStations[i];
      fetchDeparturesAtStop(selectedStation);
    }
  };

  const convertJourneyResultToDepartureData = (journeys) => {
    const departures = [];
    for (let i = 0; i < journeys.length; i++) {
      const journey = journeys[i];
      const legs = journey.legs;
      if (legs == null || legs.length === 0) continue;

      const firstLeg = legs?.[0];

      const departure = {
        stop: {
          id: firstLeg.origin.id,
          name: sanitizeDisplayText(firstLeg.origin.name),
          location: firstLeg.origin.location,
        },
        line: {
          name: firstLeg.line.name,
        },
        tripId: firstLeg.tripId || firstLeg.trip?.id,
        direction: sanitizeDisplayText(firstLeg.direction),
        when: firstLeg.departure,
        remarks: firstLeg.remarks,
      };

      departures.push(departure);
    }

    return {
      departures: departures,
    };
  };

  const handleFetchResponse = async (res) => {
    if (fetchCounter.current >= props.selectedStations.length) return;

    fetchCounter.current += 1;
    departureDataRef.current.push(res);

    if (fetchCounter.current === props.selectedStations.length) {
      const columnData = await getColumnData(departureDataRef.current);
      setColumnData(columnData);
      fetchIsInProgress.current = false;
    }
  };

  const buildApiUrl = (baseUrl, path, queryParams = {}) => {
    const url = new URL(path, baseUrl);
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    return url.toString();
  };

  const fetchTransportJson = async (path, queryParams = {}) => {
    let lastError = null;

    for (const baseUrl of TRANSPORT_API_BASE_URLS) {
      try {
        const url = buildApiUrl(baseUrl, path, queryParams);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} at ${baseUrl}`);
        }
        return await response.json();
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("No transport API responded successfully.");
  };

  const resolveTripDestination = async (tripId) => {
    if (!tripId) return "";

    const now = Date.now();
    const cacheEntry = tripDestinationCacheRef.current.get(tripId);

    if (cacheEntry?.value && cacheEntry.expiresAt > now) {
      return cacheEntry.value;
    }

    if (cacheEntry?.pendingPromise) {
      return cacheEntry.pendingPromise;
    }

    const pendingPromise = (async () => {
      try {
        const data = await fetchTransportJson(`/trips/${encodeURIComponent(tripId)}`, {
          language: props.language,
          stopovers: true,
          remarks: false,
        });

        const trip = data?.trip;
        const lastStop = trip?.stopovers?.[trip.stopovers.length - 1]?.stop?.name;
        const fallbackDestination = trip?.destination?.name;
        const destination = sanitizeDisplayText(lastStop || fallbackDestination || "");

        tripDestinationCacheRef.current.set(tripId, {
          value: destination,
          expiresAt: Date.now() + TRIP_DESTINATION_CACHE_TTL_MS,
        });

        return destination;
      } catch {
        tripDestinationCacheRef.current.delete(tripId);
        return "";
      }
    })();

    tripDestinationCacheRef.current.set(tripId, {
      pendingPromise,
      expiresAt: now + TRIP_DESTINATION_CACHE_TTL_MS,
    });

    return pendingPromise;
  };

  const looksLikeDisruptionDestination = (value) => {
    if (!value) return false;
    return /(ersatzverkehr|\bsev\b)/i.test(value);
  };

  const fetchDeparturesAtStop = async (station) => {
    const {
      id: stationId,
      destination,
      when = 0,
      results,
      suburban,
      subway,
      tram,
      bus,
      ferry,
      express,
      regional,
    } = station;

    try {
      const now = new Date();
      const later = new Date(now.getTime() + when * 60000);
      const formattedTime = later.toLocaleTimeString("de-DE", {
        hour12: false,
      });

      if (destination) {
        const data = await fetchTransportJson("/journeys", {
          language: props.language,
          from: stationId,
          to: destination.id,
          departure: formattedTime,
          results,
          suburban,
          subway,
          tram,
          bus,
          ferry,
          express,
          regional,
          remarks: props.standardRemarksVisibility,
        });
        // Gib immer ein Objekt mit departures-Array zurück
        if (data && Array.isArray(data.journeys)) {
          await handleFetchResponse(convertJourneyResultToDepartureData(data.journeys));
        } else {
          await handleFetchResponse({ departures: [] });
        }
      } else {
        const data = await fetchTransportJson(`/stops/${stationId}/departures`, {
          language: props.language,
          when: formattedTime,
          results,
          suburban,
          subway,
          tram,
          bus,
          ferry,
          express,
          regional,
          remarks: props.standardRemarksVisibility,
        });
        await handleFetchResponse(data);
      }
    } catch (error) {
      console.error("Error fetching departures:", error);
      fetchIsInProgress.current = false;
    }
  };

  const getColumnData = async (data) => {
    const rows = [];

    for (let i = 0; i < data.length; i++) {
      const stationData = data[i];
      for (let j = 0; j < stationData.departures.length; j++) {
        const departure = stationData.departures[j];
        const now = new Date();
        const whenDate = departure.when ? new Date(departure.when) : null;
        const diffInMinutes = whenDate
          ? Math.floor((whenDate.getTime() - now.getTime()) / 60000)
          : null;

        rows.push({
          key: `${i}_${departure.stop.id}_${j}`,
          lineName: departure.line.name,
          direction: sanitizeDisplayText(departure.direction),
          departureName: sanitizeDisplayText(departure.stop.name),
          when: diffInMinutes,
          departureTime: departure.when, // Originalzeit als ISO-String
          remarks: departure.remarks,
          tripId: departure.tripId || departure.trip?.id,
          stopId: departure.stop.id,
          stopLocation: departure.stop.location,
        });
      }
    }

    const rowsWithFinalDestination = await Promise.all(
      rows.map(async (row) => {
        const finalDestination = await resolveTripDestination(row.tripId);
        const preferredDirection =
          finalDestination && !looksLikeDisruptionDestination(finalDestination)
            ? finalDestination
            : row.direction;

        return {
          ...row,
          direction: preferredDirection,
        };
      })
    );

    return rowsWithFinalDestination;
  };

  return (
    <div>
      <DepartureTable
        fontSize={props.fontSize}
        dataSource={columnData}
        remarksVisibility={props.remarksVisibility}
        hideDepartureCol={props.hideDepartureCol}
        language={props.language}
      />
    </div>
  );
};

export default DepartureDisplay;
