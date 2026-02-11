import { useEffect, useState } from "react";

const TestTimer = ({ minutes, onTimeUp }) => {
  const [seconds, setSeconds] = useState(minutes * 60);

  useEffect(() => {
    if (seconds === 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  return <div>Time Left: {Math.floor(seconds / 60)}:{seconds % 60}</div>;
};

export default TestTimer;
