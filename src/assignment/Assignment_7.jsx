import { useEffect, useRef, useState } from "react"

import "./Assignment_7.css"

const width = 350
const height = 380

const playerWidth = 80
const playerHeight = 10

const playerY = 250

const itemSize = 20

const playerHalfWidth = playerWidth / 2
const itemHalfSize = itemSize / 2

const speed = 2

const minItemGpa = 40
const spawnDelay = 800

// check if new ball is far enough from others (x axis)
const canPlaceItem = (x, items) => {
    return !items.some(item => Math.abs(item.x -x)< minItemGpa)
}

export default function App() {
  // current score
  const score = useRef(0)
  // list of items [{ x, y }]
  const items = useRef([])
  // controller x axis position
  const player = useRef(width / 2)

  const lastSpawnTime = useRef(0) // last ball spawn time
  // game update timer
  const [time, setTime] = useState(0)
  // current screen
  const [screen, setScreen] = useState("home")
  // start init event handler
  const onInit = () => {
    // check for permission function
    if (DeviceOrientationEvent.requestPermission) {
      // request permission for ios devices
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === "granted") {
          //  switch to game screen
          setScreen("game")
        } else {
          //  switch to error screen
          setScreen("error")
        }
      })
    } else {
      // directly switch to game screen
      setScreen("game")
    }
  }

  // effect on screen change
  useEffect(() => {
    // return if not in game screen
    if (screen !== "game") return
    // current frame id
    let frame = null
    // game update function
    const update = () => {
      // request next game frame
      frame = requestAnimationFrame(update)
        // current time 
      const now = performance.now()
      // allow spawn only after delay 
      const canSpawn = now - lastSpawnTime.current > spawnDelay
      // spawn balls one by one 
      if (items.current.length < 3 && canSpawn) {
        let x 
        let attempts = 0
        // try to find free x position
        do {
            x = 20 + Math.random() * (width - 40)
            attempts++
        } 
        while (!canPlaceItem(x, items.current)&& attempts < 10)

            // add new ball at top
            items.current.push ({x, y: -20})
            // save spawn time 
            lastSpawnTime.current = now 
      }
      // items to remove
      const remove = []
      // increase fall speed as score grows 
      const dynamicSpeed = speed + Math.floor(score.current / 5)
      // for each item
      for (let i = 0; i < items.current.length; i++) {
        // current item
        const item = items.current[i]
        // update item y axis position
        item.y += dynamicSpeed
        // is current item aligned in y axis with player
        const isYTop = item.y + itemHalfSize > playerY
        const isYBottom = item.y - itemHalfSize < playerY + playerHeight
        // is current item aligned in x axis with player
        const isXLeft = item.x + itemHalfSize > (player.current - playerHalfWidth)
        const isXRight = item.x - itemHalfSize < (player.current + playerHalfWidth)
        // is touched
        const isTouched = isYTop && isYBottom && isXLeft && isXRight
        // if item si touched with player controller
        if (isTouched) {
          // push item index to be removed
          remove.push(i)
          // increase player score
          score.current += 1
        }
      }
      // filter out caught items if they includes in to be removed array
      items.current = items.current.filter((_, i) => !remove.includes(i))
      // filter out overflowed items
      items.current = items.current.filter(item => item.y < height)
      // update html context
      setTime(time => time + 1)
    }
    // start game update loop
    update()
    // player update handler
    const updatePlayer = event => {
      // update player controller x position
      player.current = (width / 2) + event.gamma
    }
    // add device orientation event listener
    window.addEventListener("deviceorientation", updatePlayer)
    // abort events on unmount
    return () => {
      // cancel pending animation frame
      cancelAnimationFrame(frame)
      // remove device orientation event listener
      window.removeEventListener("deviceorientation", updatePlayer)
    }
  }, [screen])

  // return home screen
  if (screen === "home") {
    return (
      <div className="container">
        <button className="button" onClick={onInit}>
          Play
        </button>
      </div>
    )
  }

  // return home screen
  if (screen === "error") {
    return (
      <div className="container">
        Allow Permissions Manually
      </div>
    )
  }

  // return game screen
  return (
    <div className="container" data-time={time}>
      <div className="base">
        {/* score */}
        <div className="score">
          Score: {score.current}
        </div>
        {/* items */}
        {
          items.current.map((item, index) => (
            <div
              key={index}
              className="item"
              style={{
                left: item.x,
                top: item.y
              }}
            />
          ))
        }
        {/* player */}
        <div
          className="player"
          style={{
            left: player.current
          }}
        />
      </div>
    </div>
  )
}