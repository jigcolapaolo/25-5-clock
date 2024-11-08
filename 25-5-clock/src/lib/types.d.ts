import { TIMER_ACTION } from "./consts";

type TimerAction = (typeof TIMER_ACTION)[keyof typeof TIMER_ACTION];