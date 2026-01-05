import { useEffect, useRef, useState } from "react"
import "./Assignment_8.css"

const LANES = [40, 120, 200, 280]

export default function HighwayRush() {
  const playerLane = useRef(1)
  const roadY = useRef(0)
  const speed = useRef(0.35)
  const [forceRender, setForceRender] = useState(0)

  useEffect(() => {
    let last = performance.now()
    let frame

    const loop = (time) => {
      const delta = time - last
      last = time

      roadY.current += delta * speed.current
      setForceRender(v => v + 1)

      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") {
        playerLane.current = Math.max(0, playerLane.current - 1)
      }
      if (e.key === "ArrowRight") {
        playerLane.current = Math.min(3, playerLane.current + 1)
      }
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="game">
      <div
        className="road"
        style={{ backgroundPositionY: roadY.current }}
      />

      <div
        className="car player"
        style={{ left: LANES[playerLane.current] }}
      />
    </div>
  )
}
