"use client";

import { useEffect, useState } from "react";

import type { ConferenceNow } from "@/utils/conference-clock";
import { getConferenceNow } from "@/utils/conference-clock";

export function useConferenceClock(): ConferenceNow {
  const [now, setNow] = useState<ConferenceNow>(() => getConferenceNow());

  useEffect(() => {
    const tick = () => setNow(getConferenceNow());
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}
