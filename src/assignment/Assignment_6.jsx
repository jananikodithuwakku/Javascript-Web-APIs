import { useEffect, useRef, useState } from "react";
import "./Assignment_6.css";

const WIDTH = 300;
const HEIGHT = 300;
const BOX_W = 60; // catcher box width 
const BOX_H = 40; // catcher box height 
const CIRCLE_R = 15; // circle radius 
const GRAVITY = 0.35; // falling speed 
const SPAWN_MS = 1000; // new circle appear(ms)

export default function Assignment_6() {
  const [score, setScore] = useState(0); 
  const [circles, setCircles] = useState([]); // falling circles
  const [boxX, setBoxX] = useState(WIDTH / 2 - BOX_W / 2); // box horizontal position
  const boxXRef = useRef(boxX); // box X position
  const rafRef = useRef(null); // animation frame ID

  useEffect(() => {
    boxXRef.current = boxX;
  }, [boxX]);

  // spawn circles and start loop
  useEffect(() => {
    const spawn = setInterval(() => {
      const x = CIRCLE_R + Math.random() * (WIDTH - 2 * CIRCLE_R);
      setCircles((prev) => [...prev, { id: Math.random(), x, y: -CIRCLE_R }]);
    }, SPAWN_MS);

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      clearInterval(spawn);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // check circle caught in the box 
  function isCaught(circle) {
    const boxTop = HEIGHT / 2 - BOX_H / 2;
    const boxBottom = boxTop + BOX_H;
    const boxLeft = boxXRef.current;
    const boxRight = boxLeft + BOX_W;

    const left = circle.x - CIRCLE_R;
    const right = circle.x + CIRCLE_R;
    const top = circle.y - CIRCLE_R;
    const bottom = circle.y + CIRCLE_R;

    // check overlap
    return !(right < boxLeft || left > boxRight || bottom < boxTop || top > boxBottom);
  }

  // move circles  
  function gameLoop() {
    setCircles((prev) => {
      const updated = [];

      prev.forEach((c) => {
        const newY = c.y + GRAVITY * 16; // move circle down

        if (isCaught({ ...c, y: newY })) {
          setScore((s) => s + 1); 
          return; // remove caught circle
        }

        if (newY > HEIGHT) return; // remove if missed

        updated.push({ ...c, y: newY });
      });

      return updated;
    });

    rafRef.current = requestAnimationFrame(gameLoop);
  }

  // device controls (mobile) 
  useEffect(() => {
    function handleTilt(e) {
      if (e.gamma == null) return;

      const maxTilt = 45;
      const clamped = Math.max(-maxTilt, Math.min(maxTilt, e.gamma));
      const ratio = (clamped + maxTilt) / (2 * maxTilt);
      setBoxX(ratio * (WIDTH - BOX_W));
    }

    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleTilt);
    }

    return () => window.removeEventListener("deviceorientation", handleTilt);
  }, []);

  // mouse move control
  useEffect(() => {
    function onMouseMove(e) {
      const rect = document.getElementById("game-container").getBoundingClientRect();
      const pos = e.clientX - rect.left - BOX_W / 2;
      setBoxX(Math.max(0, Math.min(WIDTH - BOX_W, pos)));
    }

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  
  function resetGame() {
    setScore(0);
    setCircles([]);
    setBoxX(WIDTH / 2 - BOX_W / 2);
  }

  return (
    <div className="game-page">
      <div className="score">
        <div>Score: <strong>{score}</strong></div>
        <button onClick={resetGame}>Reset</button>
      </div>

      <div
        id="game-container"
        className="game"
        style={{ width: WIDTH, height: HEIGHT }}
      >
        <div className="play">
          {circles.map((c) => (
            <div
              key={c.id}
              className="circle"
              style={{
                width: CIRCLE_R * 2,
                height: CIRCLE_R * 2,
                left: c.x - CIRCLE_R,
                top: c.y - CIRCLE_R,
              }}
            />
          ))}

          <div
            className="box"
            style={{
              width: BOX_W,
              height: BOX_H,
              left: boxX,
              top: HEIGHT / 2 - BOX_H / 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}
