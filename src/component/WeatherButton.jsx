// 도시 버튼 목록.
// 이 컴포넌트는 state를 하나도 갖지 않습니다. App이 준 값만 씁니다. (상태 끌어올리기)
//
// props
//   cities   — 도시 배열 (App이 넘겨줌)
//   city     — 지금 선택된 도시 이름 ("" = 현재 위치)
//   setCity  — App의 city state를 바꾸는 함수
//   loading  — 불러오는 중이면 버튼을 잠급니다
function WeatherButton({ cities, city, setCity, loading }) {
  return (
    <nav className="cities" aria-label="도시 선택">
      {cities.map((item) => (
        <button
          key={item.label}
          className={`city ${city === item.name ? "city--on" : ""}`}
          onClick={() => setCity(item.name)}
          disabled={loading}
          aria-pressed={city === item.name}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export default WeatherButton;