import { TIMER_ACTION } from "../lib/consts";

interface Props {
    sessionValue: number;
    breakValue: number;
    handleSessionChange: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleBreakChange: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Counters: React.FC<Props> = ({ sessionValue, breakValue, handleSessionChange, handleBreakChange }) => {
  return (
    <section className="counter-section">
      <div className="break-length-container">
        <p id="break-label">Break Length</p>
        <div>
          <button
            id="break-increment"
            value={TIMER_ACTION.INCREMENT}
            onClick={handleBreakChange}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
          <span id="break-length">{breakValue}</span>
          <button
            id="break-decrement"
            value={TIMER_ACTION.DECREMENT}
            onClick={handleBreakChange}
          >
            <i className="fa-solid fa-arrow-down"></i>
          </button>
        </div>
      </div>
      <div className="session-length-container">
        <p id="session-label">Session Length</p>
        <div>
          <button
            id="session-increment"
            value={TIMER_ACTION.INCREMENT}
            onClick={handleSessionChange}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </button>
          <span id="session-length">{sessionValue}</span>
          <button
            id="session-decrement"
            value={TIMER_ACTION.DECREMENT}
            onClick={handleSessionChange}
          >
            <i className="fa-solid fa-arrow-down"></i>
          </button>
        </div>
      </div>
    </section>
  );
};
