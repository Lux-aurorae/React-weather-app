import { safeRound, toClock, codeToKorean } from "./weatherUtils";

// 앞으로 24시간을 3시간 간격 8칸으로. 온도를 막대 높이로 그려 흐름이 보이게 했습니다.
function Timeline({ forecast }) {
  if (!forecast || forecast.length === 0) return null;

  const temps = forecast.map((f) => f.temp);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const span = max - min || 1; // 0으로 나누는 것 방지

  return (
    <section className="timeline">
      <p className="timeline__title">
        <span>앞으로 24시간</span>
        <span className="timeline__range">
          {safeRound(min, "°")} — {safeRound(max, "°")}
        </span>
      </p>

      <ol className="timeline__list">
        {forecast.map((f) => (
          <li key={f.time} className="timeline__item">
            <span className="timeline__temp">{safeRound(f.temp, "°")}</span>
            <span
              className="timeline__bar"
              style={{ height: `${18 + ((f.temp - min) / span) * 42}px` }}
            />
            <span className="timeline__hour">{toClock(f.time)}</span>
            <span className="timeline__desc">{codeToKorean(f.code)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default Timeline;