interface Props {
  seconds: number;
  isBreak: boolean;
  setTimer: () => string;
  handlePlayStop: () => void;
  handleReset: () => void;
  isClockRunning: boolean;
}

export const Timer: React.FC<Props> = ({
  seconds,
  isBreak,
  setTimer,
  handlePlayStop,
  handleReset,
  isClockRunning,
}) => {
  const setGlow =
    seconds === 0
      ? "glow-idle"
      : seconds <= 2
      ? "glow-faster"
      : seconds <= 5
      ? "glow-fast"
      : seconds <= 10
      ? "glow-normal"
      : "";
  return (
    <section className="timer-section">
      <div className="timer-container">
        <p id="timer-label">{isBreak ? "Break" : "Session"}</p>
        <time id="time-left" className={setGlow}>
          {setTimer()}
        </time>
      </div>
      <div className="timer-controls">
        <button onClick={handlePlayStop} id="start_stop">
          <i
            className={
              isClockRunning ? "fa-solid fa-pause" : "fa-solid fa-play"
            }
          ></i>
        </button>
        <button id="reset" onClick={handleReset}>
          <i className="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>
    </section>
  );
};
