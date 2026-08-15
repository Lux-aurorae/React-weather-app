// ===========================================================
// Open-Meteo 응답을 화면용 값으로 바꾸는 도구 모음
// ===========================================================

// WMO 기상 코드 → 한국어 설명 + 화면 테마
// Open-Meteo는 문자열이 아닌 숫자 코드로 날씨를 알려줍니다.
const WMO = {
  0:  { ko: "맑음",           kind: "clear" },
  1:  { ko: "대체로 맑음",     kind: "clear" },
  2:  { ko: "구름 조금",       kind: "clouds" },
  3:  { ko: "흐림",           kind: "clouds" },
  45: { ko: "안개",           kind: "mist" },
  48: { ko: "짙은 서리 안개",  kind: "mist" },
  51: { ko: "약한 이슬비",     kind: "rain" },
  53: { ko: "이슬비",         kind: "rain" },
  55: { ko: "강한 이슬비",     kind: "rain" },
  56: { ko: "얼어붙는 이슬비", kind: "rain" },
  57: { ko: "강한 어는 이슬비", kind: "rain" },
  61: { ko: "약한 비",        kind: "rain" },
  63: { ko: "비",            kind: "rain" },
  65: { ko: "강한 비",        kind: "rain" },
  66: { ko: "얼어붙는 비",     kind: "rain" },
  67: { ko: "강한 어는 비",    kind: "rain" },
  71: { ko: "약한 눈",        kind: "snow" },
  73: { ko: "눈",            kind: "snow" },
  75: { ko: "폭설",          kind: "snow" },
  77: { ko: "싸락눈",         kind: "snow" },
  80: { ko: "약한 소나기",     kind: "rain" },
  81: { ko: "소나기",         kind: "rain" },
  82: { ko: "강한 소나기",     kind: "rain" },
  85: { ko: "약한 눈소나기",   kind: "snow" },
  86: { ko: "강한 눈소나기",   kind: "snow" },
  95: { ko: "천둥번개",       kind: "thunder" },
  96: { ko: "천둥번개와 우박", kind: "thunder" },
  99: { ko: "강한 천둥과 우박", kind: "thunder" },
};

export function codeToKorean(code) {
  return WMO[code]?.ko ?? "알 수 없음";
}

// 날씨 코드 + 낮/밤 → App.css의 .sky--clear-day 같은 클래스 이름
export function getSkyTheme(weather) {
  if (!weather) return "loading";

  const kind = WMO[weather.code]?.kind ?? "clouds";
  const suffix = weather.isDay ? "day" : "night";

  if (kind === "clear" || kind === "clouds") return `${kind}-${suffix}`;
  return kind; // rain, snow, thunder, mist는 낮밤 구분 없음
}

// 화씨 변환. 값이 없으면 null을 돌려줘 NaN이 화면에 나오지 않게 합니다.
export function toFahrenheit(celsius) {
  if (typeof celsius !== "number" || Number.isNaN(celsius)) return null;
  return celsius * (9 / 5) + 32;
}

// 안전한 반올림. 값이 없으면 "–"를 돌려줍니다. (NaN 방지의 핵심)
export function safeRound(value, suffix = "") {
  if (typeof value !== "number" || Number.isNaN(value)) return "–";
  return `${Math.round(value)}${suffix}`;
}

// Open-Meteo는 timezone=auto를 붙이면 "2026-08-15T14:30" 형태의 현지 시각을 줍니다.
// 별도 계산 없이 뒤쪽 5글자만 잘라 쓰면 됩니다.
export function toClock(isoString) {
  if (typeof isoString !== "string" || isoString.length < 16) return "–";
  return isoString.slice(11, 16);
}

// "2026-08-15T14:30" → 870 (자정부터 지난 분)
function toMinutes(isoString) {
  if (typeof isoString !== "string" || isoString.length < 16) return null;
  const h = Number(isoString.slice(11, 13));
  const m = Number(isoString.slice(14, 16));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

// 일출~일몰 사이에서 지금이 몇 %쯤인지 (0~1). 궤도 그래픽에 씁니다.
export function getDayProgress(weather) {
  const now = toMinutes(weather?.time);
  const rise = toMinutes(weather?.sunrise);
  const set = toMinutes(weather?.sunset);
  if (now === null || rise === null || set === null) return 0;

  const span = set - rise;
  if (span <= 0) return 0;
  return Math.min(1, Math.max(0, (now - rise) / span));
}