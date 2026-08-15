import { toClock, getDayProgress } from "./weatherUtils";

// 과거(일출) → 현재(태양 위치) → 미래(일몰)를 하나의 궤도로 보여줍니다.
// 지나온 궤도는 금색 실선, 남은 궤도는 점선입니다.
function SunArc({ weather }) {
  const p = getDayProgress(weather); // 0 = 일출, 1 = 일몰
  const show = weather.isDay && p > 0 && p < 1;

  // 반원 궤도 위의 좌표 (왼쪽 일출 → 오른쪽 일몰)
  const cx = 160;
  const cy = 100;
  const r = 120;
  const angle = Math.PI * (1 - p);
  const x = cx + r * Math.cos(angle);
  const y = cy - r * Math.sin(angle);
  const arcLen = Math.PI * r;

  return (
    <div className="arc">
      <svg viewBox="0 0 320 118" className="arc__svg" aria-hidden="true">
        <line x1="16" y1="100" x2="304" y2="100" className="arc__horizon" />

        {/* 남은 궤도 (미래) */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          className="arc__future"
        />

        {/* 지나온 궤도 (과거) */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          className="arc__past"
          strokeDasharray={arcLen}
          strokeDashoffset={arcLen * (1 - p)}
        />

        {[0.25, 0.5, 0.75].map((t) => {
          const a = Math.PI * (1 - t);
          return (
            <line
              key={t}
              x1={cx + (r - 6) * Math.cos(a)}
              y1={cy - (r - 6) * Math.sin(a)}
              x2={cx + (r + 6) * Math.cos(a)}
              y2={cy - (r + 6) * Math.sin(a)}
              className="arc__tick"
            />
          );
        })}

        {show && (
          <g className="arc__now">
            <circle cx={x} cy={y} r="16" className="arc__halo" />
            <circle cx={x} cy={y} r="7" className="arc__body" />
          </g>
        )}
      </svg>

      <div className="arc__labels">
        <span>
          <em>일출</em>
          {toClock(weather.sunrise)}
        </span>
        <span className="arc__center">
          <em>지금</em>
          {toClock(weather.time)}
        </span>
        <span>
          <em>일몰</em>
          {toClock(weather.sunset)}
        </span>
      </div>
    </div>
  );
}

export default SunArc;