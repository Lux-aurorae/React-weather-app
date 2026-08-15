import SunArc from "./SunArc";
import { codeToKorean, toFahrenheit, safeRound } from "./weatherUtils";

// 현재 날씨를 보여주는 표시 전용 컴포넌트. state 없이 props만 받습니다.
function WeatherBox({ weather }) {
  // safeRound가 값이 없을 때 "–"를 돌려주므로 NaN이 절대 화면에 나오지 않습니다.
  const celsius = safeRound(weather.temp);
  const fahrenheit = safeRound(toFahrenheit(weather.temp), "°F");

  return (
    <section className="panel">
      <header className="panel__head">
        <span className="chip">{weather.isCurrent ? "현재 위치" : "관측 지점"}</span>
        <h1 className="panel__city">{weather.name}</h1>
      </header>

      <div className="panel__now">
        <p className="panel__temp">
          {celsius}
          <span className="panel__unit">°C</span>
        </p>
        <p className="panel__desc">{codeToKorean(weather.code)}</p>
      </div>

      <SunArc weather={weather} />

      <dl className="readings">
        <div>
          <dt>화씨</dt>
          <dd>{fahrenheit}</dd>
        </div>
        <div>
          <dt>체감</dt>
          <dd>{safeRound(weather.feels, "°")}</dd>
        </div>
        <div>
          <dt>습도</dt>
          <dd>{safeRound(weather.humidity, "%")}</dd>
        </div>
        <div>
          <dt>바람</dt>
          <dd>{safeRound(weather.wind, "㎧")}</dd>
        </div>
      </dl>
    </section>
  );
}

export default WeatherBox;