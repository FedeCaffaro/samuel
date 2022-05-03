import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
// import styles from "../styles/Home.module.css";

const Countdown: NextPage = () => {
  const [partyTime, setPartyTime] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const target = new Date("05/04/2022 20:30:00");

    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();

      const h = Math.floor(difference / (1000 * 60 * 60));
      setHours(h);

      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      setMinutes(m);

      const s = Math.floor((difference % (1000 * 60)) / 1000);
      setSeconds(s);

      if (h <= 0 && m <= 0 && s <= 0) {
        setPartyTime(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {partyTime ? (
        <>
          <h1>Happy new year!</h1>
          <video autoPlay loop muted>
            <source src="/party.mp4" />
          </video>
        </>
      ) : (
        <>
          <div className="timer-inner">
            <div className="timer-segment">
              <span className="time">{hours}</span>
              {hours == 1 ? (
                <span className="label">Hora</span>
              ) : (
                <span className="label">Horas</span>
              )}
            </div>
            <span className="divider">:</span>
            <div className="timer-segment">
              <span className="time">{minutes}</span>
              {minutes == 1 ? (
                <span className="label">Minuto</span>
              ) : (
                <span className="label">Minutos</span>
              )}
            </div>
            <span className="divider">:</span>
            <div className="timer-segment">
              <span className="time">{seconds}</span>
              <span className="label">Segundos</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Countdown;