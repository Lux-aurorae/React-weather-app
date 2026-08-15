// 도시 배열. 이걸 WeatherButton에 props로 넘기고, 컴포넌트 안에서 map()으로 버튼을 만듭니다.
//
// 배열로 관리하는 이유:
//  ① 도시가 수백 개로 늘어나도 복사·붙여넣기를 하지 않아도 됩니다
//  ② 도시명을 한 곳에서 관리하니 오타가 생기지 않고, 버튼 생성과 API 호출에서 같은 값을 씁니다
//
// name이 빈 문자열("")인 항목은 "현재 위치"를 뜻합니다.
// App의 city state가 ""이면 현재 위치, 값이 있으면 그 도시를 불러옵니다.
export const CITIES = [
  { name: "", label: "현재 위치" },
  { name: "seoul", label: "서울", lat: 37.57, lon: 126.98 },
  { name: "gwangju", label: "광주", lat: 35.16, lon: 126.85 },
  { name: "incheon", label: "인천", lat: 37.46, lon: 126.71 },
  { name: "busan", label: "부산", lat: 35.18, lon: 129.08 },
  { name: "gangneung", label: "강릉", lat: 37.75, lon: 128.88 },
];