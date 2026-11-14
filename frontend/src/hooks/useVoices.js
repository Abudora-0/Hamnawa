import { useEffect, useState } from "react";
import { speech } from "../services/speech";

export function useVoices() {
  const [voices, setVoices] = useState(() => speech.getVoices());

  useEffect(() => {
    setVoices(speech.getVoices());
    return speech.onVoicesChanged(() => setVoices(speech.getVoices()));
  }, []);

  return voices;
}
