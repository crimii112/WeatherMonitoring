import useInterval from 'hook/useInterval';
import moment from 'moment';
import { useEffect, useState } from 'react';

const Timer = ({ defaultSeconds, clickedTime }) => {
  const [time, setTime] = useState(defaultSeconds);

  useEffect(() => {
    setTime(defaultSeconds);
  }, [defaultSeconds]);

  useInterval(() => {
    if (time <= 0) setTime(defaultSeconds);

    const currentTime = moment();
    const diff = moment.duration(currentTime.diff(clickedTime)).asSeconds();
    /*console.log(
      clickedTime.format('YY-MM-DD HH:mm:ss') +
        ' : ' +
        currentTime.format('YY-MM-DD HH:mm:ss'),
    );
    console.log(
      Math.floor(diff).toString() +
        ' : ' +
        (defaultSeconds - Math.floor(diff)).toString(),
    );*/

    setTime(defaultSeconds - Math.floor(diff));
  }, 1000);

  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (time % 60 === 0 ? '00' : time % 60)
    .toString()
    .padStart(2, '0');
  const formattedTime = minutes + ':' + seconds;
  return <span>{formattedTime}</span>;
};

export default Timer;
