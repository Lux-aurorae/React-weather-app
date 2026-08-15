// 로딩 화면. 궤도를 도는 표식으로 우주시대 계기판 느낌을 냈습니다.
export function LoadingScreen({ message, note }) {
  return (
    <section className="status">
      <span className="orbit" aria-hidden="true">
        <span className="orbit__dot" />
      </span>
      <p className="status__text">{message}</p>
      {note && <p className="status__note">{note}</p>}
    </section>
  );
}

// 완전히 실패했을 때만 쓰입니다. (위치 거부는 실패가 아니라 대체 도시로 넘어갑니다)
export function ErrorScreen({ message, onRetry }) {
  return (
    <section className="status">
      <p className="status__label">신호 없음</p>
      <p className="status__text">{message}</p>
      <button className="retry" onClick={onRetry}>
        다시 시도
      </button>
    </section>
  );
}