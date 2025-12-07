export function flattenWeather(record: any) {
  return {
    id: record._id?.toString() ?? null,
    temperature: record.temperature ?? null,
    percent_humidity: record.percent_humidity ?? null,

    wind_speed: record.wind?.speed ?? null,
    wind_deg: record.wind?.deg ?? null,

    weather_type: record.weather_condition?.type ?? null,
    weather_description: record.weather_condition?.description ?? null,

    coord_lat: record.coord?.lat ?? null,
    coord_lon: record.coord?.lon ?? null,

    feels_like: record.feels_like ?? null,
    temperature_min: record.temperature_min ?? null,
    temperature_max: record.temperature_max ?? null,
    visibility_level: record.visibility_level ?? null,

    createdAt: record.createdAt ?? null,
  };
}
