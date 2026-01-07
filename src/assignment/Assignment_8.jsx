import { useEffect, useRef, useState } from "react";
import cars from "./highway-rush.json";
import "./Assignment_8.css";

const LANES = [80, 145, 210, 275];
const ENEMY_COUNT = 3;
const ENEMY_SPEED_FACTOR = 0.25;
const GAME_HEIGHT = 500;
const PLAYER_BOTTOM = 40;

export default function Assignment_8() {
  const playerLane = useRef(1);
  const playerX = useRef(LANES[1]);
  const roadY = useRef(0);
  const speed = useRef(0.35);
  const frameRef = useRef(null);
  const tiltLock = useRef(false);

  const enemies = useRef(
    Array.from({ length: ENEMY_COUNT }, (_, i) => createEnemy(-i * 250))
  );

  const [gameState, setGameState] = useState("start");
  const [forceRender, setForceRender] = useState(0);
  const [score, setScore] = useState(0);
  const [motionEnabled, setMotionEnabled] = useState(false);
  const [permissionNeeded, setPermissionNeeded] = useState(false);

  // iOS permission 
  useEffect(() => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      setPermissionNeeded(true);
    } else {
      setMotionEnabled(true);
    }
  }, []);

  const enableMotion = async () => {
    const res = await DeviceOrientationEvent.requestPermission();
    if (res === "granted") setMotionEnabled(true);
  };

  // game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    let last = performance.now();

    const loop = (time) => {
      const delta = time - last;
      last = time;

      roadY.current += delta * speed.current;

      // smooth lane sliding 
      const targetX = LANES[playerLane.current];
      playerX.current += (targetX - playerX.current) * 0.18;

      const playerFrontY =
        GAME_HEIGHT - PLAYER_BOTTOM - cars[1].height;

      for (let enemy of enemies.current) {
        enemy.y += delta * speed.current * ENEMY_SPEED_FACTOR;

        const enemyBackY = enemy.y + enemy.sprite.height;

        // instant front - back crash 
        if (
          enemy.lane === playerLane.current &&
          enemyBackY >= playerFrontY &&
          enemyBackY <= playerFrontY + 6
        ) {
          setGameState("crash");
          cancelAnimationFrame(frameRef.current);
          return;
        }

        // score when overtaken 
        if (!enemy.scored && enemy.y > playerFrontY) {
          enemy.scored = true;
          setScore((s) => s + 1);
        }

        // recycle enemy 
        if (enemy.y > GAME_HEIGHT) {
          Object.assign(enemy, createEnemy(-200));
        }
      }

      setForceRender((v) => v + 1);
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameState]);

  // keyboard 
  useEffect(() => {
    const onKey = (e) => {
      if (gameState !== "playing") return;

      if (e.key === "ArrowLeft")
        playerLane.current = Math.max(0, playerLane.current - 1);

      if (e.key === "ArrowRight")
        playerLane.current = Math.min(3, playerLane.current + 1);
    };
    
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState]);

  // mobile tilt 
  useEffect(() => {
    if (!motionEnabled || gameState !== "playing") return;

    const onTilt = (e) => {
      if (tiltLock.current) return;

      if (e.gamma > 12 && playerLane.current < 3) {
        playerLane.current++;
        tiltLock.current = true;
      }
      if (e.gamma < -12 && playerLane.current > 0) {
        playerLane.current--;
        tiltLock.current = true;
      }

      if (tiltLock.current)
        setTimeout(() => (tiltLock.current = false), 300);
    };

    window.addEventListener("deviceorientation", onTilt);
    return () => window.removeEventListener("deviceorientation", onTilt);
  }, [motionEnabled, gameState]);

  const startGame = () => {
    if (permissionNeeded && !motionEnabled) return;
    restartGame();
  };

  const restartGame = () => {
    playerLane.current = 1;
    playerX.current = LANES[1];
    roadY.current = 0;
    setScore(0);

    enemies.current = Array.from({ length: ENEMY_COUNT }, (_, i) =>
      createEnemy(-i * 250)
    );

    setGameState("playing");
  };

  return (
    <div className="game-wrapper">
      <div className="game" data-frame={forceRender}>
        <div
          className="road"
          style={{ backgroundPositionY: roadY.current }}
        />

        <div className="score">Score: {score}</div>

        {enemies.current.map((enemy, i) => (
          <div
            key={i}
            className="car enemy"
            style={{
              left: LANES[enemy.lane],
              top: enemy.y,
              width: enemy.sprite.width,
              height: enemy.sprite.height,
              backgroundPosition: `-${enemy.sprite.x}px -${enemy.sprite.y}px`,
              transform: "translateX(-50%)",
            }}
          />
        ))}

        <div
          className="car player"
          style={{
            left: playerX.current,
            width: cars[1].width,
            height: cars[1].height,
            backgroundPosition: `-${cars[1].x}px -${cars[1].y}px`,
            transform: "translateX(-50%)",
          }}
        />

        {(gameState === "start" || gameState === "crash") && (
          <div className="overlay">
            <h2>{gameState === "start" ? "Highway Rush" : "GAME OVER"}</h2>
            <p>Score: {score}</p>

            {permissionNeeded && !motionEnabled && (
              <button onClick={enableMotion}>Enable Motion</button>
            )}

            <button onClick={startGame}>
              {gameState === "start" ? "Start" : "Restart"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function createEnemy(startY = -200) { // new car entering highway
  return {
    lane: Math.floor(Math.random() * 4), // road lane
    y: startY, // distance from player
    scored: false, // passed safely
    sprite: cars[Math.floor(Math.random() * cars.length)], // car model
  };
}
