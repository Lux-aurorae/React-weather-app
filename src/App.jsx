import { useEffect, useState } from "react";
import "./App.css";
import WeatherBox from "./component/WeatherBox";
import WeatherButton from "./component/WeatherButton";
import Timeline from "./component/Timeline";
import { LoadingScreen, ErrorScreen } from "./component/StatusScreen";
import { getSkyTheme } from "./component/weatherUtils";
import { CITIES } from "./constants/cities";

// Open-Meteo는 API 키가 필요 없습니다. .env 파일도 필요 없습니다.
const BASE = "https://api.open-meteo.com/v1/forecast";
const PARAMS =
  "current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day" +
  "&hourly=temperature_2m,weather_code" +
  "&daily=sunrise,sunset" +
  "&timezone=auto&forecast_days=2";

function App() {
  // ── 모든 state는 App이 소유합니다 (상태 끌어올리기) ──────────────
  const [weather, setWeather] = useState(null); // 현재 날씨
  const [forecast, setForecast] = useState([]); // 24시간 예보
  const [city, setCity] = useState(""); // "" = 현재 위치, 값 있으면 그 도시
  const [loading, setLoading] = useState(true); // 로딩 스피너 표시 여부
  const [error, setError] = useState("");

  // ── Open-Meteo 응답을 화면이 쓰기 좋은 모양으로 정리 ─────────────
  const shape = (data, name, isCurrent) => {
    const c = data.current ?? {};
    return {
      name,
      isCurrent,
      time: c.time,
      temp: c.temperature_2m,
      feels: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      wind: c.wind_speed_10m,
      code: c.weather_code,
      isDay: c.is_day === 1,
      sunrise: data.daily?.sunrise?.[0],
      sunset: data.daily?.sunset?.[0],
    };
  };

  // 지금 시각 이후 3시간 간격 8칸을 뽑아냅니다.
  const shapeForecast = (data, nowTime) => {
    const times = data.hourly?.time ?? [];
    const temps = data.hourly?.temperature_2m ?? [];
    const codes = data.hourly?.weather_code ?? [];

    let start = times.findIndex((t) => t >= nowTime);
    if (start < 0) start = 0;

    const out = [];
    for (let i = start; i < times.length && out.length < 8; i += 3) {
      out.push({ time: times[i], temp: temps[i], code: codes[i] });
    }
    return out;
  };

  // ── 좌표로 날씨 불러오기 (모든 호출이 여기로 모입니다) ────────────
  const fetchWeather = async (lat, lon, name, isCurrent = false) => {
    const url = `${BASE}?latitude=${lat}&longitude=${lon}&${PARAMS}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`날씨 서버 오류 (${response.status})`);

      const data = await response.json();
      const now = shape(data, name, isCurrent);

      setWeather(now);
      setForecast(shapeForecast(data, now.time));
      setError("");
    } catch (e) {
      setError(e.message || "날씨를 불러오지 못했습니다.");
    } finally {
      // 성공이든 실패든 스피너는 반드시 꺼야 합니다.
      setLoading(false);
    }
  };

  // ── 좌표로 지역 이름 찾기 (실패해도 앱은 정상 동작) ───────────────
  const findPlaceName = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ko`
      );
      const d = await res.json();
      return d.city || d.locality || d.principalSubdivision || "현재 위치";
    } catch {
      return "현재 위치";
    }
  };

  // ── 현재 위치 ─────────────────────────────────────────────────
  const getCurrentLocation = () => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      fetchWeather(37.57, 126.98, "서울", false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const name = await findPlaceName(lat, lon);
        fetchWeather(lat, lon, name, true);
      },
      // 권한을 거부해도 화면이 멈추지 않습니다.
      // setLoading(false)를 하지 않고 곧바로 서울을 부르므로,
      // 스피너가 끊기지 않고 이어지다가 날씨가 뜹니다. (NaN이 나올 틈이 없음)
      () => {
        fetchWeather(37.57, 126.98, "서울", false);
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  // ── 선택된 도시 ───────────────────────────────────────────────
  const getWeatherByCity = () => {
    const found = CITIES.find((item) => item.name === city);
    if (!found) return;
    setLoading(true);
    setError("");
    fetchWeather(found.lat, found.lon, found.label, false);
  };

  // ── city가 바뀔 때마다 실행 ───────────────────────────────────
  // city가 ""이면 현재 위치, 값이 있으면 해당 도시.
  // 두 개의 useEffect를 하나로 합치고 조건문으로 나눴습니다.
  useEffect(() => {
    if (city === "") {
      getCurrentLocation();
    } else {
      getWeatherByCity();
    }
  }, [city]);

  const theme = error ? "loading" : getSkyTheme(weather);

  return (
    <div className={`sky sky--${theme}`}>
      <div className="grid" aria-hidden="true" />
      <div className="glow" aria-hidden="true" />

      <main className="shell">
        {loading ? (
          <LoadingScreen message="관측 신호를 받는 중" />
        ) : error ? (
          <ErrorScreen message={error} onRetry={() => getCurrentLocation()} />
        ) : (
          weather && (
            <>
              <WeatherBox weather={weather} />
              <Timeline forecast={forecast} />
            </>
          )
        )}

        <WeatherButton
          cities={CITIES}
          city={city}
          setCity={setCity}
          loading={loading}
        />
      </main>

      <p className="signature">
        <span>
          편두통이 심하지만 투혼중인 <b>dhee</b>
        </span>
      </p>
    </div>
  );
}

export default App;