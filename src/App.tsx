import { animated, useSprings, SpringRef } from "@react-spring/web";
import { useState } from "react";

type ButtonSpring = {
  backgroundColor: string;
  height: string;
  width: string;
};

const App = () => {
  const numBools = 100;
  const [flipped, setFlipped] = useState(Array(numBools).fill(false));
  const [available, setAvailable] = useState(
    Array.from({ length: numBools }, (_, i) => i),
  );

  const flip = (index: number, api: SpringRef<ButtonSpring>) => {
    const timeStart = performance.now();
    const newFlipped = [...flipped];
    newFlipped[index] = !newFlipped[index];
    api.start((i) => {
      if (index !== i) return;

      return { backgroundColor: newFlipped[index] ? "lightgreen" : "salmon" };
    });

    setFlipped(newFlipped);
    setLastIndexFlipped(index);

    if (newFlipped[index]) {
      setAvailable(available.filter((i) => i !== index));
    } else {
      setAvailable([...available, index]);
    }

    const timeEnd = performance.now();
    const timeToFlip = Number((timeEnd - timeStart).toFixed(3));
    setTimeToFlipLast(timeToFlip);
  };

  const flipRandomAvailable = () => {
    const timeStart = performance.now();
    if (available.length > 0) {
      const randomIndex = Math.floor(Math.random() * available.length);
      flip(available[randomIndex], api);
    } else {
      setLastIndexFlipped(-1);
    }
    const timeEnd = performance.now();
    
    const timeToFlipRandom = Number((timeEnd - timeStart).toFixed(3));
    setTimeToFlipLastRandom(timeToFlipRandom);
  };

  const [springs, api] = useSprings(numBools, () => ({
    backgroundColor: "salmon",
    height: "100px",
    width: "100px",
  }));

  const [lastIndexFlipped, setLastIndexFlipped] = useState(-1);
  const [timeToFlipLast, setTimeToFlipLast] = useState(0);
  const [timeToFlipLastRandom, setTimeToFlipLastRandom] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontWeight: "bold",
          textDecoration: "underline",
        }}
      >
        Efficient Random Boolean Flip
      </h1>
      <div
        style={{
          outlineColor: "white",
          outlineStyle: "solid",
          outlineWidth: "medium",
          flexWrap: "wrap",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {springs.map((props, index) => (
          <animated.button style={props} onClick={() => flip(index, api)}>
            {index}
            <br />
            {flipped[index] ? "On" : "Off"}
          </animated.button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={flipRandomAvailable}
          style={{
            padding: "15px 32px",
            textAlign: "center",
            textDecoration: "none",
            fontSize: "16px",
            margin: "4px 2px",
            cursor: "pointer",
          }}
        >
          Flip Random Boolean
        </button>
        <div>
          <p>Last index flipped: {lastIndexFlipped}</p>
          <p>Time to flip last index: {timeToFlipLast} ms</p>
          <p>Time to flip last random index: {timeToFlipLastRandom} ms</p>
        </div>
      </div>
    </div>
  );
};

export default App;
