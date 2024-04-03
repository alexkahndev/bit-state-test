import { animated, useSprings, SpringRef } from "@react-spring/web";
import { useState } from "react";
import "./App.css";

type ButtonSpring = {
  backgroundColor: string;
  height: string;
  width: string;
};

const App = () => {
  const numBools = 100;
  const [flipped, setFlipped] = useState(new Set());
  const [available, setAvailable] = useState(
    new Set(Array.from({ length: numBools }, (_, i) => i)),
  );

  const [lastIndexFlipped, setLastIndexFlipped] = useState(-1);
  const [timeToFlipLast, setTimeToFlipLast] = useState(0);
  const [timeToFlipLastRandom, setTimeToFlipLastRandom] = useState(0);
  const [boolsFlipped, setBoolsFlipped] = useState(0);
  const [totalTimeRandom, setTotalTimeRandom] = useState(0);
  const [avgRandomTime, setAvgRandomTime] = useState(0);
  const flip = (index: number, api: SpringRef<ButtonSpring>) => {
    const timeStart = performance.now();
    const newFlipped = new Set(flipped);
    if (newFlipped.has(index)) {
      newFlipped.delete(index);
    } else {
      newFlipped.add(index);
    }
    api.start((i) => {
      if (index !== i) return;
      return {
        backgroundColor: newFlipped.has(index) ? "lightgreen" : "salmon",
      };
    });

    setFlipped(newFlipped);
    setLastIndexFlipped(index);

    if (newFlipped.has(index)) {
      available.delete(index);
    } else {
      available.add(index);
    }
    setAvailable(available);

    const timeEnd = performance.now();
    const timeToFlip = Number((timeEnd - timeStart).toFixed(3));
    setTimeToFlipLast(timeToFlip);
  };

  const flipRandomAvailable = () => {
    const timeStart = performance.now();
    if (available.size > 0) {
      const randomIndex =
        Array.from(available)[Math.floor(Math.random() * available.size)];
      flip(randomIndex, api);
      const timeEnd = performance.now();

      const timeToFlipRandom = Number((timeEnd - timeStart).toFixed(3));
      setTimeToFlipLastRandom(timeToFlipRandom);
      setTotalTimeRandom((prev) => prev + timeToFlipRandom);
      setBoolsFlipped((prev) => prev + 1);
      setAvgRandomTime(Number((totalTimeRandom / boolsFlipped).toFixed(3)));
    } else {
      setLastIndexFlipped(-1);
    }
  };

  const [springs, api] = useSprings(numBools, () => ({
    backgroundColor: "salmon",
    height: "100px",
    width: "100px",
  }));

  return (
    <div className="page-container">
      <h1 className="title">Efficient Random Boolean Flip</h1>
      <div className="boolean-container">
        {springs.map((props, index) => (
          <animated.button
            key={index}
            style={props}
            onClick={() => flip(index, api)}
          >
            {index}
            <br />
            {flipped.has(index) ? "On" : "Off"}
          </animated.button>
        ))}
      </div>
      <div className="control-container">
        <button onClick={flipRandomAvailable} className="random-button">
          Flip Random Boolean
        </button>
        <div>
          <p>Last index flipped: {lastIndexFlipped}</p>
          <p>Time to flip last index: {timeToFlipLast} ms</p>
          <p>Time to flip last random index: {timeToFlipLastRandom} ms</p>
          <p>Number of bools flipped: {boolsFlipped}</p>
          <p>Average time to flip random index: {avgRandomTime} ms</p>
        </div>
      </div>
    </div>
  );
};

export default App;
