import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  const pt1 = new Date("2026-01-10T18:55:00.000Z");
  const pt2 = new Date("2026-01-10T21:37:04.000Z");
  const pt3 = new Date("2026-01-11T00:42:22.000Z");
  const end = new Date("2026-01-11T03:03:06.000Z");
  const next = new Date("2027-01-09T18:55:00.000Z");


  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '20px' }}>
      {
        pt1 > time && <div>
            <h3>Time until stream starts</h3>
            <p className='clock'>{msToTime(pt1-time, true)}</p>
        </div>
      }

      {
        pt1 < time && pt2 > time && <div>
            <h3>Part 1 estimated timestamp:</h3>
            <p className='clock'>{msToTime(time-pt1)}</p>
        </div>
      }

      {
        pt2 < time && pt3 > time && <div>
            <h3>Part 2 estimated timestamp:</h3>
            <p className='clock'>{msToTime(time-pt2)}</p>
        </div>
      }

      {
        pt3 < time && end > time && <div>
            <h3>Part 3 estimated timestamp:</h3>
            <p className='clock'>{msToTime(time-pt3)}</p>
        </div>
      }

{
        end < time && next > time && <div>
            <h3>See you next year in:</h3>
            <p className='clock'>{msToTime(next-time, true)}</p>
            <p>(and don't forget Kara no Kyoukai!)</p>
        </div>
      }

      <p>Note: This is based on a pre-calculated estimate, not on the actual stream. It should be accurate to within a few seconds if everything goes according to keikaku, but it might not be exact to the second and it could be off by way more if shit hits the fan. </p>
      <p>Also it is based on your own system's clock so you should synchronize your system time if you want it to be as accurate as possible.</p>
    </div>
  );

  function msToTime(duration, long=false) {
    var seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
        days = Math.floor((duration / (1000 * 60 * 60 * 24)));
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    if (long && days > 0) {
        return days + " days, " + hours + ":" + minutes + ":" + seconds;
    } else {
        return hours + ":" + minutes + ":" + seconds;
    }
    
  }

};



export default Clock;
