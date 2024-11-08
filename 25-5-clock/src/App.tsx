import { useRef, useState } from "react";
import "./styles/_app.scss";
import { Counters } from "./components/Counters";
import { Timer } from "./components/Timer";
import { TIMER_ACTION } from "./lib/consts";
import { TimerAction } from "./lib/types";

export const App = () => {
  const [breakValue, setBreakValue] = useState(5);
  const [sessionValue, setSessionValue] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isBreak, setIsBreak] = useState(false);
  const [isClockRunning, setIsClockRunning] = useState(false);

  const timerRef = useRef<number | null>(null);

  const handlePlayStop = () => {
    if (!isClockRunning) {
      setIsClockRunning(true);
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            const audio = document.getElementById("beep") as HTMLAudioElement;
            audio.play();

            setIsBreak((prevState) => !prevState);
            return !isBreak ? breakValue * 60 : sessionValue * 60;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current as number);
      setIsClockRunning(false);
    }
  };

  const setTimer = () => {
    const timerMinutes = Math.floor(seconds / 60);
    const timerSeconds = seconds % 60;

    return `${timerMinutes < 10 ? "0" + timerMinutes : timerMinutes}:${
      timerSeconds < 10 ? "0" + timerSeconds : timerSeconds
    }`;
  };

  const handleBreakChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const action = e.currentTarget.value as TimerAction;

    if (isClockRunning) return;
    if (
      (action === TIMER_ACTION.DECREMENT && breakValue - 1 === 0) ||
      (action === TIMER_ACTION.INCREMENT && breakValue + 1 > 60)
    )
      return;

    const minutes = action === TIMER_ACTION.INCREMENT ? breakValue + 1 : breakValue - 1;
    setBreakValue(minutes);
    setSeconds(!isBreak ? seconds : minutes * 60);
  };

  const handleSessionChange = (e: React.MouseEvent<HTMLButtonElement>) => {
    const action = e.currentTarget.value as TimerAction;

    if (isClockRunning) return;
    if (
      (action === TIMER_ACTION.DECREMENT && sessionValue - 1 === 0) ||
      (action === TIMER_ACTION.INCREMENT && sessionValue + 1 > 60)
    )
      return;

    const minutes =
      action === TIMER_ACTION.INCREMENT ? sessionValue + 1 : sessionValue - 1;

    setSessionValue(minutes);
    setSeconds(isBreak ? seconds : minutes * 60);
  };

  const handleReset = () => {
    clearInterval(timerRef.current as number);

    setBreakValue(5);
    setSessionValue(25);
    setSeconds(25 * 60);
    setIsBreak(false);
    setIsClockRunning(false);

    const audio = document.getElementById("beep") as HTMLAudioElement;
    audio.currentTime = 0;
    audio.pause();

    const timerLabel = document.getElementById(
      "timer-label"
    ) as HTMLParagraphElement;
    timerLabel.textContent = "Session";
  };

  return (
    <div className="clock">
      <section className="title-section">
        <h1>25 + 5 Clock</h1>
      </section>

      <Counters
        breakValue={breakValue}
        sessionValue={sessionValue}
        handleBreakChange={handleBreakChange}
        handleSessionChange={handleSessionChange}
      />

      <Timer
        seconds={seconds}
        isBreak={isBreak}
        setTimer={setTimer}
        handlePlayStop={handlePlayStop}
        handleReset={handleReset}
        isClockRunning={isClockRunning}
      />

      <audio
        id="beep"
        src="https://us-tuna-sounds-files.voicemod.net/84762c26-95d2-4b0f-ac07-33d4729f6ced-1664287470978.mp3"
      />
    </div>
  );
};
