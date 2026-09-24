"use client";

import { useEffect, useState } from "react";

import type { ConferenceNow } from "@/utils/conference-clock";
import {
  CONFERENCE_NOW_SSR_PLACEHOLDER,
  getConferenceNow,
} from "@/utils/conference-clock";

export function useConferenceClock(): ConferenceNow {
  const [now, setNow] = useState(CONFERENCE_NOW_SSR_PLACEHOLDER);

  useEffect(() => {
    const tick = () => setNow(getConferenceNow(new Date()));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}
